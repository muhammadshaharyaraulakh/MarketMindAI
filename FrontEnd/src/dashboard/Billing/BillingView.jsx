import React, { useState } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PricingSection from '../../components/PricingSection';
import CheckoutForm from './CheckoutForm';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// Initialize Stripe outside component render to avoid recreating the object
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY || 'pk_test_51TlUpFC6U3ChvVf9zCW3DOX4AGMela949fNnb75FZ1uRr1MIWD8qtaQbKrfF8Lq0Yw8NSM39G7dxRyoe7bpVIPOX00gIYnLA2a');

export default function BillingView() {
  const [clientSecret, setClientSecret] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);

  const handleSelectPlan = async (plan, displayPrice) => {
    // Treat 'Custom' or 0 as contact sales/free (not handled here)
    if (displayPrice === null || displayPrice === 0) return;

    setSelectedPlan(plan);
    setSelectedPrice(displayPrice);
    setLoading(true);
    setClientSecret('');
    setPaymentError('');

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
      setPaymentError(error.response?.data?.message || 'Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedPlan(null);
    setSelectedPrice(null);
    setClientSecret('');
    setPaymentError('');
  };

  const handleSuccess = (paymentIntent) => {
    const planName = selectedPlan.name;
    handleClose();
    setSuccessInfo(planName);
  };

  return (
    <div className="w-full -mt-8 relative">
      <PricingSection onSelectPlan={handleSelectPlan} />

      {/* Checkout Modal */}
      {selectedPlan && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-sm transition-opacity"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative">
            {/* Header with close button */}
            <div className="p-6 border-b border-[#E2E8F0] flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#0F172A]">
                  Upgrade to {selectedPlan.name}
                </h3>
                <p className="text-sm text-[#475569] mt-1 font-medium">Complete your secure payment below.</p>
              </div>
              <button 
                onClick={handleClose}
                className="p-1 rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer -mr-1 -mt-1"
                aria-label="Close"
              >
                <XMarkIcon className="w-5 h-5 text-[#94A3B8]" />
              </button>
            </div>

            {/* Price summary */}
            {selectedPrice && (
              <div className="px-6 pt-4 pb-2">
                <div className="flex items-center justify-between bg-[#F8FAFC] rounded-xl px-4 py-3 border border-[#E2E8F0]">
                  <span className="text-sm font-semibold text-[#475569]">{selectedPlan.name} Plan</span>
                  <span className="text-lg font-bold text-[#0F172A]">${selectedPrice.toLocaleString()}.00</span>
                </div>
              </div>
            )}
            
            <div className="p-6 min-h-[200px]">
              {loading && !clientSecret ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF2D20]"></div>
                </div>
              ) : clientSecret ? (
                <Elements stripe={stripePromise} options={{ 
                  clientSecret, 
                  appearance: { 
                    theme: 'stripe',
                    variables: {
                      fontFamily: '"Poppins", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                      fontWeightNormal: '300',
                      fontWeightMedium: '400',
                      fontWeightBold: '500',
                      colorText: '#0F172A',
                      colorPrimary: '#FF2D20',
                    },
                    rules: {
                      '.TabIcon': { display: 'none' },
                      '.AccordionItemIcon': { display: 'none' },
                      '.Label': {
                        fontFamily: '"Poppins", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                        fontWeight: '300',
                      },
                      '.Input': {
                        fontFamily: '"Poppins", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                        fontWeight: '300',
                      },
                      '.Block': {
                        fontFamily: '"Poppins", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                      }
                    }
                  } 
                }}>
                  <CheckoutForm 
                    clientSecret={clientSecret}
                    onSuccess={handleSuccess} 
                    onCancel={handleClose} 
                  />
                </Elements>
              ) : paymentError ? (
                <div className="text-center py-8 space-y-4">
                  <div className="text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-200 font-medium">
                    {paymentError}
                  </div>
                  <button 
                    onClick={() => handleSelectPlan(selectedPlan, selectedPrice)}
                    className="px-6 py-2.5 bg-[#FF2D20] hover:bg-[#E5261A] text-white rounded-lg font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-[#475569] font-medium">Something went wrong. Please close and try again.</p>
                  <button 
                    onClick={handleClose}
                    className="mt-4 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {successInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative p-8 text-center">
            <button 
              onClick={() => setSuccessInfo(null)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <XMarkIcon className="w-5 h-5 text-[#94A3B8]" />
            </button>

            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-9 h-9 text-green-600" />
            </div>

            <h3 className="text-xl font-bold text-[#0F172A] mb-2">Payment Successful</h3>
            <p className="text-sm text-[#475569] font-medium">
              Welcome to the <span className="font-bold text-[#0F172A]">{successInfo}</span> plan.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
