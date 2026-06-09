import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EnvelopeIcon, PhoneIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, ArrowPathIcon, ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import FeedbackAlert from '../components/FeedbackAlert'
import OtpCodeInput from '../components/OtpCodeInput'

export default function AccountRecoveryFlow({ onSwitchView, onSuccess, pageVariants }) {
  const [step, setStep] = useState('request') // 'request', 'verify', 'set'
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleRecoveryRequestSubmit = (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    if (!recoveryEmail || !phone) {
      setErrorMsg('Please enter both your recovery email and phone number.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccessMsg(`Verification code sent to both ${recoveryEmail} and ${phone}`)
      setStep('verify')
    }, 1200)
  }

  const handleRecoveryVerifySubmit = (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    if (code.length < 6) {
      setErrorMsg('Please enter the complete 6 digit code.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('set')
    }, 1000)
  }

  const handleRecoverySetSubmit = (e) => {
    e.preventDefault()
    setErrorMsg('')
    if (!email || !password) {
      setErrorMsg('Please define both your primary workspace email and password.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onSuccess({
        title: 'Account Successfully Restored',
        subtitle: `Your primary account has been successfully linked to ${email} and is fully recovered. All analytics data is preserved.`,
        actionText: 'Enter Dashboard',
        actionView: 'login'
      })
    }, 1500)
  }

  return (
    <motion.div
      key="account-recovery-flow"
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

            <h3 className="text-2xl font-semibold text-[#0F172A] tracking-tight mb-2 text-center font-poppins">Account Recovery</h3>
            <p className="text-[#475569] text-sm mb-6 text-center font-medium">
              Verify account status. Please supply your registered recovery email and mobile phone number.
            </p>

            <form onSubmit={handleRecoveryRequestSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#475569] uppercase tracking-wider block mb-1.5 font-poppins">Recovery Email</label>
                <div className="relative">
                  <EnvelopeIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="recovery@company.com"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] pl-10 pr-4 py-3 font-semibold transition-all duration-150"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#475569] uppercase tracking-wider block mb-1.5 font-poppins">Registered Phone Number</label>
                <div className="relative">
                  <PhoneIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="15550192834"
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
                    Send Recovery Code
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
              <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to Recovery Details
            </button>

            <h3 className="text-2xl font-semibold text-[#0F172A] tracking-tight mb-2 text-center font-poppins">Verify Recovery Identity</h3>
            <p className="text-[#475569] text-sm mb-6 text-center font-medium">
              A secure 6 digit confirmation code has been dispatched. Enter the digits to verify your recovery credentials.
            </p>

            <form onSubmit={handleRecoveryVerifySubmit} className="space-y-6">
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
                    Verify Identity
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {step === 'set' && (
          <motion.div key="set" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <h3 className="text-2xl font-semibold text-[#0F172A] tracking-tight mb-2 text-center font-poppins">Restore Credentials</h3>
            <p className="text-[#475569] text-sm mb-6 text-center font-medium">
              Identity confirmed. Re assign your workspace primary Gmail address and set a secure login password.
            </p>

            <form onSubmit={handleRecoverySetSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#475569] uppercase tracking-wider block mb-1.5 font-poppins">Primary Business Email</label>
                <div className="relative">
                  <EnvelopeIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="newprimary@company.com"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] pl-10 pr-4 py-3 font-semibold transition-all duration-150"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#475569] uppercase tracking-wider block mb-1.5 font-poppins">Secure Password</label>
                <div className="relative">
                  <LockClosedIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
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
                    Restore Account Credentials
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
