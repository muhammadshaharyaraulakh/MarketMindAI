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

export default function SecuritySection() {
  const [ref, inView] = useScrollAnimation()

  return (
    <section ref={ref} className="bg-white py-24 border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side Content */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex flex-col items-start text-left"
        >
          <motion.div variants={fadeUp}>
            <SectionLabel text="Enterprise Security" color="green" />
          </motion.div>
          <motion.h2 
            variants={fadeUp}
            className="text-[28px] md:text-[38px] font-semibold text-[#0F172A] tracking-tight leading-tight mb-5 font-mona"
            style={{ fontVariationSettings: "'wdth' 100, 'wght' 550" }}
          >
            Bank-Grade Security for <span className="text-[#FF2D20]">Your Marketing Data</span>
          </motion.h2>
          <motion.p variants={fadeIn} className="text-[#475569] text-base md:text-lg leading-relaxed mb-8 font-medium">
            Two-factor authentication, Single Sign-On (SSO), role-based permissions, and end-to-end data encryption. Every byte of your campaign information is protected by the same infrastructure used by global financial platforms.
          </motion.p>

          {/* Security Features List */}
          <motion.div variants={staggerContainer} className="space-y-6 w-full">
            {/* Item 1 */}
            <div className="flex gap-4 items-start text-left">
              <IconBox icon={LockClosedIcon} color="bg-green-50 text-green-600" />
              <div>
                <h4 className="text-base font-bold text-[#0F172A] tracking-tight font-mona">Two-Factor Authentication</h4>
                <p className="text-sm text-[#475569] leading-relaxed mt-0.5">
                  TOTP app integration (Google Authenticator, Authy) and emergency SMS recovery backups. Mandatory for Pro & Enterprise accounts.
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex gap-4 items-start text-left">
              <IconBox icon={KeyIcon} color="bg-blue-50 text-blue-600" />
              <div>
                <h4 className="text-base font-bold text-[#0F172A] tracking-tight font-mona">Single Sign-On (SSO)</h4>
                <p className="text-sm text-[#475569] leading-relaxed mt-0.5">
                  Seamless login using Google Workspace, Okta, and Microsoft Azure Active Directory, fully supported on Enterprise accounts.
                </p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex gap-4 items-start text-left">
              <IconBox icon={UserGroupIcon} color="bg-purple-50 text-purple-600" />
              <div>
                <h4 className="text-base font-bold text-[#0F172A] tracking-tight font-mona">Role-Based Access Control (RBAC)</h4>
                <p className="text-sm text-[#475569] leading-relaxed mt-0.5">
                  Admin, Campaign Manager, Financial Analyst, and Viewer permissions. Restrict access and export controls at team levels.
                </p>
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex gap-4 items-start text-left">
              <IconBox icon={ShieldCheckIconSolid} color="bg-amber-50 text-amber-600" />
              <div>
                <h4 className="text-base font-bold text-[#0F172A] tracking-tight font-mona">AES-256 + TLS 1.3 Encryption</h4>
                <p className="text-sm text-[#475569] leading-relaxed mt-0.5">
                  Your data is encrypted at rest using AES-256 and in transit utilizing TLS 1.3 protocols. Fully SOC 2 Type II and GDPR compliant.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Certifications row */}
          <motion.div 
            variants={fadeIn} 
            className="flex flex-wrap items-center gap-3 mt-10 border-t border-[#F1F5F9] pt-6 w-full text-xs font-bold text-[#475569]"
          >
            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-[#E2E8F0] rounded-full uppercase tracking-wider">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-green-600" />
              SOC 2 Type II
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-[#E2E8F0] rounded-full uppercase tracking-wider">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-green-600" />
              GDPR Compliant
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-[#E2E8F0] rounded-full uppercase tracking-wider">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-green-600" />
              ISO 27001
            </span>
          </motion.div>
        </motion.div>

        {/* Right Side Card Mockup (2FA Secure Login Card) */}
        <motion.div 
          variants={scaleIn}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="w-full flex justify-center"
        >
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-[0_8px_40px_rgba(0,0,0,0.10)] w-full max-w-sm text-left">
            {/* Logo */}
            <div className="text-center mb-5">
              <span className="font-mona">
                <span className="font-bold text-[#0F172A] text-xl tracking-tight">MarketMind</span>
                <span className="text-[#FF2D20] font-extrabold text-xl ml-0.5">AI</span>
              </span>
              <p className="text-xs text-[#94A3B8] font-semibold mt-1">Sign in to your account</p>
            </div>

            {/* Simulated Form Fields */}
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">Work Email</label>
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 text-sm text-[#0F172A] font-semibold flex items-center justify-between">
                  <span>sarah@techflow.co</span>
                  <EnvelopeIcon className="w-4 h-4 text-[#94A3B8]" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1.5">Password</label>
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 text-sm text-[#0F172A] flex items-center justify-between select-none">
                  <span className="tracking-widest font-mono">••••••••••••</span>
                  <EyeSlashIcon className="w-4 h-4 text-[#94A3B8]" />
                </div>
              </div>

              {/* Red CTA Continue button */}
              <button className="w-full bg-[#FF2D20] hover:bg-[#E5261A] text-white py-3 rounded-lg font-bold text-[14px] flex items-center justify-center gap-1 shadow-sm cursor-pointer transition-colors mt-2">
                Continue with Email
                <ArrowRightIcon className="w-4 h-4" />
              </button>

              {/* Divider */}
              <div className="flex items-center justify-center gap-2.5 my-4">
                <span className="h-[1px] bg-[#E2E8F0] flex-grow" />
                <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">or sign in with</span>
                <span className="h-[1px] bg-[#E2E8F0] flex-grow" />
              </div>

              {/* Google SSO Button */}
              <button className="w-full bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] text-[#374151] py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer transition-all">
                <svg className="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  <path fill="none" d="M0 0h48v48H0z"/>
                </svg>
                Continue with Google
              </button>

              {/* Secure Active Alert indicator */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4 flex items-center gap-2">
                <ShieldCheckIconSolid className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-green-700 text-xs font-bold flex items-center gap-1">
                  Two-Factor Authentication Enabled <CheckIcon className="w-3.5 h-3.5 text-green-700" />
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
