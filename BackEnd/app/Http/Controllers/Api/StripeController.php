<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Domain\Billing\Contracts\Services\BillingServiceInterface;

class StripeController extends Controller
{
    protected BillingServiceInterface $billingService;

    public function __construct(BillingServiceInterface $billingService)
    {
        $this->billingService = $billingService;
    }

    public function createPaymentIntent(\App\Http\Requests\StripePaymentRequest $request)
    {
        try {
            $user = $request->user();
            $paymentIntent = $this->billingService->processPaymentIntent($user, $request->amount, $request->currency);

            return response()->json([
                'status' => 'success',
                'client_secret' => $paymentIntent->client_secret,
            ]);
            
        } catch (\Stripe\Exception\ApiErrorException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred while processing payment.'
            ], 500);
        }
    }

    public function handleWebhook(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');

        try {
            $event = $this->billingService->handleWebhook($payload, $sigHeader);
        } catch (\UnexpectedValueException $e) {
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        switch ($event->type) {
            case 'payment_intent.succeeded':
                $paymentIntent = $event->data->object;
                // You can log or update DB for successful payment
                \Log::info("Payment succeeded for intent: {$paymentIntent->id}");
                break;
                
            case 'payment_intent.payment_failed':
                $paymentIntent = $event->data->object;
                \Log::warning("Payment failed for intent: {$paymentIntent->id}");
                break;
                
            default:
                // Unhandled event type
                break;
        }

        return response()->json(['status' => 'success']);
    }
}
