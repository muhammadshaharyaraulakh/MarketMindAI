<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Domain\DataIngestion\Contracts\Repositories\CsvUploadRepositoryInterface;
use App\Domain\DataIngestion\Contracts\Repositories\CampaignIngestionRepositoryInterface;
use App\Domain\DataIngestion\Contracts\Services\CsvParsingServiceInterface;
use App\Domain\DataIngestion\Contracts\Services\PineconeServiceInterface;
use App\Domain\DataIngestion\Repositories\CsvUploadRepository;
use App\Domain\DataIngestion\Repositories\CampaignIngestionRepository;
use App\Domain\DataIngestion\Services\CsvParsingService;
use App\Domain\DataIngestion\Services\PineconeService;

class DataIngestionServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(CsvUploadRepositoryInterface::class, CsvUploadRepository::class);
        $this->app->bind(CampaignIngestionRepositoryInterface::class, CampaignIngestionRepository::class);
        $this->app->bind(CsvParsingServiceInterface::class, CsvParsingService::class);
        $this->app->bind(PineconeServiceInterface::class, PineconeService::class);
    }

    public function boot()
    {
        //
    }
}
