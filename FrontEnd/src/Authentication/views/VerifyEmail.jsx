import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export default function VerifyEmail({ onVerifySuccess }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const verifyUrl = searchParams.get('verify_url');
    
    if (!verifyUrl) {
      setStatus('error');
      setErrorMsg('Invalid verification link.');
      return;
    }

    const verifyEmailToken = async () => {
      try {
        await axios.get('/sanctum/csrf-cookie');
        
        // Extract the relative path so we hit the exact same domain as our baseURL
        const urlObj = new URL(verifyUrl);
        const relativePath = urlObj.pathname + urlObj.search;

        // Call the backend signed URL using the relative path
        const response = await axios.get(relativePath, {
          headers: {
            'Accept': 'application/json'
          }
        });

        setStatus('success');
        
        // Delay slightly for UX before telling App to update user state and redirect
        setTimeout(async () => {
          const context = localStorage.getItem('verify_context');
          if (context === 'signup') {
            try { await axios.post('/api/logout'); } catch(e) {}
            localStorage.removeItem('verify_context');
            onVerifySuccess('login');
          } else {
            localStorage.removeItem('verify_context');
            onVerifySuccess('dashboard');
          }
        }, 1500);

      } catch (error) {
        setStatus('error');
        if (error.response && error.response.data && error.response.data.message) {
          setErrorMsg(error.response.data.message);
        } else {
          setErrorMsg('Verification failed or link expired.');
        }
      }
    };

    verifyEmailToken();
  }, [searchParams, onVerifySuccess]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white max-w-md w-full rounded-2xl shadow-sm border border-[#E2E8F0] p-8 text-center"
      >
        {status === 'verifying' && (
          <div className="flex flex-col items-center">
            <ArrowPathIcon className="w-12 h-12 text-[#FF2D20] animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-[#0F172A] mb-2 font-poppins">Verifying your email</h2>
            <p className="text-[#64748B] text-sm">Please wait while we confirm your workspace access.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircleIcon className="w-12 h-12 text-emerald-500 mb-4" />
            <h2 className="text-xl font-semibold text-[#0F172A] mb-2 font-poppins">Account Verified!</h2>
            <p className="text-[#64748B] text-sm">
              {localStorage.getItem('verify_context') === 'signup' 
                ? "Your account is active. Now you can Login and access your Dashboard." 
                : "You are now being redirected to your Dashboard..."}
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <XCircleIcon className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-[#0F172A] mb-2 font-poppins">Verification Failed</h2>
            <p className="text-red-600 text-sm mb-6">{errorMsg}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#FF2D20] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#E5261A] transition-colors"
            >
              Return Home
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
