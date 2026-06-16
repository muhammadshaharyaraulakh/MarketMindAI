<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\Request;
use Exception;

class OAuthController extends Controller
{

    public function redirect(string $provider)
    {
        if (!in_array($provider, ['github', 'google'])) {
            return response()->json(['message' => 'Provider not supported'], 400);
        }

        return response()->json([
            'url' => Socialite::driver($provider)->stateless()->redirect()->getTargetUrl()
        ]);
    }

    public function callback(string $provider, Request $request)
    {
        if (!in_array($provider, ['github', 'google'])) {
            return redirect(config('app.frontend_url') . '/login?error=Provider+not+supported');
        }

        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
            
            $user = User::where('provider', $provider)->where('provider_id', $socialUser->getId())->first();

            if (! $user) {
                $user = User::where('email', $socialUser->getEmail())->first();

                if ($user) {
                    $user->update([
                        'provider' => $provider,
                        'provider_id' => $socialUser->getId(),
                        'avatar' => $user->avatar ?? $socialUser->getAvatar(),
                    ]);
                } else {
                    $user = User::create([
                        'name' => $socialUser->getName() ?? $socialUser->getNickname(),
                        'email' => $socialUser->getEmail(),
                        'provider' => $provider,
                        'provider_id' => $socialUser->getId(),
                        'avatar' => $socialUser->getAvatar(),
                        'email_verified_at' => now(),
                    ]);
                }
            }

            if (! $user->hasVerifiedEmail()) {
                $user->markEmailAsVerified();
            }

            Auth::login($user, true);

            return redirect(config('app.frontend_url') . '/dashboard');
        } catch (Exception $e) {
            return redirect(config('app.frontend_url') . '/login?error=Authentication+failed');
        }
    }
}
