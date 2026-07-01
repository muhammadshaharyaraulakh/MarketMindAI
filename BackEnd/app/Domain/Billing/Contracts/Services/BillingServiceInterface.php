<?php
namespace App\App\Domain\Billing\Contracts\Services;

use App\Models\User;
use Stripe\PaymentIntent;
use Stripe\Event;

interface BillingServiceInterface
{
    public function processPaymentIntent(User $user, int $amount, string $currency): PaymentIntent;
    public function handleWebhook(string $payload, string $sigHeader): Event;
}
