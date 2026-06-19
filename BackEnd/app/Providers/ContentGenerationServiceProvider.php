<?php
namespace App\Providers;

use Domain\ContentGeneration\Contracts\Repositories\ContentGenerationRepositoryInterface;
use Domain\ContentGeneration\Contracts\Services\ContentGenerationServiceInterface;
use Domain\ContentGeneration\Contracts\Services\ImageAnalysisServiceInterface;
use Domain\ContentGeneration\Repositories\ContentGenerationRepository;
use Domain\ContentGeneration\Services\ContentGenerationService;
use Domain\ContentGeneration\Services\ImageAnalysisService;
use Illuminate\Support\ServiceProvider;

class ContentGenerationServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            ContentGenerationRepositoryInterface::class,
            ContentGenerationRepository::class
        );
        $this->app->bind(
            ContentGenerationServiceInterface::class,
            ContentGenerationService::class
        );
        $this->app->bind(
            ImageAnalysisServiceInterface::class,
            ImageAnalysisService::class
        );
    }
}
