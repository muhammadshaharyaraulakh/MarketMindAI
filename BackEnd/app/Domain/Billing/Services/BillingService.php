<?php
namespace App\App\Domain\Billing\Services;

use App\App\Domain\Billing\Contracts\Services\BillingServiceInterface;
use App\App\Domain\Billing\Contracts\Repositories\StripeRepositoryInterface;
use App\Models\User;
use Stripe\PaymentIntent;
use Stripe\Event;

class BillingService implements BillingServiceInterface
{
    protected StripeRepositoryInterface $stripeRepository;

    public function __construct(StripeRepositoryInterface $stripeRepository)
    {
        $this->stripeRepository = $stripeRepository;
    }

    public function processPaymentIntent(User $user, int $amount, string $currency): PaymentIntent
    {
        $customerId = $this->stripeRepository->getOrCreateCustomer($user);
        return $this->stripeRepository->createPaymentIntent($customerId, $amount, $currency);
    }

    public function handleWebhook(string $payload, string $sigHeader): Event
    {
        $endpointSecret = config('stripe.webhook_secret');
        return $this->stripeRepository->verifyWebhookSignature($payload, $sigHeader, $endpointSecret);
    }
}
