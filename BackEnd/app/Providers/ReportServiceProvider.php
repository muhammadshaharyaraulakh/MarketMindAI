<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Domain\Reports\Contracts\Repositories\ReportRepositoryInterface;
use App\Domain\Reports\Repositories\ReportRepository;
use App\Domain\Reports\Contracts\Services\ReportDataServiceInterface;
use App\Domain\Reports\Services\ReportDataService;
use App\Domain\Reports\Contracts\Services\ReportPdfServiceInterface;
use App\Domain\Reports\Services\ReportPdfService;
use App\Domain\Reports\Contracts\Services\ReportAiServiceInterface;
use App\Domain\Reports\Services\ReportAiService;

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
