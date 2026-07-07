import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

axios.defaults.withCredentials = true;
import { motion, AnimatePresence } from 'framer-motion'
import { Navigate, useLocation } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
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
} from 'recharts'


// Heroicons imports
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
} from '@heroicons/react/24/outline'

import {
  CheckCircleIcon as CheckCircleIconSolid,
  StarIcon,
  ShieldCheckIcon as ShieldCheckIconSolid,
  BoltIcon as BoltIconSolid,
  EyeSlashIcon
} from '@heroicons/react/24/solid'

import {
  ArrowUpIcon,
  ArrowDownIcon,
  CheckIcon,
  PlusIcon
} from '@heroicons/react/20/solid'

// ==========================================
// DATA CONSTANTS (Defined at the very top)
// ==========================================

// Campaign revenue chart data (7 days, realistic variation)
export const revenueData = [
  { day: 'Mon', revenue: 4280, spend: 690, leads: 34 },
  { day: 'Tue', revenue: 3920, spend: 580, leads: 28 },
  { day: 'Wed', revenue: 5340, spend: 840, leads: 47 },
  { day: 'Thu', revenue: 4780, spend: 730, leads: 39 },
  { day: 'Fri', revenue: 6150, spend: 950, leads: 56 },
  { day: 'Sat', revenue: 5870, spend: 880, leads: 52 },
  { day: 'Sun', revenue: 7240, spend: 1040, leads: 68 },
]

// 30-day performance trend
export const trendData = Array.from({ length: 30 }, (_, i) => {
  const spend = Math.round(600 + Math.random() * 400 + i * 12)
  const roas = +(4.2 + Math.cos(i * 0.3) * 1.1 + i * 0.08).toFixed(2)
  return {
    date: `May ${i + 1}`,
    ctr: +(2.1 + Math.sin(i * 0.4) * 0.8 + i * 0.04).toFixed(2),
    roas,
    spend,
    revenue: Math.round(spend * roas),
  }
})

// Traffic source pie data
export const trafficData = [
  { name: 'Google Ads', value: 42, color: '#3B82F6' },
  { name: 'Meta Ads',   value: 31, color: '#FF2D20' },
  { name: 'Email',      value: 18, color: '#22C55E' },
  { name: 'TikTok',     value: 9,  color: '#8B5CF6' },
]

// Campaign table data
export const campaigns = [
  { name: 'Summer Sale (Google)',   status: 'Active',     spend: '$4,280', revenue: '$31,200', roas: '7.3x', ctr: '4.2%' },
  { name: 'Retargeting (Meta)',     status: 'Active',     spend: '$2,940', revenue: '$19,800', roas: '6.7x', ctr: '3.8%' },
  { name: 'Brand Awareness (TikTok)', status: 'Paused',   spend: '$1,200', revenue: '$6,400',  roas: '5.3x', ctr: '2.1%' },
  { name: 'Email Nurture (Q2)',     status: 'Optimizing', spend: '$480',   revenue: '$8,900',  roas: '18.5x', ctr: '6.4%' },
  { name: 'Competitor Keywords',    status: 'Active',     spend: '$3,100', revenue: '$22,100', roas: '7.1x', ctr: '3.2%' },
]

// Hero stats targets
export const heroStats = [
  { label: 'Avg. ROAS Increase', value: 247, prefix: '+', suffix: '%', icon: ArrowTrendingUpIcon, color: 'text-green-600' },
  { label: 'Campaign Setup Time', value: 70, prefix: '-', suffix: '%', icon: BoltIcon, color: 'text-blue-600' },
  { label: 'Cost Per Lead',  value: 38, prefix: '-', suffix: '%', icon: FunnelIcon, color: 'text-red-600' },
]

// Pricing plans
export const plans = [
  {
    name: 'Starter',
    price: { monthly: 49, annual: 39 },
    description: 'For freelancers & solo marketers',
    cta: 'Start Free Trial',
    popular: false,
    features: [
      '3 active campaigns',
      'Basic analytics dashboard',
      '50 AI content generations/mo',
      'CSV export',
      'Email support',
      '1 user seat',
    ]
  },
  {
    name: 'Pro',
    price: { monthly: 149, annual: 119 },
    description: 'For growing marketing teams',
    cta: 'Start Free Trial',
    popular: true,
    features: [
      'Unlimited campaigns',
      'Real time analytics + alerts',
      '500 AI content generations/mo',
      'AI chatbot advisor',
      'PDF/CSV/Excel export',
      'Two factor authentication',
      '2FA + SSO (Google)',
      '5 user seats',
      'Priority support',
    ]
  },
  {
    name: 'Enterprise',
    price: { monthly: null, annual: null },
    description: 'For agencies and large teams',
    cta: 'Contact Sales',
    popular: false,
    features: [
      'Everything in Pro',
      'Custom AI model training',
      'White label dashboard',
      'Dedicated account manager',
      'SLA guarantee (99.9% uptime)',
      'SSO (Okta, Azure AD)',
      'Unlimited user seats',
      'Custom integrations via API',
    ]
  }
]

// Testimonials
export const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Head of Growth',
    company: 'TechFlow',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    stars: 5,
    quote: 'MarketMind AI cut our campaign setup time by 70%. The AI chatbot diagnosed exactly why our Q1 ads underperformed, something our agency could not figure out in 3 weeks.',
  },
  {
    name: 'Marcus Webb',
    role: 'Chief Marketing Officer',
    company: 'Urbanist Co.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    stars: 5,
    quote: 'We caught a Meta campaign silently burning budget at 2am using the real-time alerts. Fixed it before wasting another $3,000. This tool pays for itself in week one.',
  },
  {
    name: 'Priya Sharma',
    role: 'Digital Director',
    company: 'LaunchBridge',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    stars: 5,
    quote: 'Ad content generation used to take our team 2 full days per campaign. MarketMind generates 20 platform-native variations in 30 seconds. Our ROAS jumped from 2.1x to 6.8x.',
  },
]

// FAQ items
export const faqs = [
  {
    q: 'What marketing channels does MarketMind AI support?',
    a: 'MarketMind AI currently supports Google Ads, Meta (Facebook/Instagram), TikTok Ads, LinkedIn Ads, and Email campaigns. New channel integrations are added monthly based on customer requests.',
  },
  {
    q: 'How does the AI content generation actually work?',
    a: 'Our content engine is powered by Gemini fine tuned on 2M+ high converting ad creatives. You provide your product, audience, and goal, and the AI generates headlines, body copy, CTAs, video scripts, and image captions optimized for each specific platform.',
  },
  {
    q: 'Is my campaign data secure and private?',
    a: 'Yes. All data is encrypted with AES 256 at rest and TLS 1.3 in transit. We are SOC 2 Type II certified and GDPR compliant. Your campaign data is never used to train AI models for other customers.',
  },
  {
    q: 'Can I export my analytics reports?',
    a: 'Absolutely. Pro and Enterprise plans support one click export to PDF (branded), CSV, and Excel. You can also schedule automated weekly or monthly reports delivered to your email.',
  },
  {
    q: 'Does it integrate with Google Analytics and Meta Ads Manager?',
    a: 'Yes. MarketMind AI connects natively with Google Analytics 4, Google Ads, Meta Ads Manager, and Mailchimp. Enterprise plans also support Salesforce, HubSpot, and custom API integrations.',
  },
  {
    q: 'What is included in the 14 day free trial?',
    a: 'The free trial gives you full access to all Pro plan features with no credit card required. You can run up to 5 real campaigns, generate 100 content pieces, and use the AI chatbot unlimited times.',
  },
]

// ==========================================
// ANIMATION VARIANTS
// ==========================================

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  }
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }
}

export const staggerContainer = {
  hidden: {},
  visible: { 
    transition: { staggerChildren: 0.08, delayChildren: 0.1 } 
  }
}

export const float = {
  animate: {
    y: [0, -14, 0],
    transition: {
      duration: 4.5,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
    }
  }
}

// Custom hooks
export const useScrollAnimation = () => {
  const [ref, inView] = useInView({ 
    threshold: 0.12, 
    triggerOnce: true 
  })
  return [ref, inView]
}

export const useCounter = (target, inView, duration = 1800) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { 
        setCount(target)
        clearInterval(timer) 
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target, duration])
  return count
}

// ==========================================
// REUSABLE MICRO-COMPONENTS
// ==========================================

export const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E2E8F0] p-3 rounded-lg shadow-md text-left text-xs font-semibold">
        <p className="text-[#0F172A] mb-1 font-bold">{label}</p>
        {payload.map((item, idx) => (
          <p key={idx} style={{ color: item.color }} className="flex justify-between gap-4 font-mona">
            <span className="text-[#475569]">{item.name}:</span>
            <span className="font-bold">{item.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export const SectionLabel = ({ text, color = 'red' }) => {
  const styles = {
    red: 'bg-[#FFF1F0] text-[#FF2D20] border-[#FECACA]',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
  }
  return (
    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[1.5px] uppercase border ${styles[color] || styles.red} mb-6`}>
      {text}
    </span>
  )
}

export const IconBox = ({ icon: Icon, color }) => (
  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
    <Icon className="w-6 h-6" />
  </div>
)

export const FeatureCheck = ({ text }) => (
  <li className="flex items-start gap-3 text-left">
    <CheckCircleIconSolid className="w-5 h-5 text-[#FF2D20] flex-shrink-0 mt-0.5" />
    <span className="text-[#475569] text-[15px] font-medium leading-relaxed">{text}</span>
  </li>
)

// ==========================================
// SECTION COMPONENTS
// ==========================================

