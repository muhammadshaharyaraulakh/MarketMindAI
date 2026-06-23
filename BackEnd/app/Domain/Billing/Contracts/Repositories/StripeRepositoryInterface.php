<?php
namespace App\Domain\Billing\Contracts\Repositories;

use App\Models\User;
use Stripe\PaymentIntent;
use Stripe\Event;

interface StripeRepositoryInterface
{
    public function getOrCreateCustomer(User $user): string;
    public function createPaymentIntent(string $customerId, int $amount, string $currency): PaymentIntent;
    public function verifyWebhookSignature(string $payload, string $sigHeader, string $secret): Event;
}
