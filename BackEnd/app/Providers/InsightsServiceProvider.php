<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class InsightsServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(
            \Domain\Insights\Contracts\Services\AnomalyDetectionServiceInterface::class,
            \Domain\Insights\Services\AnomalyDetectionService::class
        );

        $this->app->bind(
            \Domain\Insights\Contracts\Services\RecommendationServiceInterface::class,
            \Domain\Insights\Services\RecommendationService::class
        );

        $this->app->bind(
            \Domain\Insights\Contracts\Services\InsightsPineconeServiceInterface::class,
            \Domain\Insights\Services\InsightsPineconeService::class
        );

        $this->app->bind(
            \Domain\Insights\Contracts\Repositories\AlertRepositoryInterface::class,
            \Domain\Insights\Repositories\AlertRepository::class
        );

        $this->app->bind(
            \Domain\Insights\Contracts\Repositories\RecommendationRepositoryInterface::class,
            \Domain\Insights\Repositories\RecommendationRepository::class
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
