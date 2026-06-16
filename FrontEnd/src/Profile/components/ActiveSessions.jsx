import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowPathRoundedSquareIcon, DevicePhoneMobileIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { SectionLabel } from './SectionLabel';
import { profileService } from '../services/profileService';

export default function ActiveSessions({ activeTab, tabVariants, setErrorMsg, setSuccessMsg, onClose }) {
  const [devices, setDevices] = useState([]);
  const [isSyncingSessions, setIsSyncingSessions] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'activity') {
      fetchSessions();
    }
  }, [activeTab]);

  const fetchSessions = async () => {
    setIsSyncingSessions(true);
    try {
      const resp = await profileService.getSessions();
      setDevices(resp.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncingSessions(false);
    }
  };

  const handleRefreshSessions = () => {
    fetchSessions();
    setSuccessMsg('Live terminal connection networks synchronized successfully.');
  };

  const handleLogoutOtherDevices = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await profileService.revokeAllSessions();
      setSuccessMsg('Logged out of all secondary devices.');
      fetchSessions();
    } catch (err) {
      setErrorMsg('Failed to log out of other devices.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="activity"
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <SectionLabel text="LOGS & SESSION CONTROLS" color="amber" />
          <h3 className="text-xl font-semibold text-[#0F172A] tracking-tight">Active Devices & Security Logs</h3>
          <p className="text-xs text-[#64748B] font-semibold mt-1">Review authenticated terminals. Revoke old coordinates to seal access.</p>
        </div>

        <button
          type="button"
          onClick={handleRefreshSessions}
          disabled={isSyncingSessions}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white rounded-lg text-xs font-bold text-[#475569] hover:text-[#0F172A] cursor-pointer transition-all self-start sm:self-center shadow-sm"
        >
          <ArrowPathRoundedSquareIcon className={`w-4 h-4 text-[#FF2D20] ${isSyncingSessions ? 'animate-spin' : ''}`} />
          Sync Connections
        </button>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-[#475569] uppercase tracking-wider">Authorized Workspace Terminals:</h4>
        
        {isSyncingSessions ? (
          <div className="p-8 border border-[#E2E8F0] rounded-2xl bg-[#F8FAFC] flex flex-col items-center justify-center gap-2">
            <ArrowPathRoundedSquareIcon className="w-8 h-8 animate-spin text-[#FF2D20]" />
            <span className="text-xs text-[#64748B] font-bold uppercase tracking-wider">Polling Remote Session States...</span>
          </div>
        ) : (
          <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden divide-y divide-[#E2E8F0] shadow-sm">
            {devices.map(dev => (
              <div key={dev.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-[#E2E8F0]">
                    {dev.type === 'mobile' ? (
                      <DevicePhoneMobileIcon className="w-5 h-5 text-[#FF2D20]" />
                    ) : (
                      <ComputerDesktopIcon className="w-5 h-5 text-[#475569]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#0F172A]">{dev.os}</span>
                      {dev.isCurrent && (
                        <span className="bg-green-100 text-green-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide">This Terminal</span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#64748B] font-semibold truncate mt-0.5">
                      {dev.browser} • Last active: {dev.last_active}
                    </p>
                  </div>
                </div>

                <div>
                  {dev.isCurrent ? (
                    <button
                      type="button"
                      onClick={() => {
                        setLoading(true);
                        setTimeout(() => {
                          setLoading(false);
                          onClose();
                        }, 800);
                      }}
                      className="text-xs font-bold text-[#E5261A] hover:underline cursor-pointer"
                    >
                      Logout
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={async () => {
                        setLoading(true);
                        try {
                          await profileService.revokeSession(dev.id);
                          setSuccessMsg(`Session for ${dev.os} successfully terminated.`);
                          fetchSessions();
                        } catch (err) {
                          setErrorMsg(`Failed to revoke session for ${dev.os}.`);
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {devices.length > 1 && !isSyncingSessions && (
        <button
          type="button"
          onClick={handleLogoutOtherDevices}
          className="w-full py-2.5 border border-red-200 hover:bg-red-50 text-red-600 hover:text-[#E5261A] rounded-xl text-xs font-bold transition-all cursor-pointer bg-white"
        >
          Revoke All Other Device Sessions
        </button>
      )}
    </motion.div>
  );
}
