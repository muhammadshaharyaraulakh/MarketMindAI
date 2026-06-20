<?php

use App\Providers\AppServiceProvider;
use App\Providers\FortifyServiceProvider;

return [
    AppServiceProvider::class,
    FortifyServiceProvider::class,
    App\Providers\ContentGenerationServiceProvider::class,
    App\Providers\DataIngestionServiceProvider::class,
    App\Providers\ReportServiceProvider::class,
];
