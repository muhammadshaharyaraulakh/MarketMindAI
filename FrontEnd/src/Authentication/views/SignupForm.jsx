import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import SocialLogins from '../components/SocialLogins'
import FeedbackAlert from '../components/FeedbackAlert'
import axios from 'axios'

export default function SignupForm({ onSwitchView, onSuccess, pageVariants }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    if (!fullName || !email || !password || !passwordConfirmation) {
      setErrorMsg('Please fill in all required fields.')
      return
    }
    setLoading(true)
    
    try {
      await axios.get('/sanctum/csrf-cookie');
      const response = await axios.post('/api/register', {
        name: fullName,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      setLoading(false)
      // On success (201 Created), notify the user to check their email
      onSuccess({
        title: 'Registration Successful!',
        subtitle: `Welcome, ${fullName}. Please check your email inbox for a verification link to activate your workspace.`,
        actionText: 'Return to Homepage',
        actionView: 'close' 
      })
    } catch (error) {
      setLoading(false)
      if (error.response && error.response.status === 422) {
        // Validation failed
        const errors = error.response.data.errors;
        const firstErrorMsg = errors ? Object.values(errors)[0][0] : error.response.data.message;
        setErrorMsg(firstErrorMsg || 'Invalid registration details.');
      } else {
        setErrorMsg('An error occurred during registration. Please try again.');
      }
    }
  }

  return (
    <motion.div
      key="signup"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <FeedbackAlert errorMsg={errorMsg} />

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

        <div>
          <label className="text-xs font-bold text-[#475569] uppercase tracking-wider block mb-1 font-poppins">Confirm Password</label>
          <div className="relative">
            <LockClosedIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] pl-10 pr-10 py-2.5 font-semibold transition-all duration-150"
            />
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

      <SocialLogins mode="signup" onSuccess={onSuccess} />

      <p className="text-[#475569] text-xs font-semibold text-center mt-5">
        Already registered?{' '}
        <button
          type="button"
          onClick={() => onSwitchView('login')}
          className="text-[#FF2D20] hover:text-[#E5261A] font-bold no-underline transition-colors cursor-pointer font-poppins"
        >
          Sign In Here
        </button>
      </p>
    </motion.div>
  )
}
