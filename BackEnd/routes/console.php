<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

use Illuminate\Support\Facades\Schedule;
use App\Jobs\DeleteExpiredSimulationsJob;

Schedule::job(new DeleteExpiredSimulationsJob())
    ->daily()
    ->at('02:00')
    ->onOneServer()
    ->withoutOverlapping();

use App\Jobs\DeleteExpiredGenerationsJob;
Schedule::job(new DeleteExpiredGenerationsJob())
    ->daily()
    ->at('03:00')
    ->onOneServer()
    ->withoutOverlapping();

use App\Jobs\DetectAnomaliesJob;
Schedule::job(new DetectAnomaliesJob(null))
    ->dailyAt('06:00')
    ->onOneServer()
    ->withoutOverlapping();
