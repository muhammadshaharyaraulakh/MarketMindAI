import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, EnvelopeIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { SectionLabel } from './SectionLabel';
import { profileService } from '../services/profileService';

export default function ProfileDetails({ user, tabVariants, setErrorMsg, setSuccessMsg }) {
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [timezone, setTimezone] = useState(user?.timezone || '');
  const [language, setLanguage] = useState(user?.language || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await profileService.updateProfile({ name: fullName, email, timezone, language, bio });
      setLoading(false);
      setSuccessMsg('Profile updated successfully.');
    } catch (err) {
      setLoading(false);
      const firstError = err.response?.data?.errors ? Object.values(err.response.data.errors)[0][0] : err.response?.data?.message;
      setErrorMsg(firstError || 'Error saving profile.');
    }
  };

  return (
    <motion.div
      key="profile"
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-8 animate-fadeIn"
    >
      <div>
        <SectionLabel text="MEMBER COORDINATES" color="red" />
        <h3 className="text-xl font-semibold text-[#0F172A] tracking-tight">Basic Workspace Profile</h3>
        <p className="text-xs text-[#64748B] font-semibold mt-1">Configure your display name, corporate email address, and roles.</p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-[#475569] uppercase tracking-wider block mb-1.5">Your Full Name</label>
            <div className="relative">
              <UserIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Rashid Mahmood"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] pl-10 pr-4 py-3 font-normal transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#475569] uppercase tracking-wider block mb-1.5">Business Email</label>
            <div className="relative">
              <EnvelopeIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rashid@company.com"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] pl-10 pr-4 py-3 font-normal transition-all"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-[#475569] uppercase tracking-wider block mb-1.5">Timezone</label>
            <input 
              type="text" 
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              placeholder="America/New_York"
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] px-4 py-3 font-normal transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#475569] uppercase tracking-wider block mb-1.5">Language</label>
            <input 
              type="text" 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="en-US"
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] px-4 py-3 font-normal transition-all"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-[#475569] uppercase tracking-wider block mb-1.5">Bio</label>
          <textarea 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself"
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] px-4 py-3 font-normal transition-all min-h-[100px] resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF2D20] hover:bg-[#E5261A] text-white py-3.5 rounded-xl font-bold text-sm tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
        >
          {loading ? <ArrowPathIcon className="w-5 h-5 animate-spin text-white" /> : 'Synchronize Profile Coordinates'}
        </button>
      </form>
    </motion.div>
  );
}
