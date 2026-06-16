<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class ApiVerificationController extends Controller
{
    public function verify(Request $request, $id, $hash)
    {
        $user = User::findOrFail($id);

        if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return new JsonResponse(['message' => 'Invalid verification link'], 403);
        }

        if ($user->hasVerifiedEmail()) {
            $token = $user->createToken('auth_token')->plainTextToken;
            return new JsonResponse(['message' => 'Email already verified', 'token' => $token], 200);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return new JsonResponse(['message' => 'Email verified successfully', 'token' => $token], 200);
    }

    /**
     * Resend verification link (throttled). Always returns a generic
     * success message to avoid account enumeration.
     */
    public function resend(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $email = $request->input('email');
        $throttleKey = 'verification-resend|' . Str::lower($email) . '|' . $request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 3)) {
            return new JsonResponse(['message' => 'Too many requests, please try again later.'], 429);
        }

        RateLimiter::hit($throttleKey, 3600); // limit to 3 per hour

        $user = User::where('email', $email)->first();

        if (! $user) {
            return new JsonResponse(['message' => 'If that email is registered, a verification link will be sent.'], 200);
        }

        if ($user->hasVerifiedEmail()) {
            return new JsonResponse(['message' => 'Email already verified.'], 200);
        }

        $user->sendEmailVerificationNotification();

        return new JsonResponse(['message' => 'If that email is registered, a verification link will be sent.'], 200);
    }
}
