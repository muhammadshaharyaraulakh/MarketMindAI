import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LockClosedIcon, EyeIcon, EyeSlashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { SectionLabel } from './SectionLabel';
import { profileService } from '../services/profileService';

export default function PasswordCredentials({ tabVariants, setErrorMsg, setSuccessMsg }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMsg('Please specify all security password inputs.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await profileService.updatePassword(oldPassword, newPassword, confirmPassword);
      setLoading(false);
      setSuccessMsg('Your security password has been changed successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setLoading(false);
      const firstError = err.response?.data?.errors ? Object.values(err.response.data.errors)[0][0] : err.response?.data?.message;
      setErrorMsg(firstError || 'Error updating password.');
    }
  };

  return (
    <motion.div
      key="password"
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-8"
    >
      <div>
        <SectionLabel text="PASSWORD ROTATION" color="purple" />
        <h3 className="text-xl font-semibold text-[#0F172A] tracking-tight">Rotate Security Credentials</h3>
        <p className="text-xs text-[#64748B] font-semibold mt-1">Make sure to establish a complex configuration containing alphanumeric parameters.</p>
      </div>

      <form onSubmit={handleSavePassword} className="space-y-5">
        <div className="space-y-4">
          <div>
            <label className="text-[13px] text-[#475569] block mb-1.5">Current Password</label>
            <div className="relative">
              <LockClosedIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type={showPass.old ? 'text' : 'password'}
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] pl-10 pr-10 py-2.5 transition-all duration-150"
              />
              <button
                type="button"
                onClick={() => setShowPass({ ...showPass, old: !showPass.old })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
              >
                {showPass.old ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-[13px] text-[#475569] block mb-1.5">New Password</label>
            <div className="relative">
              <LockClosedIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type={showPass.new ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 symbols"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] pl-10 pr-10 py-2.5 transition-all duration-150"
              />
              <button
                type="button"
                onClick={() => setShowPass({ ...showPass, new: !showPass.new })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
              >
                {showPass.new ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-[13px] text-[#475569] block mb-1.5">Confirm New Password</label>
            <div className="relative">
              <LockClosedIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type={showPass.confirm ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re enter password"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] pl-10 pr-10 py-2.5 transition-all duration-150"
              />
              <button
                type="button"
                onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
              >
                {showPass.confirm ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF2D20] hover:bg-[#E5261A] text-white py-3.5 rounded-xl font-bold text-sm tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
        >
          {loading ? <ArrowPathIcon className="w-5 h-5 animate-spin text-white" /> : 'Confirm New Password Rotation'}
        </button>
      </form>
    </motion.div>
  );
}
