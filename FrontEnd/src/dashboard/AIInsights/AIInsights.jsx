import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

export default function AIInsights({ state, dispatch }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  
  const [alerts, setAlerts] = useState([]);
  const [severityCounts, setSeverityCounts] = useState({ critical: 0, warning: 0, info: 0 });
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { isRefreshing } = state.insights;
  const pollIntervalRef = useRef(null);
  const pollTimeoutRef = useRef(null);

  const fetchAlerts = async (silent = false) => {
    try {
      const response = await axios.get('/api/insights/alerts');
      setAlerts(response.data.alerts || []);
      setSeverityCounts(response.data.severity_counts || { critical: 0, warning: 0, info: 0 });
      setLastRefreshed(response.data.last_analyzed);
      if (!silent) setIsInitialLoad(false);
      return response.data.last_analyzed;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      if (!silent) setIsInitialLoad(false);
      return null;
    }
  };

  useEffect(() => {
    fetchAlerts();
    return () => stopPolling();
  }, []);

  const stopPolling = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
    dispatch({ type: 'SET_INSIGHTS_REFRESHING', payload: false });
  };

  const handleRefresh = async () => {
    dispatch({ type: 'SET_INSIGHTS_REFRESHING', payload: true });
    
    try {
      await axios.post('/api/insights/refresh');
      const startAnalyzed = lastRefreshed;

      pollIntervalRef.current = setInterval(async () => {
        const newAnalyzed = await fetchAlerts(true);
        if (newAnalyzed && newAnalyzed !== startAnalyzed) {
          stopPolling();
        }
      }, 3000);

      pollTimeoutRef.current = setTimeout(() => {
        stopPolling();
        fetchAlerts(true);
      }, 30000);

    } catch (err) {
      console.error('Failed to trigger refresh', err);
      stopPolling();
    }
  };

  const handleAskAI = (alert) => {
    const contextMsg = `I need help analyzing this alert:\n\nTitle: ${alert.title}\nDetails: ${alert.detail}\nCampaign: ${alert.campaign_name}\n\nRecommendation: ${alert.recommendation?.recommendation_text || ''}`;
    navigate('/advisor', { state: { autoSend: contextMsg } });
  };

  const filteredAlerts = alerts.filter(a => filter === 'All' || (a.severity && a.severity.toLowerCase() === filter.toLowerCase()));

  const formatLastAnalyzed = (dateString) => {
    if (!dateString) return 'Not yet analyzed';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  if (isInitialLoad) {
    return <div className="p-12 flex justify-center"><ArrowPathIcon className="w-6 h-6 animate-spin text-slate-400" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] font-mona leading-tight">AI Insights & Alerts</h2>
          <p className="text-xs font-semibold text-[#94A3B8] mt-0.5 max-w-2xl">
            Real-time anomaly detection and AI-generated optimization recommendations powered by Gemini.
          </p>
          <p className="text-[10px] font-bold text-[#94A3B8] uppercase mt-2">
            Last analyzed: {formatLastAnalyzed(lastRefreshed)}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] text-[11px] font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          <ArrowPathIcon className={`w-4 h-4 shrink-0 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Insights'}
        </button>
      </div>

      {/* SECTION 1 - ALERT SUMMARY STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-red-100">
              <ShieldExclamationIcon className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-red-700 uppercase tracking-wide">Critical Alerts</p>
              <p className="text-2xl font-extrabold text-red-900 font-mona leading-none mt-1">
                {severityCounts.critical || 0}
              </p>
            </div>
          </div>
          <button onClick={() => setFilter('critical')} className="text-[10px] font-bold text-red-600 hover:text-red-800 underline cursor-pointer">View</button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-yellow-100">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-yellow-700 uppercase tracking-wide">Warnings</p>
              <p className="text-2xl font-extrabold text-yellow-900 font-mona leading-none mt-1">
                {severityCounts.warning || 0}
              </p>
            </div>
          </div>
          <button onClick={() => setFilter('warning')} className="text-[10px] font-bold text-yellow-700 hover:text-yellow-900 underline cursor-pointer">View</button>
        </div>
      </div>

      {/* SECTION 2 - ACTIVE ALERTS FEED */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-[#0F172A] font-mona">Performance Alerts</h3>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {['All', 'critical', 'warning', 'info'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer border capitalize ${
                  filter.toLowerCase() === f 
                    ? 'bg-[#FFF1F0] border-[#FF2D20]/20 text-[#FF2D20]' 
                    : 'bg-white border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-[#E2E8F0]">
          <AnimatePresence>
            {filteredAlerts.length === 0 ? (
              <div className="p-8 text-center text-[#94A3B8] text-xs font-semibold">
                No alerts right now — your campaigns are performing within expected ranges. Click Refresh Insights to check again.
              </div>
            ) : (
              filteredAlerts.map(alert => (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  key={alert.id} 
                  className="p-5 flex flex-col md:flex-row md:items-start gap-4 hover:bg-[#F8FAFC] transition-colors"
                >
                  <div className="shrink-0 flex items-center gap-2 md:w-28 pt-0.5">
                    <span className={`w-2 h-2 rounded-full ${
                      alert.severity === 'critical' ? 'bg-red-500' :
                      alert.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      alert.severity === 'critical' ? 'text-red-700' :
                      alert.severity === 'warning' ? 'text-yellow-700' : 'text-blue-700'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>

                  <div className="flex-1 space-y-2 text-left">
                    <h4 className="text-[15px] font-bold text-[#0F172A]">{alert.title}</h4>
                    <p className="text-[13px] font-medium text-[#475569] leading-relaxed max-w-3xl">{alert.detail}</p>
                    
                    {alert.recommendation && (
                      <div className="mt-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                        <div className="flex items-center gap-1.5 mb-1 text-indigo-700">
                          <ShieldExclamationIcon className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">AI Recommendation ({alert.recommendation.category})</span>
                        </div>
                        <p className="text-[12px] font-medium text-indigo-900 leading-relaxed">
                          {alert.recommendation.recommendation_text}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 font-bold text-[9px] uppercase tracking-wide rounded">
                        {alert.campaign_name}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 font-bold text-[9px] uppercase tracking-wide rounded">
                        {alert.platform}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between md:w-32 gap-3 mt-3 md:mt-0">
                    <span className="text-[10px] font-bold text-[#94A3B8]">{formatDistanceToNow(new Date(alert.triggered_at), { addSuffix: true })}</span>
                    <button 
                      onClick={() => handleAskAI(alert)}
                      className="inline-flex items-center gap-1 bg-white border border-[#E2E8F0] hover:border-[#FF2D20] hover:text-[#FF2D20] text-[#475569] text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Ask AI <ArrowRightIcon className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

    </motion.div>
  );
}
