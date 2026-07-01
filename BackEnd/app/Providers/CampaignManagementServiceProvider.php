<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class CampaignManagementServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Repositories
        $this->app->bind(
            \App\Domain\CampaignManagement\Contracts\Repositories\CampaignRepositoryInterface::class,
            \App\Domain\CampaignManagement\Repositories\CampaignRepository::class
        );
        $this->app->bind(
            \App\Domain\CampaignManagement\Contracts\Repositories\AdSetRepositoryInterface::class,
            \App\Domain\CampaignManagement\Repositories\AdSetRepository::class
        );
        $this->app->bind(
            \App\Domain\CampaignManagement\Contracts\Repositories\AdRepositoryInterface::class,
            \App\Domain\CampaignManagement\Repositories\AdRepository::class
        );

        // Services
        $this->app->bind(
            \App\Domain\CampaignManagement\Contracts\Services\CampaignServiceInterface::class,
            \App\Domain\CampaignManagement\Services\CampaignService::class
        );
        $this->app->bind(
            \App\Domain\CampaignManagement\Contracts\Services\AdSetServiceInterface::class,
            \App\Domain\CampaignManagement\Services\AdSetService::class
        );
        $this->app->bind(
            \App\Domain\CampaignManagement\Contracts\Services\AdServiceInterface::class,
            \App\Domain\CampaignManagement\Services\AdService::class
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
