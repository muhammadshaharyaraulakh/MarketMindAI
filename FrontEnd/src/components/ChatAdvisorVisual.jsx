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

export default function ChatAdvisorVisual({ inView }) {
  const [displayedText, setDisplayedText] = useState('')
  const full = "Root cause analysis complete: 3 factors identified. (1) Ad creative fatigue: same ad shown 11+ times to 68% of your audience. (2) iOS 18 privacy update reduced lookalike accuracy by ~22%. (3) Your CTA 'Learn More' underperforms vs 'Shop Now' by 41% in your product category. Priority fix: refresh creatives + switch CTA. Est. recovery: +28% CTR within 72 hours."

  useEffect(() => {
    if (!inView) {
      setDisplayedText('')
      return
    }
    let i = 0
    const timer = setInterval(() => {
      setDisplayedText(full.slice(0, i))
      i += 2 // Type slightly faster for better UX
      if (i > full.length) {
        setDisplayedText(full)
        clearInterval(timer)
      }
    }, 12)
    return () => clearInterval(timer)
  }, [inView])

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm w-full max-w-sm mx-auto text-left">
      <div className="flex items-center justify-between border-b pb-3 mb-4">
        <div className="flex items-center gap-2">
          <ChatBubbleLeftRightIcon className="w-5 h-5 text-[#FF2D20]" />
          <span className="font-semibold text-sm text-[#0F172A]">MarketMind AI Advisor</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-green-600 font-semibold">Online</span>
        </div>
      </div>
      
      <div className="space-y-4 mb-4 min-h-[290px] flex flex-col justify-end">
        {/* User Message */}
        <div className="flex justify-end">
          <div className="bg-[#FF2D20] text-white rounded-2xl rounded-br-none p-3.5 text-[13px] font-semibold max-w-[85%] shadow-sm leading-relaxed">
            Why did my Facebook campaign CTR drop 34% last Thursday?
          </div>
        </div>
        
        {/* AI Message */}
        <div className="flex justify-start">
          <div className="bg-[#F1F5F9] text-[#0F172A] rounded-2xl rounded-bl-none p-4 text-[13px] font-medium max-w-[95%] leading-relaxed min-h-[60px] shadow-sm">
            {displayedText}
            {displayedText.length < full.length && (
              <span className="inline-block w-1.5 h-4 ml-1 bg-[#FF2D20] animate-pulse" />
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm text-[#94A3B8] flex items-center justify-between cursor-text">
        <span className="font-semibold text-xs">Ask about your campaigns</span>
        <SparklesIcon className="w-4 h-4 text-[#FF2D20]" />
      </div>
    </div>
  )
}
