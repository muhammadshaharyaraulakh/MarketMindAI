import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  Line,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import {
  ChartBarIcon,
  BoltIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon,
  CursorArrowRaysIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  BellAlertIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  PlayCircleIcon,
  LockClosedIcon,
  KeyIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  PresentationChartLineIcon,
  MagnifyingGlassIcon,
  LightBulbIcon,
  FunnelIcon,
  CircleStackIcon,
  BuildingOffice2Icon,
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  DocumentTextIcon,
  CameraIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid,
  StarIcon,
  ShieldCheckIcon as ShieldCheckIconSolid,
  BoltIcon as BoltIconSolid,
  EyeSlashIcon
} from '@heroicons/react/24/solid';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CheckIcon,
  PlusIcon
} from '@heroicons/react/20/solid';

import {
  revenueData, trendData, trafficData, campaigns, heroStats, plans, testimonials, faqs, fadeUp, fadeIn, scaleIn, staggerContainer, float, useScrollAnimation, useCounter, CustomTooltip, SectionLabel, IconBox, FeatureCheck
} from './shared';
import ChatAdvisorVisual from './ChatAdvisorVisual';

// Feature Block 1 Visual (Grouped Bar Chart)
const campaignPerformanceData = [
  { week: 'Wk 1', Clicks: 2400, Conversions: 680 },
  { week: 'Wk 2', Clicks: 3200, Conversions: 920 },
  { week: 'Wk 3', Clicks: 4500, Conversions: 1400 },
  { week: 'Wk 4', Clicks: 3900, Conversions: 1250 },
  { week: 'Wk 5', Clicks: 5400, Conversions: 1850 },
]

function CampaignVisual() {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm w-full">
      <div className="flex items-center justify-between border-b pb-3 mb-4 text-left">
        <div>
          <span className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider">Dashboard View</span>
          <span className="text-sm font-semibold text-[#0F172A] block">Clicks vs Conversions</span>
        </div>
        <span className="text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-md font-bold">Auto-Optimized</span>
      </div>
      <div className="w-full">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={campaignPerformanceData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="week" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', fontWeight: 650 }} />
            <Bar dataKey="Clicks" fill="#3B82F6" name="Clicks" radius={[4, 4, 0, 0]} barSize={16} />
            <Bar dataKey="Conversions" fill="#FF2D20" name="Conversions" radius={[4, 4, 0, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Feature Block 2 Visual (Composed Chart)
const analyticsChartData = [
  { name: 'May 1', Spend: 120, CTR: 1.8 },
  { name: 'May 5', Spend: 240, CTR: 2.2 },
  { name: 'May 10', Spend: 310, CTR: 2.5 },
  { name: 'May 12', Spend: 450, CTR: 3.8 },
  { name: 'May 15', Spend: 520, CTR: 4.1 },
  { name: 'May 20', Spend: 480, CTR: 3.9 },
  { name: 'May 25', Spend: 600, CTR: 4.5 },
]

function AnalyticsVisual() {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm w-full">
      <div className="flex items-center justify-between border-b pb-3 mb-4 text-left">
        <div>
          <span className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider animate-pulse">● Live Engine</span>
          <span className="text-sm font-semibold text-[#0F172A] block">CTR Trends vs Spend</span>
        </div>
        <span className="text-[11px] text-[#94A3B8] font-bold">Updated 3s ago</span>
      </div>
      <div className="w-full">
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={analyticsChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', fontWeight: 650 }} />
            <Bar dataKey="Spend" name="Spend ($)" fill="#EFF6FF" stroke="#3B82F6" strokeWidth={1} radius={[4, 4, 0, 0]} barSize={26} />
            <Line type="monotone" dataKey="CTR" name="CTR (%)" stroke="#FF2D20" strokeWidth={2.5} dot={false} />
            <ReferenceLine x="May 12" stroke="#94A3B8" strokeDasharray="3 3" label={{ value: 'Ad Launch', position: 'top', fill: '#94A3B8', fontSize: 10, fontWeight: 700 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Feature Block 3 Visual (Light AI Content Generator Bubble Panel)
function ContentVisual() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm w-full text-left">
      <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3.5 mb-5">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-5 h-5 text-[#FF2D20]" />
          <span className="text-[#0F172A] font-semibold text-sm">AI Content Generator</span>
        </div>
        <span className="bg-[#F8FAFC] border border-[#E2E8F0] text-[#94A3B8] text-[10px] font-bold px-2 py-0.5 rounded tracking-wide">
          Gemini
        </span>
      </div>

      <div className="space-y-4">
        {/* Output Bubble 1 */}
        <div className="bg-[#F8FAFC] rounded-xl p-3.5 text-[13px] text-[#475569] leading-relaxed border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 font-bold text-amber-500 text-xs">
              <BoltIconSolid className="w-3.5 h-3.5" />
              Campaign Hook
            </span>
            <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full font-bold">Meta Ads</span>
          </div>
          "Stop scrolling: your store is losing $4,200 every day to campaigns that should be working."
        </div>

        {/* Output Bubble 2 */}
        <div className="bg-[#F8FAFC] rounded-xl p-3.5 text-[13px] text-[#475569] leading-relaxed border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 font-bold text-green-600 text-xs">
              <CameraIcon className="w-3.5 h-3.5" />
              Creative Caption
            </span>
            <span className="text-[10px] text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full font-bold">Instagram</span>
          </div>
          "Your product. Their problem. One powerful solution. Tap the link to see why 14,000+ customers switched."
        </div>

        {/* Output Bubble 3 */}
        <div className="bg-[#F8FAFC] rounded-xl p-3.5 text-[13px] text-[#475569] leading-relaxed border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 font-bold text-red-500 text-xs">
              <PlayCircleIcon className="w-3.5 h-3.5" />
              Video Hook Script
            </span>
            <span className="text-[10px] text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full font-bold">TikTok Ads</span>
          </div>
          "In the next 47 seconds, I'll show you the exact 3-word CTA that doubled our client's ROAS overnight."
        </div>
      </div>

      <div className="flex items-center justify-end mt-5 border-t border-[#F1F5F9] pt-3.5">
        <button className="flex items-center gap-1 text-[#94A3B8] hover:text-[#0F172A] text-xs font-semibold cursor-pointer transition-colors duration-150">
          <ArrowPathIcon className="w-3.5 h-3.5" />
          Regenerate Variations
        </button>
      </div>
    </div>
  )
}

// Main Features Section Wrapper
function FeaturesSection() {
  const [ref1, inView1] = useScrollAnimation()
  const [ref2, inView2] = useScrollAnimation()
  const [ref3, inView3] = useScrollAnimation()
  const [ref4, inView4] = useScrollAnimation()

  return (
    <section id="features" className="overflow-hidden">
      
      {/* Block 1: Campaign Management */}
      <div ref={ref1} className="bg-white py-24 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={inView1 ? "visible" : "hidden"}
            className="flex flex-col items-start text-left"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel text="Campaign Intelligence" color="red" />
            </motion.div>
            <motion.h3 
              variants={fadeUp}
              className="text-2xl md:text-3xl font-semibold text-[#0F172A] tracking-tight leading-tight mb-5 font-mona"
              style={{ fontVariationSettings: "'wdth' 100, 'wght' 550" }}
            >
              Manage Every Campaign From <span className="text-[#FF2D20]">One Command Center</span>
            </motion.h3>
            <motion.p variants={fadeIn} className="text-[#475569] text-[16px] leading-relaxed mb-6 font-medium">
              Launch, monitor, pause, and optimize campaigns across Google Ads, Meta, TikTok, and Email, all from a single dashboard. Set budget rules, automated A/B tests, and AI-powered auto-optimization triggers that act before you even wake up.
            </motion.p>
            <motion.ul variants={staggerContainer} className="space-y-3.5 mb-8">
              <FeatureCheck text="Multi-channel campaign scheduling" />
              <FeatureCheck text="AI budget auto-reallocation in real time" />
              <FeatureCheck text="A/B test automation with winner auto-selection" />
              <FeatureCheck text="Real-time performance anomaly alerts" />
              <FeatureCheck text="Drag-and-drop campaign calendar" />
            </motion.ul>
            <motion.a 
              variants={fadeUp}
              href="#pricing"
              className="text-[#FF2D20] font-bold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all duration-150 text-sm cursor-pointer group"
            >
              Explore Campaign Tools 
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.a>
          </motion.div>

          {/* Visual Side */}
          <motion.div 
            variants={scaleIn}
            initial="hidden"
            animate={inView1 ? "visible" : "hidden"}
            className="w-full flex justify-center"
          >
            <CampaignVisual />
          </motion.div>
        </div>
      </div>

      {/* Block 2: Real-Time Analytics */}
      <div ref={ref2} className="bg-[#F8FAFC] py-24 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visual Side (Left on Desktop) */}
          <motion.div 
            variants={scaleIn}
            initial="hidden"
            animate={inView2 ? "visible" : "hidden"}
            className="w-full flex justify-center lg:order-first order-last"
          >
            <AnalyticsVisual />
          </motion.div>

          {/* Text Content (Right on Desktop) */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={inView2 ? "visible" : "hidden"}
            className="flex flex-col items-start text-left"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel text="Live Analytics" color="blue" />
            </motion.div>
            <motion.h3 
              variants={fadeUp}
              className="text-2xl md:text-3xl font-semibold text-[#0F172A] tracking-tight leading-tight mb-5 font-mona"
              style={{ fontVariationSettings: "'wdth' 100, 'wght' 550" }}
            >
              Real-Time Data That Tells You <span className="text-[#FF2D20]">What to Do Next</span>
            </motion.h3>
            <motion.p variants={fadeIn} className="text-[#475569] text-[16px] leading-relaxed mb-6 font-medium">
              Dashboards refresh every 30 seconds. Track CTR, ROAS, CPC, CPM, LTV, and churn risk with AI annotations that automatically explain every performance spike and drop in plain English.
            </motion.p>
            <motion.ul variants={staggerContainer} className="space-y-3.5 mb-8">
              <FeatureCheck text="30-second dashboard data refresh" />
              <FeatureCheck text="AI anomaly detection with plain-English explanations" />
              <FeatureCheck text="Custom KPI dashboard builder (drag & drop)" />
              <FeatureCheck text="Scheduled reports to email (PDF/CSV/Excel)" />
              <FeatureCheck text="Multi-account comparison view" />
            </motion.ul>
            <motion.a 
              variants={fadeUp}
              href="#pricing"
              className="text-[#FF2D20] font-bold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all duration-150 text-sm cursor-pointer group"
            >
              Learn More About Analytics
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Block 3: AI Content Generation */}
      <div ref={ref3} className="bg-white py-24 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={inView3 ? "visible" : "hidden"}
            className="flex flex-col items-start text-left"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel text="Content Engine" color="purple" />
            </motion.div>
            <motion.h3 
              variants={fadeUp}
              className="text-2xl md:text-3xl font-semibold text-[#0F172A] tracking-tight leading-tight mb-5 font-mona"
              style={{ fontVariationSettings: "'wdth' 100, 'wght' 550" }}
            >
              Generate Ad Copy, Captions, and Video Scripts <span className="text-[#FF2D20]">in Seconds</span>
            </motion.h3>
            <motion.p variants={fadeIn} className="text-[#475569] text-[16px] leading-relaxed mb-6 font-medium">
              Powered by Gemini fine-tuned on 2M+ high-converting ad creatives. Generate platform-native content for Meta, Google, TikTok, YouTube, and Email, with each variation fully optimized for the platform's specific algorithm.
            </motion.p>
            <motion.ul variants={staggerContainer} className="space-y-3.5 mb-8">
              <FeatureCheck text="Ad copy for Meta, Google, TikTok, LinkedIn" />
              <FeatureCheck text="Product photo caption generation from uploaded images" />
              <FeatureCheck text="YouTube video hook & full script writer" />
              <FeatureCheck text="Email subject line A/B variants (50 at once)" />
              <FeatureCheck text="Brand voice profile that learns and matches your tone" />
            </motion.ul>
            <motion.a 
              variants={fadeUp}
              href="#pricing"
              className="text-[#FF2D20] font-bold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all duration-150 text-sm cursor-pointer group"
            >
              Try Creative Writer 
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.a>
          </motion.div>

          {/* Visual Side */}
          <motion.div 
            variants={scaleIn}
            initial="hidden"
            animate={inView3 ? "visible" : "hidden"}
            className="w-full flex justify-center"
          >
            <ContentVisual />
          </motion.div>
        </div>
      </div>

      {/* Block 4: AI Advisor / Why Campaigns Fail */}
      <div ref={ref4} className="bg-[#F8FAFC] py-24 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visual Side (Left on Desktop) */}
          <motion.div 
            variants={scaleIn}
            initial="hidden"
            animate={inView4 ? "visible" : "hidden"}
            className="w-full flex justify-center lg:order-first order-last"
          >
            <ChatAdvisorVisual inView={inView4} />
          </motion.div>

          {/* Text Content (Right on Desktop) */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={inView4 ? "visible" : "hidden"}
            className="flex flex-col items-start text-left"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel text="AI Advisor" color="amber" />
            </motion.div>
            <motion.h3 
              variants={fadeUp}
              className="text-2xl md:text-3xl font-semibold text-[#0F172A] tracking-tight leading-tight mb-5 font-mona"
              style={{ fontVariationSettings: "'wdth' 100, 'wght' 550" }}
            >
              Ask Your Data Anything. Get <span className="text-[#FF2D20]">Plain-English Answers.</span>
            </motion.h3>
            <motion.p variants={fadeIn} className="text-[#475569] text-[16px] leading-relaxed mb-6 font-medium">
              Most analytics tools show you what happened. MarketMind AI tells you WHY it happened and WHAT to do about it. Ask any question about your campaigns in natural language and get expert-level analysis in seconds.
            </motion.p>
            <motion.ul variants={staggerContainer} className="space-y-3.5 mb-8">
              <FeatureCheck text="Natural language campaign Q&A (no SQL, no formulas)" />
              <FeatureCheck text="Root cause failure analysis with priority scores" />
              <FeatureCheck text="Actionable fix recommendations with effort estimates" />
              <FeatureCheck text="Cross-channel insight correlation" />
              <FeatureCheck text="Weekly AI campaign health digest to your inbox" />
            </motion.ul>
            <motion.a 
              variants={fadeUp}
              href="#pricing"
              className="text-[#FF2D20] font-bold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all duration-150 text-sm cursor-pointer group"
            >
              Meet Your Advisor
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection;
