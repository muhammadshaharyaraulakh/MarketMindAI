import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import {
  DocumentChartBarIcon,
  DocumentIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

export default function ReportsExport({ state, dispatch }) {
  const { history, isGenerating } = state.reports;
  const campaigns = state.campaigns.filter(c => !c.deletedAt);
  const activeCampaignsCount = campaigns.length;

  const [reportType, setReportType] = useState('Performance Summary');
  const [selectedCampaign, setSelectedCampaign] = useState(campaigns.length > 0 ? campaigns[0].id : '');
  const [sections, setSections] = useState({
    executiveSummary: true,
    kpiOverview: true,
    campaignPerformance: true,
    aiRecommendations: true
  });
  const [reportTitle, setReportTitle] = useState('MarketMind AI — Performance Report');

  // Scheduled delivery state
  const [scheduledEnabled, setScheduledEnabled] = useState(false);
  const [scheduleFreq, setScheduleFreq] = useState('Weekly');

  const handleGeneratePDF = () => {
    dispatch({ type: 'SET_GENERATING', payload: true });

    setTimeout(() => {
      // Initialize PDF
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;

      // Primary color: #FF2D20 (rgb 255, 45, 32)
      // Dark slate: #0F172A (rgb 15, 23, 42)

      // PAGE 1 - COVER
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 297, 'F');
      
      doc.setTextColor(255, 45, 32); // red
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('MarketMind AI', 20, 40);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(36);
      doc.text(reportTitle, 20, 70, { maxWidth: pageWidth - 40 });

      const campaignName = campaigns.find(c => c.id === selectedCampaign)?.name || 'Unknown Campaign';

      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 120);
      doc.text(`Campaign Included: ${campaignName}`, 20, 130);

      // PAGE 2 - EXECUTIVE SUMMARY & KPI OVERVIEW
      doc.addPage();
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('Executive Summary', 20, 30);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const summaryText = `Recent performance for the selected campaign indicates consistent engagement. The ROAS remains stable, with targeted AI optimizations resulting in a 12% improvement in cost-per-click efficiency. Keep monitoring the ad sets closely to maintain this trajectory.`;
      doc.text(summaryText, 20, 45, { maxWidth: pageWidth - 40, lineHeightFactor: 1.5 });

      if (sections.kpiOverview) {
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('KPI Overview', 20, 90);

        // Stats boxes (simulated with rectangles)
        doc.setDrawColor(226, 232, 240);
        doc.setFillColor(248, 250, 252);
        
        doc.roundedRect(20, 100, 75, 30, 3, 3, 'FD');
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(148, 163, 184);
        doc.text('TOTAL SPEND', 25, 110);
        doc.setFontSize(18);
        doc.setTextColor(15, 23, 42);
        doc.text('$8,450.00', 25, 122);

        doc.roundedRect(105, 100, 75, 30, 3, 3, 'FD');
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(148, 163, 184);
        doc.text('BLENDED ROAS', 110, 110);
        doc.setFontSize(18);
        doc.setTextColor(255, 45, 32);
        doc.text('7.2x', 110, 122);
      }

      // PAGE 3 - CAMPAIGN PERFORMANCE TABLE
      if (sections.campaignPerformance) {
        doc.addPage();
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('Campaign Performance Breakdown', 20, 30);

        const tableBody = campaigns
          .filter(c => c.id === selectedCampaign)
          .map(c => [
            c.name,
            c.platform,
            c.status,
            `$${(c.budget * 30).toLocaleString()}`, // Mock total spend based on daily budget
            `${(Math.random() * 10 + 2).toFixed(1)}x` // Mock ROAS
          ]);

        doc.autoTable({
          startY: 45,
          head: [['Campaign Name', 'Platform', 'Status', 'Total Spend (Est)', 'ROAS']],
          body: tableBody,
          theme: 'striped',
          headStyles: { fillColor: [15, 23, 42] },
          styles: { font: 'helvetica' },
        });
      }

      // PAGE 4 - AI RECOMMENDATIONS
      if (sections.aiRecommendations) {
        doc.addPage();
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('AI Optimization Recommendations', 20, 30);

        let startY = 45;
        state.insights.recommendations.forEach((rec, i) => {
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(15, 23, 42);
          doc.text(`${i + 1}. ${rec.title}`, 20, startY);
          
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(71, 85, 105);
          doc.text(rec.body, 20, startY + 8, { maxWidth: pageWidth - 40 });
          
          doc.setTextColor(255, 45, 32);
          doc.text(`Expected Impact: ${rec.impact}`, 20, startY + 22);

          startY += 35;
        });
      }

      // Save PDF
      const fileName = `${reportTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.pdf`;
      doc.save(fileName);

      // Update State
      dispatch({ 
        type: 'ADD_REPORT_HISTORY', 
        payload: {
          id: Date.now(),
          name: reportTitle,
          type: reportType,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          campaigns: campaignName
        }
      });
      
      dispatch({ type: 'SET_GENERATING', payload: false });
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left pb-10">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-bold text-[#0F172A] font-mona leading-tight">Reports & Analytics Export</h2>
        <p className="text-xs font-semibold text-[#94A3B8] mt-0.5 max-w-2xl">
          Generate comprehensive PDF reports containing campaign performance, cross-platform metrics, and AI recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN - BUILDER */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#0F172A] font-mona mb-5">Configure Report</h3>

            {/* Row 1 - Report Type */}
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Report Type</label>
              <div className="flex flex-wrap gap-2">
                {['Performance Summary', 'Campaign Breakdown', 'AI Insights Report', 'Full Analytics Export'].map(type => (
                  <button
                    key={type}
                    onClick={() => setReportType(type)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      reportType === type
                        ? 'bg-[#FFF1F0] border-[#FF2D20]/30 text-[#FF2D20]'
                        : 'bg-white border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2 - Campaign Selection */}
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Campaign to Include</label>
              <select 
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(Number(e.target.value))}
                className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#FF2D20] bg-white cursor-pointer"
              >
                {campaigns.length === 0 ? (
                  <option disabled value="">No active campaigns available</option>
                ) : (
                  campaigns.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.platform})</option>
                  ))
                )}
              </select>
            </div>

            {/* Row 4 - Sections */}
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Sections to Include</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'executiveSummary', label: 'Executive Summary' },
                  { id: 'kpiOverview', label: 'KPI Overview' },
                  { id: 'campaignPerformance', label: 'Campaign Performance Table' },
                  { id: 'aiRecommendations', label: 'AI Recommendations' }
                ].map(sec => (
                  <label key={sec.id} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${sections[sec.id] ? 'bg-slate-700 border-slate-700' : 'bg-white border-[#CBD5E1] group-hover:border-[#94A3B8]'}`}>
                      {sections[sec.id] && <CheckCircleIconSolid className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-xs font-semibold text-[#475569]">{sec.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Row 5 - Branding */}
            <div className="mb-8 border-t border-[#E2E8F0] pt-6">
              <label className="block text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Report Title</label>
              <input 
                type="text" 
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#FF2D20] bg-white"
              />
            </div>

            <button
              onClick={handleGeneratePDF}
              disabled={isGenerating || !selectedCampaign}
              className="w-full bg-[#FF2D20] hover:bg-[#E5261A] disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-bold py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Compiling PDF Report...
                </>
              ) : (
                "Generate & Download Report"
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Scheduled Delivery */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A] font-mona">Scheduled Delivery</h3>
                <p className="text-[11px] font-semibold text-[#94A3B8] mt-0.5">Automate reports via email.</p>
              </div>
              <button 
                onClick={() => setScheduledEnabled(!scheduledEnabled)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${scheduledEnabled ? 'bg-[#FF2D20]' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${scheduledEnabled ? 'translate-x-4' : 'translate-x-1'}`} />
              </button>
            </div>

            {scheduledEnabled && (
              <div className="space-y-4 animate-fadeIn border-t border-[#E2E8F0] pt-4 mt-2">
                <div>
                  <label className="block text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">Frequency</label>
                  <select 
                    value={scheduleFreq}
                    onChange={(e) => setScheduleFreq(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#475569] bg-white focus:outline-none focus:border-[#FF2D20]"
                  >
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">Recipient Emails</label>
                  <input type="text" defaultValue="marketing@marketmind.ai" className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#475569] bg-white focus:outline-none focus:border-[#FF2D20]" />
                </div>
                <button className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer">
                  Save Schedule
                </button>
              </div>
            )}
          </div>


        </div>
      </div>
    </motion.div>
  );
}
