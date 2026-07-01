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
            \App\Domain\Insights\Contracts\Services\AnomalyDetectionServiceInterface::class,
            \App\Domain\Insights\Services\AnomalyDetectionService::class
        );

        $this->app->bind(
            \App\Domain\Insights\Contracts\Services\RecommendationServiceInterface::class,
            \App\Domain\Insights\Services\RecommendationService::class
        );

        $this->app->bind(
            \App\Domain\Insights\Contracts\Services\InsightsPineconeServiceInterface::class,
            \App\Domain\Insights\Services\InsightsPineconeService::class
        );

        $this->app->bind(
            \App\Domain\Insights\Contracts\Repositories\AlertRepositoryInterface::class,
            \App\Domain\Insights\Repositories\AlertRepository::class
        );

        $this->app->bind(
            \App\Domain\Insights\Contracts\Repositories\RecommendationRepositoryInterface::class,
            \App\Domain\Insights\Repositories\RecommendationRepository::class
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
