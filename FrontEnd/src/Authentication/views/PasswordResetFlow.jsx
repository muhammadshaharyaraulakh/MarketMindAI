import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, ArrowPathIcon, ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import FeedbackAlert from '../components/FeedbackAlert'
import OtpCodeInput from '../components/OtpCodeInput'

export default function PasswordResetFlow({ onSwitchView, onSuccess, pageVariants }) {
  const [step, setStep] = useState('request') // 'request', 'verify', 'set'
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleResetRequestSubmit = (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    if (!email) {
      setErrorMsg('Please enter your registered email address.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccessMsg(`We sent a 6 digit code to ${email}`)
      setStep('verify')
    }, 1200)
  }

  const handleResetVerifySubmit = (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    if (code.length < 6) {
      setErrorMsg('Please enter all 6 digits of your verification code.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('set')
    }, 1000)
  }

  const handleNewPasswordSubmit = (e) => {
    e.preventDefault()
    setErrorMsg('')
    if (!password || !confirmPassword) {
      setErrorMsg('Please fill in both password fields.')
      return
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify and try again.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onSuccess({
        title: 'Password Successfully Reset',
        subtitle: 'Your credentials have been updated securely. You can now log into your console with your new password.',
        actionText: 'Sign In Now',
        actionView: 'login'
      })
    }, 1200)
  }

  const resendCode = () => {
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')
    setTimeout(() => {
      setLoading(false)
      setSuccessMsg('New security code successfully re-sent.')
    }, 800)
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
              Enter your registered email address and we will send you a 6 digit confirmation code.
            </p>

            <form onSubmit={handleResetRequestSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#475569] uppercase tracking-wider block mb-1.5 font-poppins">Primary Email</label>
                <div className="relative">
                  <EnvelopeIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@company.com"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] pl-10 pr-4 py-3 font-semibold transition-all duration-150"
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
                    Send Reset Code
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {step === 'verify' && (
          <motion.div key="verify" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <button
              onClick={() => { setStep('request'); setSuccessMsg(''); setErrorMsg('') }}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#94A3B8] hover:text-[#FF2D20] mb-4 transition-colors cursor-pointer font-poppins no-underline"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to Email
            </button>

            <h3 className="text-2xl font-semibold text-[#0F172A] tracking-tight mb-2 text-center font-poppins">Verify Security Code</h3>
            <p className="text-[#475569] text-sm mb-6 text-center font-medium">
              We have dispatched a 6 digit confirmation code. Please input it below to unlock your credentials.
            </p>

            <form onSubmit={handleResetVerifySubmit} className="space-y-6">
              <OtpCodeInput onChange={setCode} />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF2D20] hover:bg-[#E5261A] text-white py-3 rounded-lg font-bold text-sm tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 relative shadow-sm"
              >
                {loading ? (
                  <ArrowPathIcon className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <>
                    Verify Code
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[#475569] text-xs font-semibold text-center mt-4">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={resendCode}
                  className="text-[#FF2D20] hover:text-[#E5261A] font-bold no-underline transition-colors cursor-pointer font-poppins"
                >
                  Resend Code
                </button>
              </p>
            </form>
          </motion.div>
        )}

        {step === 'set' && (
          <motion.div key="set" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <h3 className="text-2xl font-semibold text-[#0F172A] tracking-tight mb-2 text-center font-poppins">Create New Password</h3>
            <p className="text-[#475569] text-sm mb-6 text-center font-medium">
              Please define a new strong password for your digital campaign engine workspace.
            </p>

            <form onSubmit={handleNewPasswordSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#475569] uppercase tracking-wider block mb-1.5 font-poppins">New Password</label>
                <div className="relative">
                  <LockClosedIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New secure password"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] pl-10 pr-10 py-3 font-semibold transition-all duration-150"
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
                <label className="text-xs font-bold text-[#475569] uppercase tracking-wider block mb-1.5 font-poppins">Confirm New Password</label>
                <div className="relative">
                  <LockClosedIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re enter password to confirm"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] pl-10 pr-10 py-3 font-semibold transition-all duration-150"
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
