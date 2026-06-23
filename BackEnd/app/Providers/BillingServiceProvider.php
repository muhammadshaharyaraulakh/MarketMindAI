<?php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Domain\Billing\Contracts\Repositories\StripeRepositoryInterface;
use App\Domain\Billing\Contracts\Services\BillingServiceInterface;
use App\Domain\Billing\Repositories\StripeRepository;
use App\Domain\Billing\Services\BillingService;

class BillingServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(StripeRepositoryInterface::class, StripeRepository::class);
        $this->app->bind(BillingServiceInterface::class, BillingService::class);
    }

    public function boot()
    {
        //
    }
}
