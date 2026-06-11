import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

import LoginForm from './views/LoginForm'
import SignupForm from './views/SignupForm'
import PasswordResetFlow from './views/PasswordResetFlow'
import AccountRecoveryFlow from './views/AccountRecoveryFlow'
import SuccessScreen from './views/SuccessScreen'
import TwoFactorChallengeForm from './views/TwoFactorChallengeForm'

export default function AuthSystem({ onClose, initialView = 'login' }) {
  const [view, setView] = useState(initialView)
  const [successContext, setSuccessContext] = useState(null)

  const handleSuccess = (context) => {
    if (context) {
      setSuccessContext(context)
      setView('success')
    } else {
      onClose({ loggedIn: true })
    }
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
        <AnimatePresence mode="wait">
          {view === 'login' && (
            <LoginForm 
              onSwitchView={setView} 
              onSuccess={handleSuccess} 
              pageVariants={pageVariants} 
            />
          )}
          {view === 'signup' && (
            <SignupForm 
              onSwitchView={setView} 
              onSuccess={handleSuccess} 
              pageVariants={pageVariants} 
            />
          )}
          {view === 'password-reset' && (
            <PasswordResetFlow 
              onSwitchView={setView} 
              onSuccess={handleSuccess} 
              pageVariants={pageVariants} 
            />
          )}
          {view === 'account-recovery' && (
            <AccountRecoveryFlow 
              onSwitchView={setView} 
              onSuccess={handleSuccess} 
              pageVariants={pageVariants} 
            />
          )}
          {view === 'two-factor-challenge' && (
            <TwoFactorChallengeForm 
              onSwitchView={setView} 
              onSuccess={handleSuccess} 
              pageVariants={pageVariants} 
            />
          )}
          {view === 'success' && successContext && (
            <SuccessScreen 
              context={successContext} 
              onClose={onClose}
              onSwitchView={setView} 
              pageVariants={pageVariants} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
