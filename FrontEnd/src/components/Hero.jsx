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

export default function Hero({ onGetStarted }) {
  const [heroRef, heroInView] = useScrollAnimation()
  
  // Animate numeric statistics when in viewport
  const roasCount = useCounter(247, heroInView)
  const setupCount = useCounter(70, heroInView)
  const costCount = useCounter(38, heroInView)

  return (
    <section id="hero" className="relative min-h-screen pt-24 pb-20 flex flex-col justify-center overflow-hidden">
      {/* Background Dot-Grid with Fade overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-80"
        style={{
          backgroundImage: "radial-gradient(circle, #CBD5E1 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white pointer-events-none z-0" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side Content */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Announcement Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF1F0] border border-[#FECACA] text-[#FF2D20] text-[13px] font-semibold uppercase tracking-wider mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#FF2D20] animate-pulse" />
            Gemini Powered · Now in Public Beta
          </motion.div>

          {/* Hero H1 */}
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-poppins font-medium text-[32px] md:text-[48px] tracking-tight text-[#0F172A] leading-[1.1] mb-6 max-w-2xl"
          >
            The AI Engine That Turns Marketing Data Into{' '}
            <span className="relative inline-block text-[#FF2D20]">
              Revenue
              <span className="absolute left-0 bottom-[-10px] w-full">
                <svg viewBox="0 0 200 20" className="text-[#FF2D20] w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 10 C 50 2, 150 2, 197 10" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
                </svg>
              </span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#475569] text-lg lg:text-xl font-normal leading-[1.65] mb-8 max-w-xl"
            style={{ fontVariationSettings: "'wdth' 100, 'wght' 400" }}
          >
            MarketMind AI unifies campaign management, real-time analytics, and AI-driven content generation so you stop guessing and start growing.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-5 w-full sm:w-auto"
          >
            <button 
              onClick={onGetStarted}
              className="bg-[#FF2D20] hover:bg-[#E5261A] text-white px-7 py-3.5 rounded-lg font-semibold text-[15px] tracking-tight flex items-center justify-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer transition-colors duration-150"
            >
              Start for Free
              <ArrowRightIcon className="w-4 h-4" />
            </button>
            <a 
              href="#dashboard"
              className="border border-[#E2E8F0] text-[#0F172A] px-7 py-3.5 rounded-lg font-semibold text-[15px] hover:border-[#CBD5E1] hover:bg-[#F8FAFC] flex items-center justify-center gap-2 cursor-pointer transition-all duration-150"
            >
              <PlayCircleIcon className="w-5 h-5 text-[#475569]" />
              Watch 2-min Demo
            </a>
          </motion.div>

          {/* Below CTAs footnote */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-[#94A3B8] font-medium"
          >
            <span className="flex items-center gap-1.5"><CheckIcon className="w-4 h-4 text-[#FF2D20]" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckIcon className="w-4 h-4 text-[#FF2D20]" /> 14-day free trial</span>
            <span className="flex items-center gap-1.5"><CheckIcon className="w-4 h-4 text-[#FF2D20]" /> Cancel anytime</span>
          </motion.div>
        </div>

        {/* Right Side Visual (Floating Analytics Card) */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-5 w-full max-w-sm"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4 border-b border-[#F1F5F9] pb-3">
              <div>
                <span className="text-[13px] font-semibold text-[#0F172A] block text-left">Campaign Performance</span>
                <span className="text-[11px] text-[#94A3B8] font-medium block text-left">May 26, 2026</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-150 text-green-700 text-[10px] font-semibold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Live
              </span>
            </div>

            {/* Spark Area Chart */}
            <div className="w-full mb-5">
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF2D20" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#FF2D20" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#FF2D20', strokeWidth: 1, strokeDasharray: '3 3' }} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Daily Revenue"
                    stroke="#FF2D20" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Micro Stats Grid */}
            <div className="grid grid-cols-3 gap-2 border-t border-[#F1F5F9] pt-4">
              <div className="text-left">
                <div className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider mb-0.5">CTR</div>
                <div className="flex items-center gap-0.5 text-sm font-extrabold text-[#0F172A]">
                  <ArrowUpIcon className="w-3.5 h-3.5 text-green-500" />
                  <span>4.2%</span>
                </div>
              </div>
              <div className="text-left">
                <div className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider mb-0.5">ROAS</div>
                <div className="flex items-center gap-0.5 text-sm font-extrabold text-[#0F172A]">
                  <ChartBarIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>7.5x</span>
                </div>
              </div>
              <div className="text-left">
                <div className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider mb-0.5">CPC</div>
                <div className="flex items-center gap-0.5 text-sm font-extrabold text-[#0F172A]">
                  <ArrowDownIcon className="w-3.5 h-3.5 text-green-500" />
                  <span>$0.84</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Prominent Stats Strip at Bottom */}
      <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-16 lg:mt-24 border-t border-[#E2E8F0] pt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {heroStats.map((stat, idx) => {
            let activeCount = 0
            if (idx === 0) activeCount = roasCount
            if (idx === 1) activeCount = setupCount
            if (idx === 2) activeCount = costCount

            return (
              <div key={idx} className="flex items-center gap-4 text-left p-2">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-slate-50 border border-[#E2E8F0] ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-2xl lg:text-3xl font-extrabold text-[#0F172A] tracking-tight font-mona">
                    {stat.prefix}{activeCount}{stat.suffix}
                  </span>
                  <span className="block text-sm text-[#475569] font-semibold">{stat.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
