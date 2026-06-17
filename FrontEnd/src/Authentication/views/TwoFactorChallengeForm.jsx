import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowPathIcon, ArrowRightIcon, ArrowLeftIcon, KeyIcon } from '@heroicons/react/24/outline'
import FeedbackAlert from '../components/FeedbackAlert'
import OtpCodeInput from '../components/OtpCodeInput'
import axios from 'axios'

export default function TwoFactorChallengeForm({ onSwitchView, onSuccess, pageVariants }) {
  const [code, setCode] = useState('')
  const [recoveryCode, setRecoveryCode] = useState('')
  const [useRecoveryCode, setUseRecoveryCode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleChallengeSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!useRecoveryCode && code.length < 6) {
      setErrorMsg('Please enter the complete 6 digit code.')
      return
    }
    if (useRecoveryCode && !recoveryCode) {
      setErrorMsg('Please enter your recovery code.')
      return
    }

    setLoading(true)

    try {
      await axios.get('/sanctum/csrf-cookie');
      const payload = useRecoveryCode ? { recovery_code: recoveryCode } : { code }
      const response = await axios.post('/api/two-factor-challenge', payload, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      setLoading(false)
      onSuccess()
    } catch (error) {
      setLoading(false)
      if (error.response && error.response.status === 422) {
        const errors = error.response.data.errors;
        const firstErrorMsg = errors ? Object.values(errors)[0][0] : error.response.data.message;
        setErrorMsg(firstErrorMsg || 'Invalid code provided');
      } else {
        setErrorMsg('An error occurred during authentication. Please try again.');
      }
    }
  }

  return (
    <motion.div
      key="two-factor-challenge"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <FeedbackAlert errorMsg={errorMsg} />

      <button
        onClick={() => onSwitchView('login')}
        className="inline-flex items-center gap-1 text-xs font-bold text-[#94A3B8] hover:text-[#FF2D20] mb-4 transition-colors cursor-pointer font-poppins no-underline"
      >
        <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to Login
      </button>

      <h3 className="text-2xl font-semibold text-[#0F172A] tracking-tight mb-2 text-center font-poppins">Two Factor Security</h3>
      <p className="text-[#475569] text-sm mb-6 text-center font-medium">
        {useRecoveryCode
          ? "Please confirm access to your account by entering one of your emergency recovery codes."
          : "Please confirm access to your account by entering the authentication code provided by your authenticator application."}
      </p>

      <form onSubmit={handleChallengeSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          {!useRecoveryCode ? (
            <motion.div key="otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <OtpCodeInput onChange={setCode} />
            </motion.div>
          ) : (
            <motion.div key="recovery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <label className="text-[13px] text-[#475569] block mb-1.5">Recovery Code</label>
              <div className="relative">
                <KeyIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                  placeholder="e.g. xxxxxxxx-xxxxxxxx"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] pl-10 pr-4 py-2.5 transition-all duration-150"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setUseRecoveryCode(!useRecoveryCode)}
          className="text-[#FF2D20] hover:text-[#E5261A] text-xs font-bold no-underline transition-colors cursor-pointer font-poppins block mx-auto"
        >
          {useRecoveryCode ? 'Use an authenticator app instead' : 'Use a recovery code'}
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF2D20] hover:bg-[#E5261A] text-white py-3 rounded-lg font-bold text-sm tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 relative shadow-sm"
        >
          {loading ? (
            <ArrowPathIcon className="w-5 h-5 animate-spin text-white" />
          ) : (
            <>
              Verify & Login
              <ArrowRightIcon className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  )
}
