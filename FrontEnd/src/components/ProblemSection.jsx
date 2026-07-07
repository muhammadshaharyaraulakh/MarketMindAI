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

export default function ProblemSection() {
  const [ref, inView] = useScrollAnimation()

  return (
    <section ref={ref} className="bg-white py-24 border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SectionLabel text="THE PROBLEM" color="red" />
          <motion.h2 
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="text-[28px] md:text-[38px] font-semibold text-[#0F172A] tracking-tight leading-tight mb-4 font-mona"
            style={{ fontVariationSettings: "'wdth' 100, 'wght' 550" }}
          >
            Why Do 80% of Marketing Campaigns <span className="text-[#FF2D20]">Underperform?</span>
          </motion.h2>
          <motion.p 
            variants={fadeIn}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="text-[#475569] text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
          >
            Most teams are flying blind using fragmented tools, analyzing delayed data, and operating without an AI context layer to connect performance data to creative output.
          </motion.p>
        </div>

        {/* Separator Line */}
        <div className="w-16 h-1 bg-[#FF2D20]/20 mx-auto mb-16 rounded-full" />

        {/* Problem Cards Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Card 1 */}
          <motion.div 
            variants={scaleIn}
            className="bg-white border border-[#E2E8F0] rounded-2xl p-8 flex flex-col items-start text-left hover:border-[#CBD5E1] shadow-[0_1px_3px_rgba(0,0,0,0.06),_0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_6px_rgba(0,0,0,0.07),_0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-200"
          >
            <IconBox icon={XCircleIcon} color="bg-red-50 text-red-500" />
            <h3 className="text-xl font-bold text-[#0F172A] mt-6 mb-3 tracking-tight font-mona">No Real Time Visibility</h3>
            <p className="text-[#475569] text-[15px] leading-relaxed mb-6 flex-grow">
              You discover campaign failure only after the weekly budget is spent. By then, the damage is done, and the advertising capital is gone forever.
            </p>
            <div className="text-[13px] border-t border-[#F1F5F9] pt-4 w-full text-left font-semibold">
              <span className="text-[#FF2D20] font-extrabold">73% of marketers</span>
              <span className="text-[#94A3B8] font-normal"> say they lack real-time campaign budget visibility.</span>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            variants={scaleIn}
            className="bg-white border border-[#E2E8F0] rounded-2xl p-8 flex flex-col items-start text-left hover:border-[#CBD5E1] shadow-[0_1px_3px_rgba(0,0,0,0.06),_0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_6px_rgba(0,0,0,0.07),_0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-200"
          >
            <IconBox icon={DocumentTextIcon} color="bg-amber-50 text-amber-500" />
            <h3 className="text-xl font-bold text-[#0F172A] mt-6 mb-3 tracking-tight font-mona">Content Fatigue</h3>
            <p className="text-[#475569] text-[15px] leading-relaxed mb-6 flex-grow">
              Generic copy written for the wrong audience, on the wrong platform, at the wrong buying stage. Producing sheer volume without contextual precision.
            </p>
            <div className="text-[13px] border-t border-[#F1F5F9] pt-4 w-full text-left font-semibold">
              <span className="text-green-600 font-extrabold">2.3x higher CTR</span>
              <span className="text-[#94A3B8] font-normal"> recorded for dynamic, AI-context-optimized ad copies.</span>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            variants={scaleIn}
            className="bg-white border border-[#E2E8F0] rounded-2xl p-8 flex flex-col items-start text-left hover:border-[#CBD5E1] shadow-[0_1px_3px_rgba(0,0,0,0.06),_0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_6px_rgba(0,0,0,0.07),_0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-200"
          >
            <IconBox icon={CircleStackIcon} color="bg-blue-50 text-blue-500" />
            <h3 className="text-xl font-bold text-[#0F172A] mt-6 mb-3 tracking-tight font-mona">Siloed Marketing Tools</h3>
            <p className="text-[#475569] text-[15px] leading-relaxed mb-6 flex-grow">
              Your conversion tracking lives in one place, ads manager in another, and copywriters have zero access to performance results. There is no feedback loop.
            </p>
            <div className="text-[13px] border-t border-[#F1F5F9] pt-4 w-full text-left font-semibold">
              <span className="text-blue-600 font-extrabold">11 separate tools</span>
              <span className="text-[#94A3B8] font-normal"> are used on average by marketing departments in 2025.</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
