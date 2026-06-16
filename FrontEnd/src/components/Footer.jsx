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

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] border-t border-[#1E293B] pt-16 pb-8 relative z-10 text-left">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1: Brand (4 cols span) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <span className="font-mona">
              <span className="font-bold text-white text-xl tracking-tight">MarketMind</span>
              <span className="text-[#FF2D20] font-extrabold text-xl ml-0.5">AI</span>
            </span>
            <p className="text-[#64748B] text-sm leading-relaxed mt-3 mb-6 max-w-xs font-semibold">
              Intelligence Digital Marketing & Analytics Engine
            </p>
            
            {/* Socials Row */}
            <div className="flex items-center gap-3">
              {/* Twitter */}
              <a href="#" aria-label="Twitter X" className="w-9 h-9 rounded-lg bg-[#1E293B] hover:bg-[#334155] flex items-center justify-center text-[#64748B] hover:text-white transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-lg bg-[#1E293B] hover:bg-[#334155] flex items-center justify-center text-[#64748B] hover:text-white transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-lg bg-[#1E293B] hover:bg-[#334155] flex items-center justify-center text-[#64748B] hover:text-white transition-all">
                <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Product (2 cols span) */}
          <div className="lg:col-span-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-5">Product Matrix</h4>
            <div className="space-y-3">
              <a href="#features" className="text-[#64748B] hover:text-white block text-sm font-semibold transition-colors cursor-pointer">Core Features</a>
              <a href="#dashboard" className="text-[#64748B] hover:text-white block text-sm font-semibold transition-colors cursor-pointer">Attributed Analytics</a>
              <a href="#pricing" className="text-[#64748B] hover:text-white block text-sm font-semibold transition-colors cursor-pointer">Pricing Matrix</a>
              <a href="#testimonials" className="text-[#64748B] hover:text-white block text-sm font-semibold transition-colors cursor-pointer">Client Reviews</a>
              <a href="#" className="text-[#64748B] hover:text-white block text-sm font-semibold transition-colors cursor-pointer">API Integration</a>
              <a href="#" className="text-[#64748B] hover:text-white block text-sm font-semibold transition-colors cursor-pointer">Operational Status</a>
            </div>
          </div>

          {/* Col 3: Company (2 cols span) */}
          <div className="lg:col-span-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-5">Company Hub</h4>
            <div className="space-y-3">
              <a href="#" className="text-[#64748B] hover:text-white block text-sm font-semibold transition-colors cursor-pointer">About Mission</a>
              <a href="#" className="text-[#64748B] hover:text-white block text-sm font-semibold transition-colors cursor-pointer">Operations Blog</a>
              <a href="#" className="text-[#64748B] hover:text-white block text-sm font-semibold transition-colors cursor-pointer flex items-center">
                Careers Hub
                <span className="ml-2 bg-green-500/10 text-green-400 text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Hiring
                </span>
              </a>
              <a href="#" className="text-[#64748B] hover:text-white block text-sm font-semibold transition-colors cursor-pointer">Press Assets</a>
              <a href="#" className="text-[#64748B] hover:text-white block text-sm font-semibold transition-colors cursor-pointer">Strategic Partners</a>
              <a href="#" className="text-[#64748B] hover:text-white block text-sm font-semibold transition-colors cursor-pointer">Contact Desk</a>
            </div>
          </div>

          {/* Col 4: Newsletter (4 cols span) */}
          <div className="lg:col-span-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-5">Stay in the Loop</h4>
            <p className="text-[#64748B] text-sm leading-relaxed mb-4 font-semibold">
              Weekly hand-curated analytics and AI growth trends.
            </p>
            <div className="flex flex-col gap-2">
              <input 
                type="text" 
                placeholder="your@email.com" 
                className="bg-[#1E293B] border border-[#334155] focus:border-[#FF2D20] focus:outline-none rounded-lg text-white placeholder-[#475569] px-4 py-2.5 text-sm w-full font-medium"
              />
              <button className="bg-[#FF2D20] hover:bg-[#E5261A] text-white py-2.5 rounded-lg font-bold text-sm tracking-tight transition-colors cursor-pointer w-full">
                Subscribe Weekly
              </button>
            </div>
            <p className="text-[#475569] text-[11px] font-semibold mt-2.5 block text-left">
              No spam. Zero fluff. Unsubscribe with one click.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1E293B] mt-16 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[#475569] text-xs font-semibold">
            © 2026 MarketMind AI. Final Year Project. All rights reserved.
          </span>
          <div className="flex items-center gap-4 text-xs font-semibold text-[#475569]">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <span>·</span>
            <a href="#" className="hover:text-slate-300 transition-colors">Cookie Matrix</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
