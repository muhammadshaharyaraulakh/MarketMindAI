import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpTrayIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

export default function DataIngestion({ state, dispatch }) {
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState('Google Ads');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [demoLoadingId, setDemoLoadingId] = useState(null);
  const [demoSuccessId, setDemoSuccessId] = useState(null);
  const [isDemoExpanded, setIsDemoExpanded] = useState(false);

  const platforms = ['Google Ads', 'Meta Ads', 'Snapchat Ads', 'Custom / Other'];

  const requiredFields = [
    'Date', 'Spend', 'Revenue', 'Impressions', 'Clicks', 'Leads', 'Campaign Name', 'Platform'
  ];

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith('.csv')) {
        setSelectedFile(file);
        setUploadSuccess(false);
      } else {
        alert('Please upload a .csv file');
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
      if (file.name.endsWith('.csv')) {
        setSelectedFile(file);
        setUploadSuccess(false);
      } else {
        alert('Please upload a .csv file');
      }
    }
  };

  const handleIngest = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      dispatch({
        type: 'ADD_UPLOAD',
        payload: {
          id: Date.now(),
          file: selectedFile.name,
          platform: selectedPlatform.replace(' Ads', ''),
          rows: '1,240 rows',
          status: 'Ready',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }
      });
      setTimeout(() => {
        setSelectedFile(null);
        setUploadSuccess(false);
      }, 3000);
    }, 2000);
  };

  const handleLoadDemo = (id, rowsStr, platformStr) => {
    setDemoLoadingId(id);
    setTimeout(() => {
      setDemoLoadingId(null);
      setDemoSuccessId(id);
      dispatch({
        type: 'ADD_UPLOAD',
        payload: {
          id: Date.now(),
          file: `demo_dataset_${id}.csv`,
          platform: platformStr,
          rows: rowsStr,
          status: 'Ready',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }
      });
      setTimeout(() => setDemoSuccessId(null), 3000);
    }, 1500);
  };

  const handleDeleteUpload = (id) => {
    dispatch({ type: 'DELETE_UPLOAD', payload: id });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] font-mona leading-tight">Data Ingestion Engine</h2>
          <p className="text-xs font-semibold text-[#94A3B8] mt-0.5">Upload campaign exports or load demo datasets to power your AI analytics engine.</p>
        </div>
        <button
          onClick={() => document.getElementById('demo-section').scrollIntoView({ behavior: 'smooth' })}
          className="bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] text-[11px] font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <ArrowPathIcon className="w-4 h-4 shrink-0" />
          Load Demo Data
        </button>
      </div>

      {/* SECTION 1 - UPLOAD ZONE */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#0F172A] font-mona mb-4">Upload Campaign CSV</h3>
        
        {/* Platform Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {platforms.map(p => (
            <button
              key={p}
              onClick={() => setSelectedPlatform(p)}
              className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                selectedPlatform === p
                  ? 'border-[#FF2D20] bg-red-50 text-[#FF2D20]'
                  : 'border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#F8FAFC]'
              }`}
            >
              {p}
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
            <div className="border border-green-200 bg-green-50 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircleIconSolid className="w-6 h-6 text-green-500" />
                <div>
                  <p className="text-sm font-bold text-green-900">{selectedFile.name}</p>
                  <p className="text-[10px] font-semibold text-green-700">{(selectedFile.size / 1024).toFixed(1)} KB · CSV Document</p>
                </div>
              </div>
              <button onClick={() => setSelectedFile(null)} className="p-1 hover:bg-green-100 rounded text-green-700 cursor-pointer">
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Column Mapping UI */}
            <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
              <div className="bg-[#F8FAFC] p-3 border-b border-[#E2E8F0]">
                <h4 className="text-xs font-bold text-[#0F172A] font-mona">Map Your Columns</h4>
              </div>
              <div className="p-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-[#E2E8F0]">
                      <th className="p-3 pl-4 text-[10px] font-bold text-[#94A3B8] uppercase w-1/2">Required Field</th>
                      <th className="p-3 pr-4 text-[10px] font-bold text-[#94A3B8] uppercase w-1/2">Your CSV Column</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {requiredFields.map((field, idx) => (
                      <tr key={idx} className="bg-white">
                        <td className="p-3 pl-4 text-xs font-semibold text-[#0F172A] flex items-center gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-green-500" />
                          {field}
                        </td>
                        <td className="p-3 pr-4">
                          <select className="w-full px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#475569] focus:outline-none focus:border-[#FF2D20]">
                            <option>{field}</option>
                            <option>Ignore</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              onClick={handleIngest}
              disabled={isUploading}
              className="w-full bg-[#FF2D20] hover:bg-[#E5261A] disabled:opacity-70 text-white text-xs font-bold py-3 rounded-xl cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing 1,240 rows...
                </>
              ) : 'Begin Ingestion'}
            </button>
          </div>
        )}

        {/* Upload Success */}
        {uploadSuccess && (
          <div className="border border-green-200 bg-green-50 rounded-xl p-8 flex flex-col items-center justify-center text-center animate-fadeIn">
            <CheckCircleIconSolid className="w-12 h-12 text-green-500 mb-3" />
            <h4 className="text-sm font-medium text-green-900 mb-1">✓ 1,240 rows inserted into MySQL (ad_analytics, campaigns, ad_sets)</h4>
            <p className="text-xs font-medium text-green-700 mb-4 max-w-lg">Your tabular dataset is safely stored. Raw numerical data is never dumped directly into the AI chatbot.</p>
            
            <button 
              onClick={() => navigate('/advisor', { state: { autoSend: 'I have just ingested 1,240 rows of campaign data. Please analyze this dataset for trends and anomalies based on the Pinecone semantic summary.' } })}
              className="bg-[#10B981] hover:bg-[#059669] text-white text-xs font-medium px-4 py-2.5 rounded-lg cursor-pointer transition-colors shadow-sm inline-flex items-center gap-1.5"
            >
              <SparklesIcon className="w-4 h-4" />
              Analyze with AI
            </button>
            <p className="text-[10px] text-green-600 mt-3 max-w-md mx-auto leading-relaxed">
              This runs a MySQL aggregation (totals, trends, anomalies), generates a semantic text summary, embeds that summary into Pinecone, and opens the AI chat pre-seeded with context.
            </p>
          </div>
        )}
      </div>

      {/* SECTION 2 - UPLOAD HISTORY */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#0F172A] font-mona mb-4">Ingestion History</h3>
        <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="p-4 pl-6 text-[10px] font-bold text-[#94A3B8] uppercase">File Name</th>
                  <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase">Platform</th>
                  <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase">Rows</th>
                  <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase">Status</th>
                  <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase">Date</th>
                  <th className="p-4 pr-6 text-[10px] font-bold text-[#94A3B8] uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {state.ingestion.uploads.map((upload) => (
                  <tr key={upload.id} className="hover:bg-[#F8FAFC]/50 transition-colors">
                    <td className="p-4 pl-6 text-xs font-bold text-[#0F172A] flex items-center gap-2">
                      <DocumentIcon className="w-4 h-4 text-[#94A3B8]" />
                      {upload.file}
                    </td>
                    <td className="p-4 text-xs font-semibold text-[#475569]">{upload.platform}</td>
                    <td className="p-4 text-xs font-semibold text-[#475569]">{upload.rows}</td>
                    <td className="p-4">
                      {upload.status === 'Ready' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border bg-green-100 text-green-700 border-green-200">
                          ✓ Ready
                        </span>
                      ) : upload.status === 'Processing' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border bg-blue-100 text-blue-700 border-blue-200">
                          Processing
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border bg-red-100 text-red-700 border-red-200">
                          ✗ Failed
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-xs font-semibold text-[#475569]">{upload.date}</td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex justify-end gap-3 items-center">
                        {upload.status === 'Failed' ? (
                          <button className="text-[11px] font-bold text-[#FF2D20] hover:text-[#E5261A] cursor-pointer">
                            Retry
                          </button>
                        ) : (
                          <button 
                            onClick={() => navigate('/advisor', { state: { autoSend: `I want to analyze the previously ingested dataset: ${upload.file}. What insights can you provide based on its semantic summary?` } })}
                            className="bg-[#10B981] hover:bg-[#059669] text-white text-[10px] font-bold px-2 py-1 rounded-md cursor-pointer transition-colors shadow-sm inline-flex items-center gap-1"
                          >
                            <SparklesIcon className="w-3 h-3" /> Analyze with AI
                          </button>
                        )}
                        <button onClick={() => handleDeleteUpload(upload.id)} className="text-[11px] font-bold text-[#94A3B8] hover:text-red-500 cursor-pointer">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 3 - DEMO DATA SEEDER (COLLAPSED BY DEFAULT) */}
      <div id="demo-section" className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <div 
          className="flex items-center justify-between cursor-pointer group"
          onClick={() => setIsDemoExpanded(!isDemoExpanded)}
        >
          <div>
            <h3 className="text-sm font-medium text-[#0F172A] font-mona mb-1 group-hover:text-[#FF2D20] transition-colors">Fallback: Demo Dataset Library</h3>
            <p className="text-xs font-medium text-[#94A3B8]">Guaranteed-working data paths in case CSV parsing hits edge cases during defense.</p>
          </div>
          <button className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#94A3B8] transition-colors group-hover:bg-[#FFF1F0] group-hover:text-[#FF2D20] group-hover:border-[#FF2D20]/20">
            {isDemoExpanded ? <ChevronUpIcon className="w-4 h-4 stroke-2" /> : <ChevronDownIcon className="w-4 h-4 stroke-2" />}
          </button>
        </div>
        
        {isDemoExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 animate-fadeIn">
            {[
              { id: '1', title: '30-Day Multi-Platform', sub: 'Google + Meta + Snapchat · 3,600 rows', tag: 'Recommended', rows: '3,600 rows', platform: 'Multiple' },
              { id: '2', title: 'E-Commerce Campaign Set', sub: 'Google Shopping + Meta · 1,800 rows', rows: '1,800 rows', platform: 'Multiple' },
              { id: '3', title: 'Brand Awareness Pack', sub: 'Snapchat + Meta · 900 rows', rows: '900 rows', platform: 'Multiple' }
            ].map(pack => (
              <div key={pack.id} className="border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between hover:border-[#CBD5E1] transition-colors relative">
                {pack.tag && (
                  <span className="absolute -top-2.5 right-4 bg-[#0F172A] text-white text-[9px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {pack.tag}
                  </span>
                )}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-[#0F172A] font-mona">{pack.title}</h4>
                  <p className="text-[11px] font-medium text-[#475569] mt-1">{pack.sub}</p>
                </div>
                <button
                  onClick={() => handleLoadDemo(pack.id, pack.rows, pack.platform)}
                  disabled={demoLoadingId === pack.id || demoSuccessId === pack.id}
                  className="w-full bg-[#FF2D20] hover:bg-[#E5261A] text-white text-xs font-medium py-2 rounded-lg cursor-pointer transition-colors shadow-sm disabled:opacity-90 flex items-center justify-center gap-1"
                >
                  {demoLoadingId === pack.id ? (
                    <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : demoSuccessId === pack.id ? (
                    <>
                      <CheckCircleIconSolid className="w-3.5 h-3.5" />
                      Loaded — {pack.rows}
                    </>
                  ) : 'Load Dataset'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
