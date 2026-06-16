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

export default function DashboardSection() {
  const [ref, inView] = useScrollAnimation()

  return (
    <section id="dashboard" ref={ref} className="bg-[#F8FAFC] py-24 border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SectionLabel text="Live Dashboard Preview" color="blue" />
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="text-[28px] md:text-[38px] font-semibold text-[#0F172A] tracking-tight leading-tight mb-4 font-mona"
            style={{ fontVariationSettings: "'wdth' 100, 'wght' 550" }}
          >
            A Dashboard Built for <span className="text-[#FF2D20]">Real Decisions</span>
          </motion.h2>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="text-[#475569] text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-medium"
          >
            Not vanity metrics. Not confusing data dumps. Clear actionable KPIs, live compositions, and unified ad spend attribution, all in one view.
          </motion.p>
        </div>

        {/* Dashboard Mockup Card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden w-full"
        >
          {/* Top macOS Bar */}
          <div className="bg-[#0F172A] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
              <span className="text-white/40 text-[12px] font-bold tracking-wide ml-4 font-mona">MarketMind AI (Enterprise Analytics)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-bold uppercase tracking-wider">● Live Connection</span>
            </div>
          </div>

          {/* Dashboard Body */}
          <div className="p-6 bg-white">
            {/* Row 1 - 4 KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] shadow-sm text-left">
                <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">Total Ad Spend</span>
                <span className="text-2xl font-extrabold text-[#0F172A] font-mona block mb-1">$24,840</span>
                <span className="text-red-500 text-xs font-bold flex items-center gap-0.5">
                  <ArrowDownIcon className="w-3.5 h-3.5" />
                  ↓ 8.2% vs last month
                </span>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] shadow-sm text-left">
                <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">Attributed Revenue</span>
                <span className="text-2xl font-extrabold text-[#0F172A] font-mona block mb-1">$187,200</span>
                <span className="text-green-600 text-xs font-bold flex items-center gap-0.5">
                  <ArrowUpIcon className="w-3.5 h-3.5" />
                  ↑ 31.4% growth
                </span>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] shadow-sm text-left">
                <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">Average ROAS</span>
                <span className="text-2xl font-extrabold text-[#0F172A] font-mona block mb-1">7.53x</span>
                <span className="text-green-600 text-xs font-bold flex items-center gap-0.5">
                  <ArrowUpIcon className="w-3.5 h-3.5" />
                  ↑ 0.8x efficiency
                </span>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] shadow-sm text-left">
                <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1">Active Campaigns</span>
                <span className="text-2xl font-extrabold text-[#0F172A] font-mona block mb-1">14 Running</span>
                <span className="text-[#94A3B8] text-xs font-bold block mt-1">3 paused · 2 optimizing</span>
              </div>
            </div>

            {/* Row 2 - Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
              {/* Left Composed Chart */}
              <div className="lg:col-span-3 border border-[#E2E8F0] rounded-xl p-5 text-left bg-white shadow-sm flex flex-col justify-between">
                <div className="mb-4">
                  <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider block">Campaign Performance</span>
                  <span className="text-sm font-bold text-[#0F172A] block font-mona">Revenue vs Ad Spend (Last 30 Days)</span>
                </div>
                <div className="w-full">
                  <ResponsiveContainer width="100%" height={260}>
                    <ComposedChart data={trendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(tick, idx) => idx % 5 === 0 ? tick : ''} />
                      <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="spend" name="Ad Spend" fill="#EFF6FF" stroke="#3B82F6" strokeWidth={1} radius={[2, 2, 0, 0]} />
                      <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#FF2D20" strokeWidth={2} dot={false} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right Donut Chart */}
              <div className="lg:col-span-2 border border-[#E2E8F0] rounded-xl p-5 text-left bg-white shadow-sm relative flex flex-col justify-between">
                <div className="mb-2">
                  <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider block">Traffic Source Attribution</span>
                  <span className="text-sm font-bold text-[#0F172A] block font-mona">Attributed Sales Channels</span>
                </div>

                <div className="relative w-full h-[230px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={trafficData}
                        cx="50%"
                        cy="42%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {trafficData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Absolute Centered Text */}
                  <div className="absolute top-[37%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <span className="text-2xl font-extrabold text-[#0F172A] tracking-tight block font-mona">100%</span>
                    <span className="text-[9px] text-[#94A3B8] font-bold uppercase tracking-wider block">Attributed</span>
                  </div>

                  {/* Absolute Legends */}
                  <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-3 flex-wrap px-4">
                    {trafficData.map((entry, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] font-bold text-[#475569]">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span>{entry.name} ({entry.value}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3 - Campaign Overview Table */}
            <div className="border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm bg-white">
              <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between text-left">
                <span className="text-sm font-bold text-[#0F172A] font-mona">Campaign Overview Performance</span>
                <button className="text-[#FF2D20] text-xs font-bold inline-flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
                  View All Active
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <th className="px-5 py-3 text-xs  text-[#475569] font-bold font-mona tracking-wider">Campaign Name</th>
                      <th className="px-5 py-3 text-xs  text-[#475569] font-bold font-mona tracking-wider">Status</th>
                      <th className="px-5 py-3 text-xs  text-[#475569] font-bold font-mona tracking-wider">Budget Spent</th>
                      <th className="px-5 py-3 text-xs  text-[#475569] font-bold font-mona tracking-wider">Revenue</th>
                      <th className="px-5 py-3 text-xs  text-[#475569] font-bold font-mona tracking-wider">ROAS</th>
                      <th className="px-5 py-3 text-xs  text-[#475569] font-bold font-mona tracking-wider">CTR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((camp, idx) => {
                      const statusStyles = {
                        'Active': 'bg-green-50 text-green-700 border-green-200',
                        'Paused': 'bg-amber-50 text-amber-700 border-amber-200',
                        'Optimizing': 'bg-blue-50 text-blue-700 border-blue-200'
                      }
                      return (
                        <tr key={idx} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors">
                          <td className="px-5 py-3.5 text-xs font-bold text-[#0F172A] font-mona">{camp.name}</td>
                          <td className="px-5 py-3.5">
                            <span className={`px-2 py-0.5 text-[10px] rounded border capitalize tracking-wider ${statusStyles[camp.status]}`}>
                              {camp.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-xs font-medium text-[#475569]">{camp.spend}</td>
                          <td className="px-5 py-3.5 text-xs  text-[#0F172A]">{camp.revenue}</td>
                          <td className="px-5 py-3.5 text-xs font-bold text-green-600">{camp.roas}</td>
                          <td className="px-5 py-3.5 text-xs font-medium text-[#475569]">{camp.ctr}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Export Analytics Callout */}
        <div className="mt-8 text-center flex flex-col items-center">
          <button className="border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-white bg-[#F8FAFC] text-[#0F172A] px-6 py-2.5 rounded-lg font-bold text-[14px] inline-flex items-center gap-2 cursor-pointer transition-all duration-150 shadow-sm">
            <DocumentArrowDownIcon className="w-4 h-4 text-[#475569]" />
            Export Live Analytics Report
          </button>
          <div className="flex items-center gap-3 text-xs font-semibold text-[#94A3B8] mt-3">
            <span>PDF Summary Report</span>
            <span>·</span>
            <span>CSV Clean Raw Data</span>
            <span>·</span>
            <span>Excel Workbook Sheets</span>
          </div>
        </div>
      </div>
    </section>
  )
}
