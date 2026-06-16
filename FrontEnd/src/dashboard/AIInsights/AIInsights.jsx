import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  LightBulbIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function AIInsights({ state, dispatch }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const { alerts, recommendations, lastRefreshed, isRefreshing } = state.insights;

  const handleRefresh = () => {
    dispatch({ type: 'SET_INSIGHTS_REFRESHING', payload: true });
    setTimeout(() => {
      dispatch({ type: 'SET_INSIGHTS_REFRESHING', payload: false });
    }, 1500);
  };

  const handleAskAI = (alert) => {
    // Navigate to advisor with context
    const contextMsg = `I need help analyzing this alert:\n\nTitle: ${alert.title}\nDetails: ${alert.detail}\nCampaign: ${alert.campaign}`;
    dispatch({ type: 'ADD_CHAT_MESSAGE_V2', payload: { role: 'user', parts: [{ text: contextMsg }] } });
    navigate('/advisor');
  };

  const filteredAlerts = alerts.filter(a => filter === 'All' || a.severity === filter);

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
            Last analyzed: {new Date(lastRefreshed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-red-100">
              <ShieldExclamationIcon className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-red-700 uppercase tracking-wide">Critical Alerts</p>
              <p className="text-2xl font-extrabold text-red-900 font-mona leading-none mt-1">
                {alerts.filter(a => a.severity === 'Critical').length}
              </p>
            </div>
          </div>
          <button onClick={() => setFilter('Critical')} className="text-[10px] font-bold text-red-600 hover:text-red-800 underline">View</button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-yellow-100">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-yellow-700 uppercase tracking-wide">Warnings</p>
              <p className="text-2xl font-extrabold text-yellow-900 font-mona leading-none mt-1">
                {alerts.filter(a => a.severity === 'Warning').length}
              </p>
            </div>
          </div>
          <button onClick={() => setFilter('Warning')} className="text-[10px] font-bold text-yellow-700 hover:text-yellow-900 underline">View</button>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-green-100">
              <LightBulbIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-green-700 uppercase tracking-wide">Opportunities</p>
              <p className="text-2xl font-extrabold text-green-900 font-mona leading-none mt-1">
                {recommendations.length}
              </p>
            </div>
          </div>
          <button onClick={() => document.getElementById('recommendations-section').scrollIntoView({ behavior: 'smooth' })} className="text-[10px] font-bold text-green-700 hover:text-green-900 underline">View</button>
        </div>
      </div>

      {/* SECTION 2 - ACTIVE ALERTS FEED */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-[#0F172A] font-mona">Performance Alerts</h3>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {['All', 'Critical', 'Warning', 'Info'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer border ${
                  filter === f 
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
                No alerts matching this filter.
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
                      alert.severity === 'Critical' ? 'bg-red-500' :
                      alert.severity === 'Warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      alert.severity === 'Critical' ? 'text-red-700' :
                      alert.severity === 'Warning' ? 'text-yellow-700' : 'text-blue-700'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>

                  <div className="flex-1 space-y-2 text-left">
                    <h4 className="text-[15px] font-bold text-[#0F172A]">{alert.title}</h4>
                    <p className="text-[13px] font-medium text-[#475569] leading-relaxed max-w-3xl">{alert.detail}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 font-bold text-[9px] uppercase tracking-wide rounded">
                        {alert.campaign}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 font-bold text-[9px] uppercase tracking-wide rounded">
                        {alert.platform}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between md:w-32 gap-3 mt-3 md:mt-0">
                    <span className="text-[10px] font-bold text-[#94A3B8]">{alert.time}</span>
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

      {/* SECTION 3 - AI RECOMMENDATIONS */}
      <div id="recommendations-section" className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-sm font-bold text-[#0F172A] font-mona">AI Optimization Recommendations</h3>
          <p className="text-xs font-semibold text-[#94A3B8] mt-0.5">Generated by Gemini based on your campaign data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {recommendations.map(rec => (
            <div key={rec.id} className="border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h4 className="text-sm font-bold text-[#0F172A] font-mona leading-tight pr-4">{rec.title}</h4>
                  <span className="shrink-0 px-2 py-1 bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] font-bold text-[9px] uppercase tracking-wider rounded-md">
                    {rec.category}
                  </span>
                </div>
                <p className="text-xs font-medium text-[#475569] leading-relaxed mb-4">{rec.body}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 font-bold text-[9px] uppercase tracking-wide rounded">
                    {rec.campaign}
                  </span>
                  <span className="px-2 py-0.5 bg-green-50 border border-green-200 text-green-700 font-bold text-[9px] uppercase tracking-wide rounded flex items-center gap-1">
                    <SparklesIcon className="w-3 h-3" />
                    {rec.impact}
                  </span>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-[#E2E8F0]">
                  <button className="flex-1 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#FF2D20] hover:text-[#FF2D20] text-[#0F172A] text-[11px] font-bold px-3 py-2 rounded-xl transition-colors shadow-sm cursor-pointer">
                    Apply Suggestion
                  </button>
                  <button className="text-[10px] font-bold text-[#94A3B8] hover:text-red-500 cursor-pointer underline">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function SparklesIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}
