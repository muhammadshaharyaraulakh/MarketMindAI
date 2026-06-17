<?php

namespace App\Http\Controllers\Api\Authentication;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class OAuthController extends Controller
{
    public function redirect($provider)
    {
        return response()->json([
            'url' => Socialite::driver($provider)->stateless()->redirect()->getTargetUrl()
        ]);
    }

    public function callback($provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
            
            $user = User::where('email', $socialUser->getEmail())->first();

            if (!$user) {
                // If user doesn't exist, create them and automatically verify email
                $user = User::create([
                    'name' => $socialUser->getName() ?? $socialUser->getNickname() ?? 'User',
                    'email' => $socialUser->getEmail(),
                    'password' => bcrypt(Str::random(24)),
                    'email_verified_at' => now(),
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId(),
                ]);
            } else if (!$user->hasVerifiedEmail()) {
                // If user exists but is unverified, automatically verify them since they logged in via OAuth
                $user->markEmailAsVerified();
            }

            Auth::guard('web')->login($user);
            $token = $user->createToken('auth_token')->plainTextToken;

            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

            // Set the cookie and redirect to the frontend dashboard
            return redirect($frontendUrl . '/dashboard')
                ->cookie('auth_token', $token, 60*24*30, '/', null, false, true, false, 'Strict');

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('OAuth Callback Failed: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            return redirect($frontendUrl . '/?error=oauth_failed&reason=' . urlencode($e->getMessage()));
        }
    }
}
