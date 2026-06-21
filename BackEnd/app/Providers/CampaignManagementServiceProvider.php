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
            \Domain\CampaignManagement\Contracts\Repositories\CampaignRepositoryInterface::class,
            \Domain\CampaignManagement\Repositories\CampaignRepository::class
        );
        $this->app->bind(
            \Domain\CampaignManagement\Contracts\Repositories\AdSetRepositoryInterface::class,
            \Domain\CampaignManagement\Repositories\AdSetRepository::class
        );
        $this->app->bind(
            \Domain\CampaignManagement\Contracts\Repositories\AdRepositoryInterface::class,
            \Domain\CampaignManagement\Repositories\AdRepository::class
        );

        // Services
        $this->app->bind(
            \Domain\CampaignManagement\Contracts\Services\CampaignServiceInterface::class,
            \Domain\CampaignManagement\Services\CampaignService::class
        );
        $this->app->bind(
            \Domain\CampaignManagement\Contracts\Services\AdSetServiceInterface::class,
            \Domain\CampaignManagement\Services\AdSetService::class
        );
        $this->app->bind(
            \Domain\CampaignManagement\Contracts\Services\AdServiceInterface::class,
            \Domain\CampaignManagement\Services\AdService::class
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
