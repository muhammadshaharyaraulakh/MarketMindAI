<?php

namespace App\Http\Controllers\Api\Authentication;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Laravel\Fortify\Contracts\ResetsUserPasswords;
use Laravel\Fortify\Contracts\TwoFactorAuthenticationProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Password;

class AuthController extends Controller
{
    public function register(Request $request, CreatesNewUsers $creator)
    {
        $user = $creator->create($request->all());
        event(new Registered($user));

        // Return response without auto-logging in
        return response()->json([
            'message' => 'Registration successful. Please check your inbox to verify your email address.',
            'email' => $user->email
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user && Hash::check($request->password, $user->password)) {
            // Check Email Verification
            if (!$user->hasVerifiedEmail()) {
                $user->sendEmailVerificationNotification();
                return response()->json([
                    'email_unverified' => true,
                    'message' => "Please verify your email. We've sent a new verification link to {$user->email}."
                ], 403);
            }

            // Check 2FA
            if ($user->two_factor_secret) {
                $request->session()->put([
                    'login.id' => $user->getKey(),
                    'login.remember' => $request->boolean('remember'),
                ]);
                return response()->json([
                    'message' => '2FA required',
                    'two_factor' => true,
                ], 200);
            }

            // Standard Login
            Auth::guard('web')->login($user, $request->boolean('remember'));
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Authenticated.',
                'two_factor' => false,
                'user' => $user,
                'token' => $token,
                'redirect' => '/dashboard'
            ], 200)->cookie('auth_token', $token, 60*24*30, '/', null, false, true, false, 'Strict');
        }

        throw ValidationException::withMessages([
            'email' => [trans('auth.failed')],
        ]);
    }

    public function twoFactorChallenge(Request $request, TwoFactorAuthenticationProvider $provider)
    {
        $request->validate([
            'code' => 'nullable|string',
            'recovery_code' => 'nullable|string',
        ]);

        if (!$request->session()->has('login.id')) {
            return response()->json(['message' => 'Session expired or invalid.'], 401);
        }

        $user = User::find($request->session()->get('login.id'));
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $valid = false;

        if ($code = $request->input('code')) {
            $valid = $provider->verify(decrypt($user->two_factor_secret), $code);
        } elseif ($recoveryCode = $request->input('recovery_code')) {
            $recoveryCodes = json_decode(decrypt($user->two_factor_recovery_codes), true);
            $index = array_search($recoveryCode, $recoveryCodes);
            if ($index !== false) {
                $valid = true;
                unset($recoveryCodes[$index]);
                $user->forceFill([
                    'two_factor_recovery_codes' => encrypt(json_encode(array_values($recoveryCodes))),
                ])->save();
            }
        }

        if ($valid) {
            Auth::guard('web')->login($user, $request->session()->get('login.remember', false));
            $request->session()->forget(['login.id', 'login.remember']);

            $token = $user->createToken('auth_token')->plainTextToken;
            return response()->json([
                'message' => 'Authenticated.',
                'user' => $user,
                'token' => $token,
                'redirect' => '/dashboard'
            ], 200)->cookie('auth_token', $token, 60*24*30, '/', null, false, true, false, 'Strict');
        }

        throw ValidationException::withMessages([
            'code' => ['The provided two factor authentication code was invalid.'],
        ]);
    }

    public function verifyEmail(Request $request, $id, $hash)
    {
        $user = User::findOrFail($id);

        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json(['message' => 'Invalid verification link.'], 403);
        }

        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        Auth::guard('web')->login($user);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Email verified successfully.',
            'user' => $user,
            'token' => $token,
            'redirect' => '/dashboard'
        ], 200)->cookie('auth_token', $token, 60*24*30, '/', null, false, true, false, 'Strict');
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        Password::broker()->sendResetLink($request->only('email'));

        return response()->json([
            'message' => trans(Password::RESET_LINK_SENT)
        ], 200);
    }

    public function resetPassword(Request $request, ResetsUserPasswords $resetter)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required',
            'password_confirmation' => 'required'
        ]);

        $status = Password::broker()->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) use ($resetter, $request) {
                $resetter->reset($user, $request->all());
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            return response()->json([
                'message' => trans($status),
                'redirect' => '/login'
            ], 200);
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }

    public function logout(Request $request)
    {
        // Revoke the current token
        if ($request->user() && $request->user()->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
        }

        // Clear session if it exists (for Fortify compatibility)
        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json([
            'message' => 'Successfully logged out.',
            'redirect' => '/login'
        ])->withoutCookie('auth_token');
    }
}
