import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function DataIngestion({ state, dispatch }) {
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState('Google Ads');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [summary, setSummary] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [completedCampaigns, setCompletedCampaigns] = useState([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const platforms = [
    { label: 'Google Ads', value: 'google' },
    { label: 'Meta Ads', value: 'meta' },
    { label: 'Snapchat Ads', value: 'snapchat' }
    ];

  const fetchCompletedCampaigns = async () => {
    setIsLoadingCampaigns(true);
    try {
      const response = await axios.get('/api/data-ingestion/completed-campaigns');
      if (response.status === 200) {
        setCompletedCampaigns(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  const fetchUploadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await axios.get('/api/data-ingestion/upload-history');
      if (response.status === 200) {
        setUploadHistory(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchCompletedCampaigns();
    fetchUploadHistory();
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
        setSelectedFile(file);
        setUploadSuccess(false);
        setErrorMsg(null);
      } else {
        alert('Please upload a .csv or .txt file');
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
        setSelectedFile(file);
        setUploadSuccess(false);
        setErrorMsg(null);
      } else {
        alert('Please upload a .csv or .txt file');
      }
    }
  };

  const handleIngest = async () => {
    setIsUploading(true);
    setErrorMsg(null);
    const platformValue = platforms.find(p => p.label === selectedPlatform)?.value || 'custom';

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('platform', platformValue);

    try {
      const response = await axios.post('/api/data-ingestion/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSummary(response.data.summary);
      setUploadSuccess(true);
      fetchCompletedCampaigns();
      fetchUploadHistory();
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const data = error.response.data;
        setErrorMsg(`Missing headers: ${data.missing_headers?.join(', ')}`);
        setIsUploading(false);
        return;
      }
      setErrorMsg('An error occurred during ingestion. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async (id) => {
    try {
      const response = await axios.get(`/api/data-ingestion/campaign-context/${id}`);
      if (response.status === 200) {
        const context = response.data;
        navigate('/advisor', {
          state: {
            autoSend: `Can you analyze my imported campaign: "${context.campaign.name}"? Please review the ingested data and provide actionable recommendations for improving ROAS.`
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] font-mona leading-tight">Data Ingestion Engine</h2>
          <p className="text-xs font-semibold text-[#94A3B8] mt-0.5">Upload campaign exports to power your AI analytics engine.</p>
        </div>
      </div>

      {/* SECTION 1 - UPLOAD ZONE */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#0F172A] font-mona mb-4">Upload Campaign CSV</h3>
        
        {/* Platform Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {platforms.map(p => (
            <button
              key={p.label}
              onClick={() => setSelectedPlatform(p.label)}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                selectedPlatform === p.label
                  ? 'border-[#FF2D20] bg-red-50 text-[#FF2D20]'
                  : 'border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#F8FAFC]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Drag & Drop Zone */}
        {!selectedFile && !uploadSuccess && (
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center text-center transition-colors hover:bg-[#F8FAFC]"
          >
            <ArrowUpTrayIcon className="w-10 h-10 text-gray-400 mb-3" />
            <p className="text-sm font-bold text-gray-600 mb-1">Drop your CSV file here</p>
            <p className="text-xs font-semibold text-gray-500">
              or{' '}
              <label className="text-[#FF2D20] underline cursor-pointer hover:text-red-600">
                click to browse
                <input type="file" accept=".csv" className="hidden" onChange={handleFileSelect} />
              </label>
            </p>
          </div>
        )}

        {/* File Selected State */}
        {selectedFile && !uploadSuccess && (
          <div className="space-y-6 animate-fadeIn">
            {errorMsg && (
              <div className="border border-red-200 bg-red-50 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <XCircleIcon className="w-6 h-6 text-red-500" />
                  <div>
                    <p className="text-sm font-bold text-red-900">Upload Failed</p>
                    <p className="text-[10px] font-semibold text-red-700">{errorMsg}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="border border-green-200 bg-green-50 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircleIconSolid className="w-6 h-6 text-green-500" />
                <div>
                  <p className="text-sm font-bold text-green-900">{selectedFile.name}</p>
                  <p className="text-[10px] font-semibold text-green-700">{(selectedFile.size / 1024).toFixed(1)} KB · CSV Document</p>
                </div>
              </div>
              <button onClick={() => { setSelectedFile(null); setErrorMsg(null); }} className="p-1 hover:bg-green-100 rounded text-green-700 cursor-pointer">
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleIngest}
              disabled={isUploading}
              className="w-full bg-[#FF2D20] hover:bg-[#E5261A] disabled:opacity-70 text-white text-xs font-bold py-3 rounded-xl cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing...
                </>
              ) : 'Begin Ingestion'}
            </button>
          </div>
        )}

        {/* Upload Success */}
        {uploadSuccess && summary && (
          <div className="border border-green-200 bg-green-50 rounded-xl p-8 flex flex-col items-center justify-center text-center animate-fadeIn">
            <CheckCircleIconSolid className="w-12 h-12 text-green-500 mb-3" />
            <h4 className="text-sm font-medium text-green-900 mb-1">✓ Ingested: {summary.campaigns} campaigns, {summary.adsets} ad sets, {summary.analytics_rows} rows</h4>
            <p className="text-xs font-medium text-green-700 mb-4 max-w-lg">Data successfully parsed and inserted into MySQL. The AI context is now ready.</p>
            <button 
              onClick={() => { setUploadSuccess(false); setSelectedFile(null); setSummary(null); }}
              className="bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] text-[11px] font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              Upload Another CSV
            </button>
          </div>
        )}
      </div>

      {/* SECTION 2 - COMPLETED CAMPAIGNS */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#0F172A] font-mona mb-1">Imported Campaign Analytics</h3>
        <p className="text-xs font-medium text-[#94A3B8] mb-6">Historical campaigns available for AI analysis</p>
        
        {isLoadingCampaigns ? (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ) : completedCampaigns.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">No campaigns imported yet. Upload a CSV above.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedCampaigns.map(campaign => (
              <div key={campaign.id} className="border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between hover:border-[#CBD5E1] transition-colors">
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold text-[#0F172A] font-mona">{campaign.name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      campaign.platform === 'google' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                      campaign.platform === 'meta' ? 'bg-blue-100 text-indigo-700 border border-indigo-200' :
                      campaign.platform === 'snapchat' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                      'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {campaign.platform}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-[#475569]">{campaign.dateRangeStart} – {campaign.dateRangeEnd}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-[#F8FAFC] p-2 rounded-lg border border-[#E2E8F0]">
                    <p className="text-[9px] font-bold text-[#94A3B8] uppercase">Total Spend</p>
                    <p className="text-xs font-bold text-[#0F172A]">${campaign.totalSpend.toLocaleString()}</p>
                  </div>
                  <div className="bg-[#F8FAFC] p-2 rounded-lg border border-[#E2E8F0]">
                    <p className="text-[9px] font-bold text-[#94A3B8] uppercase">ROAS</p>
                    <p className="text-xs font-bold text-[#0F172A]">{Number(campaign.averageRoas).toFixed(2)}x</p>
                  </div>
                  <div className="bg-[#F8FAFC] p-2 rounded-lg border border-[#E2E8F0]">
                    <p className="text-[9px] font-bold text-[#94A3B8] uppercase">Clicks</p>
                    <p className="text-xs font-bold text-[#0F172A]">{campaign.totalClicks.toLocaleString()}</p>
                  </div>
                  <div className="bg-[#F8FAFC] p-2 rounded-lg border border-[#E2E8F0]">
                    <p className="text-[9px] font-bold text-[#94A3B8] uppercase">Conversions</p>
                    <p className="text-xs font-bold text-[#0F172A]">{campaign.totalConversions.toLocaleString()}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleAnalyze(campaign.id)}
                  className="w-full bg-[#FF2D20] hover:bg-[#E5261A] text-white text-xs font-medium py-2.5 rounded-lg cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <SparklesIcon className="w-4 h-4" /> Analyze with AI
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3 - UPLOAD HISTORY */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#0F172A] font-mona mb-1">CSV Upload History</h3>
        <p className="text-xs font-medium text-[#94A3B8] mb-6">Recent data ingestion files</p>

        {isLoadingHistory ? (
          <div className="animate-pulse space-y-3">
             <div className="h-10 bg-slate-200 rounded w-full"></div>
             <div className="h-10 bg-slate-200 rounded w-full"></div>
          </div>
        ) : uploadHistory.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">No files uploaded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-y border-[#E2E8F0] text-[#475569]">
                <tr>
                  <th className="px-4 py-3 font-semibold rounded-tl-lg">File Name</th>
                  <th className="px-4 py-3 font-semibold">Platform</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Rows</th>
                  <th className="px-4 py-3 font-semibold rounded-tr-lg">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {uploadHistory.map(upload => (
                  <tr key={upload.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-4 py-3 font-medium text-[#0F172A]">{upload.original_filename}</td>
                    <td className="px-4 py-3 text-[#475569] capitalize">{upload.platform}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] ${
                        upload.status === 'success' || upload.status === 'completed' ? 'bg-green-100 text-green-700' :
                        upload.status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {upload.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#475569]">{upload.rows_processed || 0}</td>
                    <td className="px-4 py-3 text-[#475569]">{new Date(upload.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
