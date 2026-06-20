<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Domain\Reports\Contracts\Repositories\ReportRepositoryInterface;
use Domain\Reports\Repositories\ReportRepository;
use Domain\Reports\Contracts\Services\ReportDataServiceInterface;
use Domain\Reports\Services\ReportDataService;
use Domain\Reports\Contracts\Services\ReportPdfServiceInterface;
use Domain\Reports\Services\ReportPdfService;
use Domain\Reports\Contracts\Services\ReportAiServiceInterface;
use Domain\Reports\Services\ReportAiService;

class ReportServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(ReportRepositoryInterface::class, ReportRepository::class);
        $this->app->bind(ReportDataServiceInterface::class, ReportDataService::class);
        $this->app->bind(ReportPdfServiceInterface::class, ReportPdfService::class);
        $this->app->bind(ReportAiServiceInterface::class, ReportAiService::class);
    }

    public function boot()
    {
        //
    }
}
