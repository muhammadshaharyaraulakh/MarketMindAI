import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon, ExclamationTriangleIcon, CheckCircleIcon
} from '@heroicons/react/24/outline';
import ProfileDetails from './components/ProfileDetails';
import PasswordCredentials from './components/PasswordCredentials';
import TwoFactorShield from './components/TwoFactorShield';
import ActiveSessions from './components/ActiveSessions';

export default function ProfilePage({ onClose, user }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setErrorMsg('');
    setSuccessMsg('');
  }, [activeTab]);

  const tabVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.25, ease: 'easeIn' } }
  };

  const tabList = [
    { id: 'profile', label: 'Profile' },
    { id: 'password', label: 'Password' },
    { id: '2fa', label: '2FA Shield' },
    { id: 'activity', label: 'Active Sessions' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col font-mona select-none overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <style>{`
        @keyframes scanLaser {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .animate-scan-laser {
          animation: scanLaser 2.4s infinite linear;
        }
      `}</style>

      <header className="max-w-7xl w-full mx-auto px-6 sm:px-12 py-8 flex items-center justify-between shrink-0">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white px-4 py-2.5 rounded-full text-[#475569] hover:text-[#0F172A] cursor-pointer shadow-sm transition-all duration-150 text-sm font-bold tracking-tight"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Return to Dashboard
        </button>

        <span className="font-mona">
          <span className="font-bold text-[#0F172A] text-2xl tracking-tight">MarketMind</span>
          <span className="text-[#FF2D20] font-extrabold text-2xl ml-0.5">AI</span>
        </span>
      </header>

      <div className="flex-1 w-full max-w-4xl mx-auto px-6 pb-24 text-center">
        <div className="flex justify-center mt-6">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[1.5px] uppercase border bg-[#FFF1F0] text-[#FF2D20] border-[#FECACA] mb-6">
            USER SYSTEM COMMAND
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-semibold text-[#0F172A] tracking-tight leading-tight mb-4 font-mona">
          Your Digital <span className="text-[#FF2D20]">Workspace Identity</span>
        </h1>
        <p className="text-[#475569] text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-12 font-medium">
          Manage system coordinates, rotate password credentials, and activate Google Authenticator protection.
        </p>

        <div className="flex flex-wrap justify-center gap-2.5 mb-12 max-w-3xl mx-auto">
          {tabList.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#FF2D20] text-white border-[#FF2D20] shadow-[0_4px_12px_rgba(255,45,32,0.15)]'
                  : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0F172A] shadow-sm'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="max-w-2xl mx-auto mb-8 text-left">
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl p-4 flex items-start gap-2.5"
              >
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </motion.div>
            )}
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-xl p-4 flex items-start gap-2.5"
              >
                <CheckCircleIcon className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <p>{successMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-8 sm:p-12 max-w-2xl mx-auto overflow-hidden relative text-left">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && <ProfileDetails user={user} tabVariants={tabVariants} setErrorMsg={setErrorMsg} setSuccessMsg={setSuccessMsg} />}
            {activeTab === 'password' && <PasswordCredentials tabVariants={tabVariants} setErrorMsg={setErrorMsg} setSuccessMsg={setSuccessMsg} />}
            {activeTab === '2fa' && <TwoFactorShield user={user} tabVariants={tabVariants} setErrorMsg={setErrorMsg} setSuccessMsg={setSuccessMsg} />}
            {activeTab === 'activity' && <ActiveSessions activeTab={activeTab} tabVariants={tabVariants} setErrorMsg={setErrorMsg} setSuccessMsg={setSuccessMsg} onClose={onClose} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
