<?php
namespace App\App\Domain\Billing\Repositories;

use App\App\Domain\Billing\Contracts\Repositories\StripeRepositoryInterface;
use App\Models\User;
use Stripe\Stripe;
use Stripe\Customer;
use Stripe\PaymentIntent;
use Stripe\Webhook;
use Stripe\Event;

class StripeRepository implements StripeRepositoryInterface
{
    public function __construct()
    {
        Stripe::setApiKey(config('stripe.secret'));
    }

    public function getOrCreateCustomer(User $user): string
    {
        if (!$user->stripe_customer_id) {
            $customer = Customer::create([
                'email' => $user->email,
                'name' => $user->name,
            ]);
            
            $user->update(['stripe_customer_id' => $customer->id]);
        }
        
        return $user->stripe_customer_id;
    }

    public function createPaymentIntent(string $customerId, int $amount, string $currency): PaymentIntent
    {
        return PaymentIntent::create([
            'amount' => $amount,
            'currency' => $currency,
            'customer' => $customerId,
            'automatic_payment_methods' => [
                'enabled' => true,
            ],
        ]);
    }

    public function verifyWebhookSignature(string $payload, string $sigHeader, string $secret): Event
    {
        return Webhook::constructEvent($payload, $sigHeader, $secret);
    }
}
