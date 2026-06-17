import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, ArrowPathIcon, ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import FeedbackAlert from '../components/FeedbackAlert'
import axios from 'axios'

export default function PasswordResetFlow({ onSwitchView, onSuccess, pageVariants }) {
  const [step, setStep] = useState('request') // 'request', 'set'
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    const urlEmail = params.get('email');
    if (urlToken && urlEmail) {
      setToken(urlToken);
      setEmail(urlEmail);
      setStep('set');
    }
  }, []);

  const handleResetRequestSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    if (!email) {
      setErrorMsg('Please enter your registered email address.')
      return
    }
    setLoading(true)
    try {
      await axios.get('/sanctum/csrf-cookie');
      await axios.post('/api/forgot-password', { email }, {
        headers: { 'Accept': 'application/json' }
      });
      setSuccessMsg(`We sent a password reset link to ${email}`)
      setEmail('')
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrorMsg(Object.values(error.response.data.errors).flat()[0]);
      } else if (error.response && error.response.data && error.response.data.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false)
    }
  }

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    if (!password || !confirmPassword) {
      setErrorMsg('Please fill in both password fields.')
      return
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify and try again.')
      return
    }
    setLoading(true)
    try {
      await axios.get('/sanctum/csrf-cookie');
      await axios.post('/api/reset-password', {
        token,
        email,
        password,
        password_confirmation: confirmPassword
      }, {
        headers: { 'Accept': 'application/json' }
      });
      
      // Clean up URL parameters after success without reloading
      window.history.replaceState({}, document.title, '/');
      
      onSuccess({
        title: 'Password Successfully Reset',
        subtitle: 'Your credentials have been updated securely. You can now log into your console with your new password.',
        actionText: 'Sign In Now',
        actionView: 'login'
      })
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrorMsg(Object.values(error.response.data.errors).flat()[0]);
      } else if (error.response && error.response.data && error.response.data.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      key="password-reset-flow"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <FeedbackAlert errorMsg={errorMsg} successMsg={successMsg} />

      <AnimatePresence mode="wait">
        {step === 'request' && (
          <motion.div key="request" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <button
              onClick={() => onSwitchView('login')}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#94A3B8] hover:text-[#FF2D20] mb-4 transition-colors cursor-pointer font-poppins no-underline"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to Login
            </button>

            <h3 className="text-2xl font-semibold text-[#0F172A] tracking-tight mb-2 text-center font-poppins">Reset Password</h3>
            <p className="text-[#475569] text-sm mb-6 text-center font-medium">
              Enter your registered email address and we will send you a secure link to reset your password.
            </p>

            <form onSubmit={handleResetRequestSubmit} className="space-y-4">
              <div>
                <label className="text-[13px] text-[#475569] block mb-1.5">Primary Email</label>
                <div className="relative">
                  <EnvelopeIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@company.com"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] pl-10 pr-4 py-2.5 transition-all duration-150"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF2D20] hover:bg-[#E5261A] text-white py-3 rounded-lg font-bold text-sm tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 relative shadow-sm"
              >
                {loading ? (
                  <ArrowPathIcon className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {step === 'set' && (
          <motion.div key="set" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <h3 className="text-2xl font-semibold text-[#0F172A] tracking-tight mb-2 text-center font-poppins">Create New Password</h3>
            <p className="text-[#475569] text-sm mb-6 text-center font-medium">
              Please define a new strong password for your digital campaign engine workspace ({email}).
            </p>

            <form onSubmit={handleNewPasswordSubmit} className="space-y-4">
              <div>
                <label className="text-[13px] text-[#475569] block mb-1.5">New Password</label>
                <div className="relative">
                  <LockClosedIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New secure password"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] pl-10 pr-10 py-2.5 transition-all duration-150"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[13px] text-[#475569] block mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <LockClosedIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re enter password to confirm"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] pl-10 pr-10 py-2.5 transition-all duration-150"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF2D20] hover:bg-[#E5261A] text-white py-3 rounded-lg font-bold text-sm tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 relative shadow-sm"
              >
                {loading ? (
                  <ArrowPathIcon className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <>
                    Apply New Password
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

