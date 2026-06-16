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

export default function LogoStrip() {
  const logos = ["Shopify", "HubSpot", "Notion", "Stripe", "Figma", "Vercel", "Webflow", "Linear", "Intercom", "Segment"]
  const doubleLogos = [...logos, ...logos]

  return (
    <section className="bg-[#F8FAFC] border-y border-[#E2E8F0] py-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-[11px] font-bold tracking-[1.8px] text-[#94A3B8] uppercase text-center mb-6">
          TRUSTED BY MARKETING TEAMS AT
        </h3>

        {/* Sliding Marquee Track */}
        <div 
          className="relative overflow-hidden flex w-full"
          style={{
            maskImage: "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)"
          }}
        >
          <div className="flex gap-20 pr-20 marquee-track whitespace-nowrap">
            {doubleLogos.map((logo, idx) => (
              <span 
                key={idx} 
                className="text-xl font-extrabold text-[#94A3B8] hover:text-[#475569] tracking-tight select-none cursor-pointer transition-colors duration-150 font-mona"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
