import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid'

export default function AuthSystem({ onClose, initialView = 'login' }) {
  const [view, setView] = useState(initialView) // 'login', 'signup', 'reset-request', 'reset-verify', 'reset-new-password', 'recovery-request', 'recovery-verify', 'recovery-set', 'success'

  // General notification/feedback alerts
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)

  // Password Visibility state
  const [showPassword, setShowPassword] = useState(false)

  // Input states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [recoveryEmail, setRecoveryEmail] = useState('')

  // 6-digit code entry state
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)]

  // Success screen customized context
  const [successContext, setSuccessContext] = useState({
    title: 'Account Created',
    subtitle: 'Welcome to MarketMind AI. Your enterprise digital marketing campaign center is ready.',
    actionText: 'Go to Dashboard',
    actionView: 'login'
  })

  // Clear feedback alerts and password visibility toggle when switching views
  useEffect(() => {
    setErrorMsg('')
    setSuccessMsg('')
    setShowPassword(false)
    setCode(['', '', '', '', '', ''])
  }, [view])

  // Handle focus jumping for 6-digit verification code boxes
  const handleCodeChange = (element, index) => {
    const val = element.value.replace(/[^0-9]/g, '')
    if (!val) {
      const newCode = [...code]
      newCode[index] = ''
      setCode(newCode)
      return
    }

    const newCode = [...code]
    newCode[index] = val.slice(-1) // Take only the last entered digit
    setCode(newCode)

    // Focus next box if filled
    if (index < 5 && inputRefs[index + 1].current) {
      inputRefs[index + 1].current.focus()
    }
  }

  // Handle backspace back-hopping
  const handleCodeKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0 && inputRefs[index - 1].current) {
        inputRefs[index - 1].current.focus()
      }
    }
  }

  // Handle form submissions
  const handleLoginSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) {
      setErrorMsg('Please enter both your email and password.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onClose({ loggedIn: true }) // Mock transition back to core dashboard
    }, 1200)
  }

  const handleSignupSubmit = (e) => {
    e.preventDefault()
    if (!fullName || !email || !password) {
      setErrorMsg('Please fill in all required fields.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccessContext({
        title: 'Registration Successful!',
        subtitle: `Welcome, ${fullName}. Your MarketMind AI engine account is fully set up. Get ready to turn marketing data into revenue.`,
        actionText: 'Access Workspace',
        actionView: 'dashboard'
      })
      setView('success')
    }, 1500)
  }

  const handleResetRequestSubmit = (e) => {
    e.preventDefault()
    if (!email) {
      setErrorMsg('Please enter your registered email address.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccessMsg(`We sent a 6 digit code to ${email}`)
      setView('reset-verify')
    }, 1200)
  }

  const handleResetVerifySubmit = (e) => {
    e.preventDefault()
    const enteredCode = code.join('')
    if (enteredCode.length < 6) {
      setErrorMsg('Please enter all 6 digits of your verification code.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setView('reset-new-password')
    }, 1000)
  }

  const handleNewPasswordSubmit = (e) => {
    e.preventDefault()
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
      setSuccessContext({
        title: 'Password Successfully Reset',
        subtitle: 'Your credentials have been updated securely. You can now log into your console with your new password.',
        actionText: 'Sign In Now',
        actionView: 'login'
      })
      setView('success')
    }, 1200)
  }

  const handleRecoveryRequestSubmit = (e) => {
    e.preventDefault()
    if (!recoveryEmail || !phone) {
      setErrorMsg('Please enter both your recovery email and phone number.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccessMsg(`Verification code sent to both ${recoveryEmail} and ${phone}`)
      setView('recovery-verify')
    }, 1200)
  }

  const handleRecoveryVerifySubmit = (e) => {
    e.preventDefault()
    const enteredCode = code.join('')
    if (enteredCode.length < 6) {
      setErrorMsg('Please enter the complete 6 digit code.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setView('recovery-set')
    }, 1000)
  }

  const handleRecoverySetSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) {
      setErrorMsg('Please define both your primary workspace email and password.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccessContext({
        title: 'Account Successfully Restored',
        subtitle: `Your primary account has been successfully linked to ${email} and is fully recovered. All analytics data is preserved.`,
        actionText: 'Enter Dashboard',
        actionView: 'login'
      })
      setView('success')
    }, 1500)
  }

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.25, ease: 'easeIn' } }
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between overflow-y-auto font-poppins select-none p-6 sm:p-12">

      {/* Top: Brand Logo Centered */}
      <div className="flex justify-center pt-4 pb-2 shrink-0">
        <span className="font-mona">
          <span className="font-bold text-[#0F172A] text-3xl tracking-tight">MarketMind</span>
          <span className="text-[#FF2D20] font-extrabold text-3xl ml-0.5">AI</span>
        </span>
      </div>

      {/* Close button to go back to Landing Page */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white p-2.5 rounded-full text-[#475569] hover:text-[#0F172A] cursor-pointer shadow-sm transition-all duration-150 flex items-center justify-center animate-bounce"
        style={{ animationDuration: '3s' }}
        title="Return to Home"
      >
        <ArrowLeftIcon className="w-5 h-5" />
      </button>

      {/* Middle: Centered Auth Card wrapper in the perfect middle of the screen */}
      <div className="w-full max-w-md mx-auto my-auto py-8 shrink-0">

        {/* Feedback notifications */}
        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl p-4 mb-6 flex items-start gap-2.5"
            >
              <ExclamationCircleIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p>{errorMsg}</p>
            </motion.div>
          )}
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-xl p-4 mb-6 flex items-start gap-2.5"
            >
              <ShieldCheckIcon className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <p>{successMsg}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">

          {/* VIEW 1: LOGIN PAGE */}
          {view === 'login' && (
            <motion.div
              key="login"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <h3 className="text-2xl font-semibold text-[#0F172A] tracking-tight mb-2 text-center font-poppins">Welcome Back</h3>
              <p className="text-[#475569] text-sm mb-8 text-center font-medium">
                Enter your digital workspace credentials to manage your models.
              </p>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#475569] uppercase tracking-wider block mb-1.5 font-poppins">Business Email</label>
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

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-[#475569] uppercase tracking-wider block font-poppins">Security Password</label>
                    <button
                      type="button"
                      onClick={() => setView('reset-request')}
                      className="text-[#FF2D20] hover:text-[#E5261A] text-xs font-bold no-underline transition-colors cursor-pointer font-poppins"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <LockClosedIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
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

                <div className="flex items-center justify-between py-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" className="accent-[#FF2D20] w-4 h-4 rounded border-[#E2E8F0]" />
                    <span className="text-[#64748B] text-xs font-semibold">Keep me signed in</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setView('recovery-request')}
                    className="text-[#FF2D20] hover:text-[#E5261A] text-xs font-bold no-underline transition-colors cursor-pointer font-poppins"
                  >
                    Account Recovery
                  </button>
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
                      Access Intelligence Console
                      <ArrowRightIcon className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Social Logins Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E2E8F0]"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-[#94A3B8] font-bold tracking-wider font-poppins">Or login instantly with</span></div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); onClose({ loggedIn: true }) }, 1000) }}
                  className="flex justify-center items-center py-2.5 border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg bg-white shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
                  title="Login with Google"
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    <path fill="none" d="M0 0h48v48H0z"/>
                  </svg>
                </button>

                <button
                  onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); onClose({ loggedIn: true }) }, 1000) }}
                  className="flex justify-center items-center py-2.5 border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg bg-white shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
                  title="Login with GitHub"
                >
                  <svg className="w-5 h-5 text-[#0F172A]" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </button>

                <button
                  onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); onClose({ loggedIn: true }) }, 1000) }}
                  className="flex justify-center items-center py-2.5 border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg bg-white shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
                  title="Login with Apple"
                >
                  <svg className="w-5 h-5 text-[#0F172A]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.18.67-2.9 1.49-.66.75-1.24 1.88-1.08 2.99 1.12.09 2.23-.58 2.99-1.42z" />
                  </svg>
                </button>
              </div>

              <p className="text-[#475569] text-xs font-semibold text-center mt-8">
                Don't have a business account?{' '}
                <button
                  type="button"
                  onClick={() => setView('signup')}
                  className="text-[#FF2D20] hover:text-[#E5261A] font-bold no-underline transition-colors cursor-pointer font-poppins"
                >
                  Get Started Free
                </button>
              </p>
            </motion.div>
          )}

          {/* VIEW 2: SIGNUP PAGE */}
          {view === 'signup' && (
            <motion.div
              key="signup"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <h3 className="text-2xl font-semibold text-[#0F172A] tracking-tight mb-2 text-center font-poppins">Create Business Account</h3>
              <p className="text-[#475569] text-sm mb-6 text-center font-medium">
                14 day free trial. Setup only takes 30 seconds.
              </p>

              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-[#475569] uppercase tracking-wider block mb-1 font-poppins">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Rashid Mahmood"
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] pl-10 pr-4 py-2.5 font-semibold transition-all duration-150"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#475569] uppercase tracking-wider block mb-1 font-poppins">Business Email</label>
                  <div className="relative">
                    <EnvelopeIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rashid@company.com"
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] pl-10 pr-4 py-2.5 font-semibold transition-all duration-150"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#475569] uppercase tracking-wider block mb-1 font-poppins">Secure Password</label>
                  <div className="relative">
                    <LockClosedIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] pl-10 pr-10 py-2.5 font-semibold transition-all duration-150"
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

                <p className="text-[#64748B] text-[11px] font-semibold text-center">
                  By registering, you accept our standard terms, privacy protocol, and data routing agreements.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FF2D20] hover:bg-[#E5261A] text-white py-2.5 rounded-lg font-bold text-sm tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 relative shadow-sm"
                >
                  {loading ? (
                    <ArrowPathIcon className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <>
                      Create My Workspace
                      <ArrowRightIcon className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E2E8F0]"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-[#94A3B8] font-bold tracking-wider font-poppins">Or register with</span></div>
              </div>

              {/* Social Buttons Block */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); setSuccessContext({ title: 'Workspace Initialized', subtitle: 'You successfully logged in using Google account verification. Welcome back.', actionText: 'Proceed to Panel', actionView: 'dashboard' }); setView('success') }, 1000) }}
                  className="flex justify-center items-center py-2 border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg bg-white shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    <path fill="none" d="M0 0h48v48H0z"/>
                  </svg>
                </button>

                <button
                  onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); setSuccessContext({ title: 'Workspace Initialized', subtitle: 'You successfully logged in using GitHub integration.', actionText: 'Enter Space', actionView: 'dashboard' }); setView('success') }, 1000) }}
                  className="flex justify-center items-center py-2 border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg bg-white shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-[#0F172A]" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </button>

                <button
                  onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); setSuccessContext({ title: 'Workspace Initialized', subtitle: 'You successfully registered via secure Apple ID authentication.', actionText: 'Launch Panel', actionView: 'dashboard' }); setView('success') }, 1000) }}
                  className="flex justify-center items-center py-2 border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg bg-white shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-[#0F172A]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.18.67-2.9 1.49-.66.75-1.24 1.88-1.08 2.99 1.12.09 2.23-.58 2.99-1.42z" />
                  </svg>
                </button>
              </div>

              <p className="text-[#475569] text-xs font-semibold text-center mt-5">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="text-[#FF2D20] hover:text-[#E5261A] font-bold no-underline transition-colors cursor-pointer font-poppins"
                >
                  Sign In Here
                </button>
              </p>
            </motion.div>
          )}

          {/* VIEW 3: RESET PASSWORD REQUEST (FORGOT PASSWORD) */}
          {view === 'reset-request' && (
            <motion.div
              key="reset-request"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <button
                onClick={() => setView('login')}
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

          {/* VIEW 4: RESET PASSWORD VERIFY (6-DIGIT CODE) */}
          {view === 'reset-verify' && (
            <motion.div
              key="reset-verify"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <button
                onClick={() => setView('reset-request')}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#94A3B8] hover:text-[#FF2D20] mb-4 transition-colors cursor-pointer font-poppins no-underline"
              >
                <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to Email
              </button>

              <h3 className="text-2xl font-semibold text-[#0F172A] tracking-tight mb-2 text-center font-poppins">Verify Security Code</h3>
              <p className="text-[#475569] text-sm mb-6 text-center font-medium">
                We have dispatched a 6 digit confirmation code. Please input it below to unlock your credentials.
              </p>

              <form onSubmit={handleResetVerifySubmit} className="space-y-6">
                {/* 6 Individual Code Inputs */}
                <div className="flex justify-between gap-2.5 py-2">
                  {code.map((num, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      required
                      value={num}
                      ref={inputRefs[idx]}
                      onChange={(e) => handleCodeChange(e.target, idx)}
                      onKeyDown={(e) => handleCodeKeyDown(e, idx)}
                      className="w-12 h-14 bg-[#F8FAFC] border-2 border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-xl text-center text-xl font-extrabold text-[#0F172A] transition-all"
                    />
                  ))}
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
                      Verify Code
                      <ArrowRightIcon className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[#475569] text-xs font-semibold text-center mt-4">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); setSuccessMsg('New security code successfully re-sent.') }, 800) }}
                    className="text-[#FF2D20] hover:text-[#E5261A] font-bold no-underline transition-colors cursor-pointer font-poppins"
                  >
                    Resend Code
                  </button>
                </p>
              </form>
            </motion.div>
          )}

          {/* VIEW 5: RESET PASSWORD SET NEW CREDENTIALS */}
          {view === 'reset-new-password' && (
            <motion.div
              key="reset-new-password"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
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

          {/* VIEW 6: ACCOUNT RECOVERY REQUEST (EMAIL & PHONE) */}
          {view === 'recovery-request' && (
            <motion.div
              key="recovery-request"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <button
                onClick={() => setView('login')}
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

          {/* VIEW 7: ACCOUNT RECOVERY VERIFY (6-DIGIT CODE) */}
          {view === 'recovery-verify' && (
            <motion.div
              key="recovery-verify"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <button
                onClick={() => setView('recovery-request')}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#94A3B8] hover:text-[#FF2D20] mb-4 transition-colors cursor-pointer font-poppins no-underline"
              >
                <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to Recovery Details
              </button>

              <h3 className="text-2xl font-semibold text-[#0F172A] tracking-tight mb-2 text-center font-poppins">Verify Recovery Identity</h3>
              <p className="text-[#475569] text-sm mb-6 text-center font-medium">
                A secure 6 digit confirmation code has been dispatched. Enter the digits to verify your recovery credentials.
              </p>

              <form onSubmit={handleRecoveryVerifySubmit} className="space-y-6">
                {/* 6 Individual Code Inputs (Reused UI design) */}
                <div className="flex justify-between gap-2.5 py-2">
                  {code.map((num, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      required
                      value={num}
                      ref={inputRefs[idx]}
                      onChange={(e) => handleCodeChange(e.target, idx)}
                      onKeyDown={(e) => handleCodeKeyDown(e, idx)}
                      className="w-12 h-14 bg-[#F8FAFC] border-2 border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-xl text-center text-xl font-extrabold text-[#0F172A] transition-all"
                    />
                  ))}
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
                      Verify Identity
                      <ArrowRightIcon className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* VIEW 8: ACCOUNT RECOVERY RESTORE CREDENTIALS */}
          {view === 'recovery-set' && (
            <motion.div
              key="recovery-set"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
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

          {/* SUCCESS VIEW SCREEN */}
          {view === 'success' && (
            <motion.div
              key="success"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-center py-6"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-200"
              >
                <CheckCircleIconSolid className="w-10 h-10 text-green-500" />
              </motion.div>

              <h3 className="text-2xl font-bold text-[#0F172A] tracking-tight mb-3 font-mona">{successContext.title}</h3>
              <p className="text-[#475569] text-sm leading-relaxed mb-8 max-w-sm mx-auto font-medium">
                {successContext.subtitle}
              </p>

              <button
                onClick={() => {
                  if (successContext.actionView === 'dashboard') {
                    onClose({ loggedIn: true })
                  } else {
                    setView(successContext.actionView)
                  }
                }}
                className="w-full bg-[#FF2D20] hover:bg-[#E5261A] text-white py-3 rounded-lg font-bold text-sm tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                {successContext.actionText}
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </motion.div>
          )}

        </AnimatePresence>

      </div>


    </div>
  )
}
