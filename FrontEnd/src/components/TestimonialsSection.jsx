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

export default function TestimonialsSection() {
  const [ref, inView] = useScrollAnimation()

  return (
    <section id="testimonials" ref={ref} className="bg-white py-24 border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SectionLabel text="TESTIMONIALS" color="purple" />
          <motion.h2 
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="text-[28px] md:text-[38px] font-semibold text-[#0F172A] tracking-tight leading-tight mb-4 font-mona"
            style={{ fontVariationSettings: "'wdth' 100, 'wght' 550" }}
          >
            Marketers Who Switched <span className="text-[#FF2D20]">Never Looked Back</span>
          </motion.h2>

        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((test, idx) => (
            <motion.div 
              key={idx}
              variants={scaleIn}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-8 flex flex-col justify-between text-left hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:border-[#CBD5E1] transition-all duration-200 relative overflow-hidden"
            >
              {/* Giant decorative quotation mark */}
              <span className="absolute top-2 right-4 text-8xl text-slate-100 font-black select-none pointer-events-none font-serif leading-none opacity-60">
                “
              </span>

              <div className="relative z-10">
                {/* Micro stars */}
                <div className="flex gap-0.5 mb-5">
                  {[...Array(test.stars)].map((_, sIdx) => (
                    <StarIcon key={sIdx} className="w-4 h-4 text-amber-400" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-[#374151] text-[15px] font-medium leading-[1.7] mb-8">
                  {test.quote}
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3.5 border-t border-[#F1F5F9] pt-5 w-full">
                <img 
                  src={test.avatar} 
                  alt={test.name} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#E2E8F0] flex-shrink-0"
                />
                <div>
                  <span className="block font-bold text-[#0F172A] text-sm font-mona">{test.name}</span>
                  <span className="block text-xs text-[#94A3B8] font-bold">{test.role} · {test.company}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
