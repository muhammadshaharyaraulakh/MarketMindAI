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

export default function PricingSection({ onSelectPlan }) {
  const [ref, inView] = useScrollAnimation()
  const [billing, setBilling] = useState('monthly')

  return (
    <section id="pricing" ref={ref} className="bg-[#F8FAFC] py-24 border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <SectionLabel text="PLANS & PRICING" color="red" />
          <motion.h2 
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="text-[28px] md:text-[38px] font-semibold text-[#0F172A] tracking-tight leading-tight mb-4 font-mona"
            style={{ fontVariationSettings: "'wdth' 100, 'wght' 550" }}
          >
            Simple, <span className="text-[#FF2D20]">Transparent Pricing</span>
          </motion.h2>
          <motion.p 
            variants={fadeIn}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="text-[#475569] text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-medium"
          >
            No hidden implementation fees. No complex user seat scaling surprises. Adjust or cancel your subscription anytime with one click.
          </motion.p>
        </div>

        {/* Toggle billing (Monthly / Annual) */}
        <div className="flex justify-center items-center gap-3 mb-16 select-none">
          <div className="bg-[#E2E8F0] rounded-full p-1.5 inline-flex items-center">
            <button 
              onClick={() => setBilling('monthly')}
              className={`px-5 py-1.5 rounded-full text-xs font-bold tracking-tight cursor-pointer transition-all duration-150 ${
                billing === 'monthly' 
                  ? 'bg-white text-[#0F172A] shadow-sm' 
                  : 'text-[#94A3B8] hover:text-[#475569]'
              }`}
            >
              Billed Monthly
            </button>
            <button 
              onClick={() => setBilling('annual')}
              className={`px-5 py-1.5 rounded-full text-xs font-bold tracking-tight cursor-pointer transition-all duration-150 inline-flex items-center gap-1.5 ${
                billing === 'annual' 
                  ? 'bg-white text-[#0F172A] shadow-sm' 
                  : 'text-[#94A3B8] hover:text-[#475569]'
              }`}
            >
              Billed Annually
              <span className="bg-green-100 text-green-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
        >
          {plans.map((plan, idx) => {
            const displayPrice = billing === 'monthly' ? plan.price.monthly : plan.price.annual
            const isEnterprise = plan.name === 'Enterprise'

            return (
              <motion.div 
                key={idx}
                variants={scaleIn}
                className={`bg-white rounded-2xl p-8 flex flex-col justify-between relative shadow-[0_1px_3px_rgba(0,0,0,0.06),_0_4px_12px_rgba(0,0,0,0.04)] transition-all duration-200 border ${
                  plan.popular 
                    ? 'border-2 border-[#FF2D20]' 
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FF2D20] text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Most Popular
                  </span>
                )}

                {/* Top Info */}
                <div className="text-left">
                  <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest block mb-1">{plan.name}</span>
                  
                  {/* Dynamic Animated Price */}
                  <div className="flex items-baseline gap-1 mt-3">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={billing}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="text-5xl font-extrabold text-[#0F172A] tracking-tighter font-mona block"
                      >
                        {displayPrice !== null ? `$${displayPrice}` : 'Custom'}
                      </motion.span>
                    </AnimatePresence>
                    {displayPrice !== null && (
                      <span className="text-lg text-[#94A3B8] font-bold">/mo</span>
                    )}
                  </div>

                  {/* Billed annually footnote */}
                  {billing === 'annual' && displayPrice !== null && (
                    <span className="block text-[11px] text-[#94A3B8] font-semibold mt-1">
                      Billed annually (${displayPrice * 12}/yr)
                    </span>
                  )}

                  <p className="text-sm text-[#475569] font-medium leading-relaxed mt-4 min-h-[44px] border-b border-[#F1F5F9] pb-4">
                    {plan.description}
                  </p>

                  {/* Features list */}
                  <ul className="space-y-3.5 my-6">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs font-semibold text-[#475569]">
                        <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom CTA Button */}
                <div className="mt-6">
                  {isEnterprise ? (
                    <button onClick={() => onSelectPlan && onSelectPlan(plan, billing === 'annual' && displayPrice !== null ? displayPrice * 12 : displayPrice)} className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white py-3 rounded-lg font-bold text-sm tracking-tight shadow-sm cursor-pointer transition-colors duration-150">
                      {plan.cta}
                    </button>
                  ) : plan.popular ? (
                    <button onClick={() => onSelectPlan && onSelectPlan(plan, billing === 'annual' && displayPrice !== null ? displayPrice * 12 : displayPrice)} className="w-full bg-[#FF2D20] hover:bg-[#E5261A] text-white py-3 rounded-lg font-bold text-sm tracking-tight shadow-sm cursor-pointer transition-colors duration-150">
                      {plan.cta}
                    </button>
                  ) : (
                    <button onClick={() => onSelectPlan && onSelectPlan(plan, billing === 'annual' && displayPrice !== null ? displayPrice * 12 : displayPrice)} className="w-full bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] text-[#0F172A] py-3 rounded-lg font-bold text-sm tracking-tight shadow-sm cursor-pointer transition-all duration-150">
                      {plan.cta}
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
