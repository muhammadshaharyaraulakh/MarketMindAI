<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Database\Eloquent\Relations\Relation;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Domain\Overview\Contracts\Services\OverviewServiceInterface::class,
            \App\Domain\Overview\Services\OverviewService::class
        );
        $this->app->bind(
            \App\Domain\CampaignManagement\Contracts\Services\CampaignServiceInterface::class,
            \App\Domain\CampaignManagement\Services\CampaignService::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Relation::enforceMorphMap([
            'campaign' => \App\Models\Campaign::class,
            'ad_set'   => \App\Models\AdSet::class,
            'ad'       => \App\Models\Ad::class,
            'user'     => \App\Models\User::class,
        ]);

        VerifyEmail::createUrlUsing(function ($notifiable) {
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            $backendVerifyUrl = URL::temporarySignedRoute(
                'api.verification.verify',
                Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
                [
                    'id' => $notifiable->getKey(),
                    'hash' => sha1($notifiable->getEmailForVerification()),
                ]
            );
            return $frontendUrl . '/verify-email?verify_url=' . urlencode($backendVerifyUrl);
        });

        ResetPassword::createUrlUsing(function ($user, string $token) {
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            return $frontendUrl . '/reset-password?token=' . $token . '&email=' . urlencode($user->email);
        });
    }
}
