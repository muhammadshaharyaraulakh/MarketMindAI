import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  PresentationChartLineIcon,
  LightBulbIcon,
  TableCellsIcon,
  DocumentChartBarIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  SparklesIcon as SolidSparklesIcon,
  ArrowTrendingUpIcon,
  RectangleGroupIcon,
  DocumentMagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as SolidCheckCircleIcon } from '@heroicons/react/24/solid';

const REPORT_TYPES = [
  {
    id: 'performance_summary',
    name: 'Performance Summary',
    audience: 'Executive teams, clients',
    icon: ArrowTrendingUpIcon,
    sections: [
      { key: 'data_fetched', name: 'KPI Scorecard & Data', desc: 'Total spend, conversions, CPA, ROAS from your campaign data', icon: ChartBarIcon },
      { key: 'ai_executive_summary', name: 'AI Executive Commentary', desc: 'Plain text summary of overall performance written by Gemini', icon: DocumentTextIcon },
    ],
  },
  {
    id: 'ai_insights',
    name: 'AI Insights Report',
    audience: 'CMOs, strategists',
    icon: LightBulbIcon,
    sections: [
      { key: 'data_fetched', name: 'Data Aggregation', desc: 'Fetching raw campaign data for AI analysis', icon: ChartBarIcon },
      { key: 'ai_insight_narrative', name: 'Executive Narrative', desc: 'AI writes the tl;dr — big picture plus key findings', icon: DocumentTextIcon },
      { key: 'ai_insight_audience', name: 'Audience Behavior Insight', desc: 'Analysis of who converted, when, and on which device', icon: UserGroupIcon },
      { key: 'ai_insight_creative', name: 'Creative Performance Insight', desc: 'Analysis of ad format and headline patterns', icon: LightBulbIcon },
      { key: 'ai_insight_budget', name: 'Budget Intelligence Insight', desc: 'Analysis of budget allocation vs actual return', icon: CurrencyDollarIcon },
      { key: 'ai_personas', name: 'Consumer Behavioral Archetypes', desc: 'AI writes 2 persona descriptions based on targeting', icon: UserGroupIcon },
    ],
  },
  {
    id: 'campaign_breakdown',
    name: 'Campaign Breakdown',
    audience: 'Campaign managers, media buyers',
    icon: RectangleGroupIcon,
    sections: [
      { key: 'data_fetched', name: 'Data & Tables Generation', desc: 'Channel, Audience, Ad Set, and Ad Creative performance tables', icon: TableCellsIcon },
      { key: 'ai_key_learnings', name: 'Key Learnings', desc: 'AI writes what succeeded, what underperformed, and action items', icon: DocumentTextIcon },
    ],
  },
  {
    id: 'full_analytics',
    name: 'Full Analytics Export',
    audience: 'Data analysts, agency reporting',
    icon: DocumentTextIcon,
    sections: [
      { key: 'data_fetched', name: 'Comprehensive Data Assembly', desc: 'Fetching all raw data, trends, and breakdown tables', icon: ChartBarIcon },
      { key: 'ai_executive_summary', name: 'AI Executive Summary', desc: 'Overall performance commentary', icon: DocumentTextIcon },
      { key: 'ai_insight_narrative', name: 'Executive Narrative', desc: 'Big picture plus key unexpected findings', icon: DocumentTextIcon },
      { key: 'ai_insight_audience', name: 'Audience Behavior', desc: 'Who converted, when, and where', icon: UserGroupIcon },
      { key: 'ai_insight_creative', name: 'Creative Performance', desc: 'Best ad formats and headlines', icon: LightBulbIcon },
      { key: 'ai_insight_budget', name: 'Budget Intelligence', desc: 'Where money was over/under allocated', icon: CurrencyDollarIcon },
      { key: 'ai_personas', name: 'Consumer Archetypes', desc: 'Buyer personas based on targeting', icon: UserGroupIcon },
      { key: 'ai_key_learnings', name: 'Key Learnings', desc: 'Successes, underperformers, and action items', icon: DocumentTextIcon },
      { key: 'ai_final_recommendations', name: 'Strategic Recommendations', desc: 'Full recommendation section for next period', icon: SolidSparklesIcon },
    ],
  },
];

export default function ReportsExport() {
  const [reportType, setReportType] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  
  const [jobStatus, setJobStatus] = useState(null); // 'processing', 'completed', 'failed'
  const [jobId, setJobId] = useState(null);
  const [reportId, setReportId] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [completedSections, setCompletedSections] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);

  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    fetchCampaigns();
    fetchHistory();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get('/api/reports/campaigns');
      setCampaigns(res.data);
    } catch (e) {
      console.error('Failed to fetch campaigns', e);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get('/api/reports/history');
      setHistory(res.data);
    } catch (e) {
      console.error('Failed to fetch history', e);
    }
  };

  useEffect(() => {
    let interval;
    if (jobStatus === 'processing' && reportId) {
      interval = setInterval(async () => {
        try {
          const res = await axios.get(`/api/reports/status/${reportId}`);
          const { status, completed_sections, progress_percent, error } = res.data;
          
          setCompletedSections(completed_sections || []);
          setProgressPercent(progress_percent || 0);

          if (status === 'completed') {
            setJobStatus('completed');
            setFileInfo({ size: res.data.pdf_size_bytes, time: res.data.generation_time_seconds });
            clearInterval(interval);
            fetchHistory();
          } else if (status === 'failed') {
            setJobStatus('failed');
            setErrorMessage(error || 'An unexpected error occurred during generation.');
            clearInterval(interval);
          }
        } catch (e) {
          console.error('Failed to poll status', e);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [jobStatus, reportId]);

  const handlePrepareReport = async () => {
    if (!reportType || !selectedCampaign) return;
    
    setJobStatus('processing');
    setProgressPercent(0);
    setCompletedSections([]);
    setErrorMessage(null);
    setFileInfo(null);

    try {
      const res = await axios.post('/api/reports/generate', {
        campaign_id: selectedCampaign,
        report_type: reportType.id,
      });
      setJobId(res.data.job_id);
      setReportId(res.data.report_id);
    } catch (e) {
      setJobStatus('failed');
      setErrorMessage(e.response?.data?.error || 'Failed to dispatch generation job.');
    }
  };

  const handleDownload = async (idToDownload = reportId) => {
    if (!idToDownload) return;
    try {
      const res = await axios.get(`/api/reports/download/${idToDownload}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Report_${idToDownload}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error('Failed to download report', e);
      alert('Failed to download report. Please try again.');
    }
  };

  const resetForm = () => {
    setJobStatus(null);
    setProgressPercent(0);
    setCompletedSections([]);
    setErrorMessage(null);
  };

  const currentTypeConfig = REPORT_TYPES.find(r => r.id === reportType?.id);

  return (
    <div className="space-y-8 text-left pb-16">
      <div>
        <h2 className="text-2xl font-bold text-[#0F172A] font-mona leading-tight">Reports Export</h2>
        <p className="text-sm font-semibold text-[#94A3B8] mt-1 max-w-2xl">
          Generate professional, AI-powered PDF reports directly from your campaign data.
        </p>
      </div>

      {/* SECTION 1 — Report Type Selector */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Select Report Type</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REPORT_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => {
                if (jobStatus === 'processing') return;
                setReportType(type);
                if (jobStatus) resetForm();
              }}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                reportType?.id === type.id
                  ? 'border-[#FF2D20] bg-red-50 shadow-md ring-1 ring-[#FF2D20]'
                  : 'border-[#E2E8F0] bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${reportType?.id === type.id ? 'bg-[#FF2D20]/10 text-[#FF2D20]' : 'bg-slate-50 text-slate-500'}`}>
                  <type.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`text-base font-bold font-mona ${reportType?.id === type.id ? 'text-[#FF2D20]' : 'text-[#0F172A]'}`}>{type.name}</h3>
                  <p className="text-xs font-medium text-slate-500 mt-1">Best for: {type.audience}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 2 — Campaign Selector */}
      {reportType && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Select Campaign</label>
          <p className="text-xs text-slate-500 mb-2">Data will be pulled from your imported and active campaigns</p>
          <select 
            value={selectedCampaign}
            onChange={(e) => {
              if (jobStatus === 'processing') return;
              setSelectedCampaign(e.target.value);
              if (jobStatus) resetForm();
            }}
            className="w-full max-w-xl px-4 py-3 border border-[#E2E8F0] rounded-xl text-sm font-normal text-slate-600 focus:outline-none focus:border-[#FF2D20] bg-white shadow-sm cursor-pointer"
          >
            <option value="" disabled>Select a campaign</option>
            {campaigns.map(c => (
              <option key={c.id} value={c.id}>{c.name} — {c.platform} ({c.status})</option>
            ))}
          </select>
        </motion.div>
      )}

      {/* SECTION 3, 4, 5, 6 — Checklist & Generation */}
      {reportType && selectedCampaign && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm max-w-xl">
          <h3 className="text-sm font-bold text-[#0F172A] font-mona mb-4">This report will include:</h3>

          {/* Progress Bar */}
          {jobStatus && (
            <div className="mb-6">
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  className="bg-[#FF2D20] h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ ease: "easeInOut" }}
                />
              </div>
              <p className="text-xs font-medium text-slate-500 mt-2 text-right">
                {completedSections.length} of {currentTypeConfig.sections.length} sections complete
              </p>
            </div>
          )}

          {/* Checklist */}
          <div className="space-y-4 mb-8">
            {currentTypeConfig.sections.map((section, idx) => {
              const isDone = completedSections.includes(section.key);
              return (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {isDone ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <SolidCheckCircleIcon className="w-5 h-5 text-green-500" />
                      </motion.div>
                    ) : (
                      <CheckCircleIcon className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <h4 className={`text-sm font-semibold ${isDone ? 'text-slate-900' : 'text-slate-500'}`}>{section.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{section.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {jobStatus === 'failed' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-sm text-red-600 font-medium mb-2">{errorMessage}</p>
              <button onClick={resetForm} className="text-sm text-[#FF2D20] font-bold hover:underline">
                Try Again
              </button>
            </div>
          )}

          {!jobStatus || jobStatus === 'failed' ? (
            <button
              onClick={handlePrepareReport}
              className="w-full bg-[#FF2D20] hover:bg-[#E5261A] text-white text-sm font-bold py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <SparklesIcon className="w-5 h-5" />
              Prepare Report
            </button>
          ) : jobStatus === 'processing' ? (
            <button
              disabled
              className="w-full bg-[#FF2D20]/80 text-white text-sm font-bold py-3.5 rounded-xl cursor-wait flex items-center justify-center gap-2"
            >
              <ArrowPathIcon className="w-5 h-5 animate-spin" />
              Building your report...
            </button>
          ) : (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <button
                  onClick={() => handleDownload()}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  Download PDF Report
                </button>
                {fileInfo && (
                  <p className="text-center text-xs text-slate-500 mt-3">
                    Size: {(fileInfo.size / 1024).toFixed(1)} KB • Generated in {fileInfo.time}s
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      )}

      {/* SECTION 7 — Recent Reports */}
      <div className="pt-8 border-t border-slate-200">
        <h3 className="text-lg font-bold text-[#0F172A] font-mona mb-4">Previously Generated Reports</h3>
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
          {history.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm font-medium">
              No reports generated yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-[#E2E8F0]">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-600">Report Name</th>
                    <th className="px-6 py-4 font-bold text-slate-600">Type</th>
                    <th className="px-6 py-4 font-bold text-slate-600">Campaign</th>
                    <th className="px-6 py-4 font-bold text-slate-600">Date</th>
                    <th className="px-6 py-4 font-bold text-slate-600">Size</th>
                    <th className="px-6 py-4 text-right font-bold text-slate-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {history.map(item => {
                    const typeLabel = REPORT_TYPES.find(t => t.id === item.report_type)?.name || item.report_type;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">Report #{item.id}</td>
                        <td className="px-6 py-4 text-slate-600">{typeLabel}</td>
                        <td className="px-6 py-4 text-slate-600">{item.campaign_name}</td>
                        <td className="px-6 py-4 text-slate-600">{new Date(item.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-slate-600">{item.pdf_size_bytes ? `${(item.pdf_size_bytes / 1024).toFixed(1)} KB` : '—'}</td>
                        <td className="px-6 py-4 text-right">
                          {item.status === 'completed' ? (
                            <button
                              onClick={() => handleDownload(item.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors"
                            >
                              <ArrowDownTrayIcon className="w-4 h-4" />
                              Download
                            </button>
                          ) : (
                            <span className="text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-700 rounded-md">
                              {item.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
