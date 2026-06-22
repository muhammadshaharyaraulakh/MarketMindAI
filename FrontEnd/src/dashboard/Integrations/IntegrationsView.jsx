import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, TrashIcon, LinkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export default function IntegrationsView({ state, dispatch }) {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  
  const [accountName, setAccountName] = useState('');
  const [accountId, setAccountId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectError, setConnectError] = useState('');

  const [disconnectModalOpen, setDisconnectModalOpen] = useState(false);
  const [accountToDisconnect, setAccountToDisconnect] = useState(null);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const res = await axios.get('/api/integrations');
      if (res.data.success) {
        dispatch({ type: 'SET_INTEGRATIONS', payload: res.data.data });
      }
    } catch (e) {
      console.error("Failed to fetch integrations:", e);
    }
  };

  const openConnectModal = (platformKey) => {
    setSelectedPlatform(platformKey);
    setAccountName('');
    setAccountId('');
    setAccessToken('');
    setConnectError('');
    setIsConnectModalOpen(true);
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!accountName || !accountId || !accessToken) return;
    
    setIsLoading(true);
    try {
      const res = await axios.post('/api/integrations', {
        platform: selectedPlatform,
        account_name: accountName,
        platform_account_id: accountId,
        access_token: accessToken
      });
      if (res.data.success) {
        setIsConnectModalOpen(false);
        fetchIntegrations();
      }
    } catch (e) {
      console.error("Failed to connect account:", e);
      if (e.response && e.response.data && e.response.data.error) {
        setConnectError(e.response.data.error);
      } else {
        setConnectError("An unexpected error occurred while connecting.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDisconnect = (id) => {
    setAccountToDisconnect(id);
    setDisconnectModalOpen(true);
  };

  const handleDisconnect = async () => {
    if (!accountToDisconnect) return;
    setIsLoading(true);
    try {
      const res = await axios.delete(`/api/integrations/${accountToDisconnect}`);
      if (res.data.success) {
        setDisconnectModalOpen(false);
        setAccountToDisconnect(null);
        fetchIntegrations();
      }
    } catch (e) {
      console.error("Failed to disconnect account:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
      <div>
        <h2 className="text-xl font-bold text-[#0F172A] font-mona leading-tight">Platform Integrations</h2>
        <p className="text-xs font-semibold text-[#94A3B8] mt-0.5">Manage connected ad accounts and configure Sandbox/API settings.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.integrations.map((integration, idx) => (
          <div key={idx} className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-bold text-[#0F172A] font-mona">{integration.platform}</h3>
                {integration.accounts.length > 0 && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">Connected</span>
                )}
              </div>
              
              {integration.accounts.length > 0 ? (
                <div className="space-y-3 mt-4">
                  {integration.accounts.map((acc, aIdx) => (
                    <div key={aIdx} className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl flex items-center justify-between group">
                      <div>
                        <p className="text-xs font-bold text-[#0F172A]">{acc.name}</p>
                        <p className="text-[10px] font-semibold text-[#94A3B8] mt-0.5">ID: {acc.platform_account_id}</p>
                      </div>
                      <button 
                        onClick={() => confirmDisconnect(acc.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 hover:text-red-600 text-slate-400 rounded-lg transition-all cursor-pointer"
                        title="Disconnect Account"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-semibold text-[#94A3B8] mt-4">No accounts connected. Connect a sandbox or live API token to start pushing ads.</p>
              )}
            </div>
            
            {integration.accounts.length === 0 ? (
              <button 
                onClick={() => openConnectModal(integration.key)}
                className="mt-6 w-full text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors shadow-sm flex justify-center items-center gap-2 bg-[#FF2D20] text-white hover:bg-[#E5261A]"
              >
                <LinkIcon className="w-4 h-4" />
                Connect Account
              </button>
            ) : (
              <div className="mt-6 w-full text-xs font-bold px-4 py-2.5 rounded-xl border border-green-200 bg-green-50 text-green-700 flex justify-center items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Active Connection
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Connect Integration Modal */}
      <AnimatePresence>
        {isConnectModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
              onClick={() => setIsConnectModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
                <h3 className="font-bold text-[#0F172A] flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-[#FF2D20]" />
                  Connect {state.integrations.find(i => i.key === selectedPlatform)?.platform}
                </h3>
                <button onClick={() => setIsConnectModalOpen(false)} className="text-[#94A3B8] hover:text-[#0F172A] cursor-pointer">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleConnect} className="p-6">
                {connectError && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2">
                    <ExclamationTriangleIcon className="w-4 h-4 shrink-0" />
                    {connectError}
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-light text-[#0F172A] mb-1.5">Account Name</label>
                    <input 
                      type="text" 
                      value={accountName}
                      onChange={e => setAccountName(e.target.value)}
                      placeholder="e.g. My Meta Sandbox"
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm font-light placeholder:font-light text-[#0F172A] focus:outline-none focus:border-[#FF2D20] focus:ring-2 focus:ring-red-500/10"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-light text-[#0F172A] mb-1.5">Platform Ad Account ID</label>
                    <input 
                      type="text" 
                      value={accountId}
                      onChange={e => setAccountId(e.target.value)}
                      placeholder="e.g. act_123456789"
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm font-light placeholder:font-light text-[#0F172A] focus:outline-none focus:border-[#FF2D20] focus:ring-2 focus:ring-red-500/10"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-light text-[#0F172A] mb-1.5">Platform Access Token</label>
                    <input 
                      type="password" 
                      value={accessToken}
                      onChange={e => setAccessToken(e.target.value)}
                      placeholder="Paste your OAuth or Sandbox Token here"
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm font-light placeholder:font-light text-[#0F172A] focus:outline-none focus:border-[#FF2D20] focus:ring-2 focus:ring-red-500/10"
                      required
                    />
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs font-medium text-blue-800">
                    If you are using a sandbox API for testing, please input your exact Sandbox Account ID here so our backend can map it properly.
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsConnectModalOpen(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-[#475569] font-bold text-sm hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isLoading || !accountName || !accountId || !accessToken}
                    className="flex-1 bg-[#FF2D20] hover:bg-[#E5261A] text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex justify-center items-center"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      'Save Connection'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Disconnect Modal */}
      <AnimatePresence>
        {disconnectModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
              onClick={() => setDisconnectModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden p-6"
            >
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] font-mona mb-2">Disconnect Account</h3>
              <p className="text-sm text-[#475569] font-medium leading-relaxed mb-6">
                Are you sure you want to disconnect this ad account? Your active campaigns will no longer sync data, and you won't be able to publish new ads to this platform.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setDisconnectModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-[#475569] font-bold text-sm hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDisconnect}
                  disabled={isLoading}
                  className="flex-1 bg-[#FF2D20] hover:bg-[#E5261A] text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex justify-center items-center"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    'Disconnect'
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
