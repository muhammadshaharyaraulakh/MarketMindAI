import React, { useState } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PricingSection from '../../components/PricingSection';
import CheckoutForm from './CheckoutForm';

// Initialize Stripe outside component render to avoid recreating the object
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY || 'pk_test_51TlUpFC6U3ChvVf9zCW3DOX4AGMela949fNnb75FZ1uRr1MIWD8qtaQbKrfF8Lq0Yw8NSM39G7dxRyoe7bpVIPOX00gIYnLA2a');

export default function BillingView() {
  const [clientSecret, setClientSecret] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelectPlan = async (plan, displayPrice) => {
    // Treat 'Custom' or 0 as contact sales/free (not handled here)
    if (displayPrice === null || displayPrice === 0) return;

    setSelectedPlan(plan);
    setLoading(true);
    setClientSecret('');

    try {
      // Create PaymentIntent via Laravel API
      const response = await axios.post('/api/stripe/payment-intent', {
        amount: displayPrice * 100, // Stripe expects cents
        currency: 'usd',
      });
      
      if (response.data?.client_secret) {
        setClientSecret(response.data.client_secret);
      }
    } catch (error) {
      console.error('Failed to initialize payment:', error);
      alert('Failed to initialize payment. Please try again.');
      setSelectedPlan(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (paymentIntent) => {
    alert(`Payment successful! Welcome to the ${selectedPlan.name} plan.`);
    setSelectedPlan(null);
    setClientSecret('');
  };

  return (
    <div className="w-full -mt-8 relative">
      <PricingSection onSelectPlan={handleSelectPlan} />

      {/* Checkout Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
            <div className="p-6 border-b border-[#E2E8F0]">
              <h3 className="text-xl font-bold text-[#0F172A]">
                Upgrade to {selectedPlan.name}
              </h3>
              <p className="text-sm text-[#475569] mt-1 font-medium">Complete your secure payment below.</p>
            </div>
            
            <div className="p-6">
              {loading && !clientSecret ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF2D20]"></div>
                </div>
              ) : clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                  <CheckoutForm 
                    onSuccess={handleSuccess} 
                    onCancel={() => setSelectedPlan(null)} 
                  />
                </Elements>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
