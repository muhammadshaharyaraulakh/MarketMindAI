import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { SectionLabel } from './SectionLabel';
import { profileService } from '../services/profileService';

export default function RecoveryPaths({ user, tabVariants, setErrorMsg, setSuccessMsg }) {
  const [recoveryEmail, setRecoveryEmail] = useState(user?.recovery_email || '');
  const [hasRecoveryEmail, setHasRecoveryEmail] = useState(!!user?.recovery_email);
  const [loading, setLoading] = useState(false);

  const handleAddRecoveryEmail = async (e) => {
    e.preventDefault();
    if (!recoveryEmail) {
      setErrorMsg('Recovery email cannot be empty.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await profileService.addRecoveryEmail(recoveryEmail);
      setLoading(false);
      setHasRecoveryEmail(true);
      setSuccessMsg('Recovery email added successfully.');
    } catch(err) {
      setLoading(false);
      const firstError = err.response?.data?.errors ? Object.values(err.response.data.errors)[0][0] : err.response?.data?.message;
      setErrorMsg(firstError || 'Error adding recovery email');
    }
  };

  const handleUpdateRecoveryEmail = async (e) => {
    e.preventDefault();
    if (!recoveryEmail) {
      setErrorMsg('Recovery email cannot be empty.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await profileService.updateRecoveryEmail(recoveryEmail);
      setLoading(false);
      setSuccessMsg('Recovery email updated successfully.');
    } catch(err) {
      setLoading(false);
      const firstError = err.response?.data?.errors ? Object.values(err.response.data.errors)[0][0] : err.response?.data?.message;
      setErrorMsg(firstError || 'Error updating recovery email');
    }
  };

  const handleRemoveRecoveryEmail = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await profileService.removeRecoveryEmail();
      setLoading(false);
      setRecoveryEmail('');
      setHasRecoveryEmail(false);
      setSuccessMsg('Recovery email removed successfully.');
    } catch(err) {
      setLoading(false);
      const firstError = err.response?.data?.errors ? Object.values(err.response.data.errors)[0][0] : err.response?.data?.message;
      setErrorMsg(firstError || 'Error removing recovery email');
    }
  };

  return (
    <motion.div
      key="recovery"
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-8"
    >
      <div>
        <SectionLabel text="RECOVERY COORDINATES" color="blue" />
        <h3 className="text-xl font-semibold text-[#0F172A] tracking-tight">Recovery Backup Paths</h3>
        <p className="text-xs text-[#64748B] font-semibold mt-1">Supply recovery coordinates. Security tokens will be dispatched to these endpoints during access failure.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="text-xs font-medium text-[#475569] uppercase tracking-wider block mb-1.5">Backup Recovery Email</label>
          <div className="relative">
            <EnvelopeIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="email" 
              required
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              placeholder="recovery@company.com"
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] pl-10 pr-4 py-3 font-normal transition-all"
            />
          </div>
        </div>

        {hasRecoveryEmail ? (
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleUpdateRecoveryEmail}
              disabled={loading}
              className="w-full bg-[#FF2D20] hover:bg-[#E5261A] text-white py-3.5 rounded-xl font-bold text-sm tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? <ArrowPathIcon className="w-5 h-5 animate-spin text-white" /> : 'Update Email'}
            </button>
            <button
              type="button"
              onClick={handleRemoveRecoveryEmail}
              disabled={loading}
              className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 py-3.5 rounded-xl font-bold text-sm tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? <ArrowPathIcon className="w-5 h-5 animate-spin text-red-500" /> : 'Delete Email'}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleAddRecoveryEmail}
            disabled={loading}
            className="w-full bg-[#FF2D20] hover:bg-[#E5261A] text-white py-3.5 rounded-xl font-bold text-sm tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? <ArrowPathIcon className="w-5 h-5 animate-spin text-white" /> : 'Add Recovery Email'}
          </button>
        )}
      </div>
    </motion.div>
  );
}
