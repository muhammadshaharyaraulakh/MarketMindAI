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

export default function CTASection({ onGetStarted }) {
  const [ref, inView] = useScrollAnimation()

  const avatars = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face'
  ]

  return (
    <section ref={ref} className="bg-[#0F172A] relative py-32 overflow-hidden border-b border-[#1E293B]">
      {/* Background dot grid inverted */}
      <div 
        className="absolute inset-0 z-0 opacity-15"
        style={{
          backgroundImage: "radial-gradient(circle, #334155 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0F172A] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Avatars Overlay Stack */}
        <div className="flex items-center justify-center -space-x-2.5 mb-6">
          {avatars.map((url, idx) => (
            <img 
              key={idx}
              src={url} 
              alt="Team Avatar" 
              className="w-9 h-9 rounded-full object-cover border-2 border-[#0F172A]"
            />
          ))}
          <div className="bg-[#1E293B] border-2 border-[#0F172A] text-white text-[11px] font-extrabold px-2.5 py-2 rounded-full leading-none">
            +2.4k
          </div>
        </div>

        {/* Small badge */}
        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[2px] mb-4">
          JOIN OVER 2,400+ MODERN TEAMS USING MARKETMIND
        </p>

        {/* Title */}
        <motion.h2 
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-[28px] md:text-[38px] font-semibold text-white tracking-tight leading-tight max-w-3xl mx-auto mb-5 font-mona"
          style={{ fontVariationSettings: "'wdth' 100, 'wght' 550" }}
        >
          Ready to Make Every <span className="text-[#FF2D20]">Marketing Dollar Count?</span>
        </motion.h2>

        {/* Subtext */}
        <motion.p 
          variants={fadeIn}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-[#94A3B8] text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-semibold"
        >
          Join over 2,400+ scaling teams who stopped guessing and started growing. Start your 14-day free trial, no credit card required.
        </motion.p>

        <motion.div 
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        >
          <button 
            onClick={onGetStarted}
            className="bg-[#FF2D20] hover:bg-[#E5261A] text-white px-8 py-4 text-[16px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-2 shadow-md w-full sm:w-auto justify-center"
          >
            <RocketLaunchIcon className="w-5 h-5" />
            Start Free Trial
          </button>
          <button 
            className="border border-[#334155] hover:border-[#475569] hover:bg-[#1E293B] text-white px-8 py-4 rounded-lg font-bold text-[16px] transition-all cursor-pointer w-full sm:w-auto justify-center"
          >
            Talk to Our Team
          </button>
        </motion.div>

        {/* Small Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-bold text-[#94A3B8]">
          <span className="flex items-center gap-1.5">
            <CheckIcon className="w-4 h-4 text-green-400" />
            No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckIcon className="w-4 h-4 text-green-400" />
            Setup in under 5 minutes
          </span>
          <span className="flex items-center gap-1.5">
            <CheckIcon className="w-4 h-4 text-green-400" />
            Cancel anytime, no questions asked
          </span>
        </div>
      </div>
    </section>
  )
}
