import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
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

export default function LoginForm({ onSwitchView, onSuccess, pageVariants }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    if (!email || !password) {
      setErrorMsg('Please enter both your email and password.')
      return
    }
    setLoading(true)
    
    try {
      await axios.get('/sanctum/csrf-cookie');
      const response = await axios.post('/api/login', {
        email,
        password
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      setLoading(false)
      if (response.data.two_factor) {
        onSwitchView('two-factor-challenge')
      } else {
        onSuccess() 
      }
    } catch (error) {
      setLoading(false)
      if (error.response && error.response.status === 422) {
        const errors = error.response.data.errors;
        const firstErrorMsg = errors ? Object.values(errors)[0][0] : error.response.data.message;
        setErrorMsg(firstErrorMsg || 'Invalid credentials');
      } else {
        setErrorMsg('An error occurred during login. Please try again.');
      }
    }
  }

  return (
    <motion.div
      key="login"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <FeedbackAlert errorMsg={errorMsg} />

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
              onClick={() => onSwitchView('forgot-password')}
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

      <SocialLogins mode="login" onSuccess={onSuccess} />

      <p className="text-[#475569] text-xs font-semibold text-center mt-8">
        Don't have a business account?{' '}
        <button
          type="button"
          onClick={() => onSwitchView('signup')}
          className="text-[#FF2D20] hover:text-[#E5261A] font-bold no-underline transition-colors cursor-pointer font-poppins"
        >
          Get Started Free
        </button>
      </p>
    </motion.div>
  )
}
