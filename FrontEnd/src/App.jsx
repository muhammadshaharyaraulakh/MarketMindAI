import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
import AuthSystem from './Authentication/AuthSystem'
import ProfilePage from './Authentication/ProfilePage'
import Dashboard from './dashboard/Dashboard'

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
const revenueData = [
  { day: 'Mon', revenue: 4280, spend: 690, leads: 34 },
  { day: 'Tue', revenue: 3920, spend: 580, leads: 28 },
  { day: 'Wed', revenue: 5340, spend: 840, leads: 47 },
  { day: 'Thu', revenue: 4780, spend: 730, leads: 39 },
  { day: 'Fri', revenue: 6150, spend: 950, leads: 56 },
  { day: 'Sat', revenue: 5870, spend: 880, leads: 52 },
  { day: 'Sun', revenue: 7240, spend: 1040, leads: 68 },
]

// 30-day performance trend
const trendData = Array.from({ length: 30 }, (_, i) => {
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
const trafficData = [
  { name: 'Google Ads', value: 42, color: '#3B82F6' },
  { name: 'Meta Ads',   value: 31, color: '#FF2D20' },
  { name: 'Email',      value: 18, color: '#22C55E' },
  { name: 'TikTok',     value: 9,  color: '#8B5CF6' },
]

// Campaign table data
const campaigns = [
  { name: 'Summer Sale (Google)',   status: 'Active',     spend: '$4,280', revenue: '$31,200', roas: '7.3x', ctr: '4.2%' },
  { name: 'Retargeting (Meta)',     status: 'Active',     spend: '$2,940', revenue: '$19,800', roas: '6.7x', ctr: '3.8%' },
  { name: 'Brand Awareness (TikTok)', status: 'Paused',   spend: '$1,200', revenue: '$6,400',  roas: '5.3x', ctr: '2.1%' },
  { name: 'Email Nurture (Q2)',     status: 'Optimizing', spend: '$480',   revenue: '$8,900',  roas: '18.5x', ctr: '6.4%' },
  { name: 'Competitor Keywords',    status: 'Active',     spend: '$3,100', revenue: '$22,100', roas: '7.1x', ctr: '3.2%' },
]

// Hero stats targets
const heroStats = [
  { label: 'Avg. ROAS Increase', value: 247, prefix: '+', suffix: '%', icon: ArrowTrendingUpIcon, color: 'text-green-600' },
  { label: 'Campaign Setup Time', value: 70, prefix: '-', suffix: '%', icon: BoltIcon, color: 'text-blue-600' },
  { label: 'Cost Per Lead',  value: 38, prefix: '-', suffix: '%', icon: FunnelIcon, color: 'text-red-600' },
]

// Pricing plans
const plans = [
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
      'Real-time analytics + alerts',
      '500 AI content generations/mo',
      'AI chatbot advisor',
      'PDF/CSV/Excel export',
      'Two-factor authentication',
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
      'White-label dashboard',
      'Dedicated account manager',
      'SLA guarantee (99.9% uptime)',
      'SSO (Okta, Azure AD)',
      'Unlimited user seats',
      'Custom integrations via API',
    ]
  }
]

// Testimonials
const testimonials = [
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
const faqs = [
  {
    q: 'What marketing channels does MarketMind AI support?',
    a: 'MarketMind AI currently supports Google Ads, Meta (Facebook/Instagram), TikTok Ads, LinkedIn Ads, and Email campaigns. New channel integrations are added monthly based on customer requests.',
  },
  {
    q: 'How does the AI content generation actually work?',
    a: 'Our content engine is powered by Gemini fine-tuned on 2M+ high-converting ad creatives. You provide your product, audience, and goal, and the AI generates headlines, body copy, CTAs, video scripts, and image captions optimized for each specific platform.',
  },
  {
    q: 'Is my campaign data secure and private?',
    a: 'Yes. All data is encrypted with AES-256 at rest and TLS 1.3 in transit. We are SOC 2 Type II certified and GDPR compliant. Your campaign data is never used to train AI models for other customers.',
  },
  {
    q: 'Can I export my analytics reports?',
    a: 'Absolutely. Pro and Enterprise plans support one-click export to PDF (branded), CSV, and Excel. You can also schedule automated weekly or monthly reports delivered to your email.',
  },
  {
    q: 'Does it integrate with Google Analytics and Meta Ads Manager?',
    a: 'Yes. MarketMind AI connects natively with Google Analytics 4, Google Ads, Meta Ads Manager, and Mailchimp. Enterprise plans also support Salesforce, HubSpot, and custom API integrations.',
  },
  {
    q: 'What is included in the 14-day free trial?',
    a: 'The free trial gives you full access to all Pro plan features with no credit card required. You can run up to 5 real campaigns, generate 100 content pieces, and use the AI chatbot unlimited times.',
  },
]

// ==========================================
// ANIMATION VARIANTS
// ==========================================

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  }
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }
}

const staggerContainer = {
  hidden: {},
  visible: { 
    transition: { staggerChildren: 0.08, delayChildren: 0.1 } 
  }
}

const float = {
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
const useScrollAnimation = () => {
  const [ref, inView] = useInView({ 
    threshold: 0.12, 
    triggerOnce: true 
  })
  return [ref, inView]
}

const useCounter = (target, inView, duration = 1800) => {
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

const CustomTooltip = ({ active, payload, label }) => {
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

const SectionLabel = ({ text, color = 'red' }) => {
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

const IconBox = ({ icon: Icon, color }) => (
  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
    <Icon className="w-6 h-6" />
  </div>
)

const FeatureCheck = ({ text }) => (
  <li className="flex items-start gap-3 text-left">
    <CheckCircleIconSolid className="w-5 h-5 text-[#FF2D20] flex-shrink-0 mt-0.5" />
    <span className="text-[#475569] text-[15px] font-medium leading-relaxed">{text}</span>
  </li>
)

// ==========================================
// SECTION COMPONENTS
// ==========================================

// --- NAVBAR ---
function Navbar({ onSignIn, onSignUp, onShowDashboard }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -16 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`fixed top-0 left-0 w-full z-50 h-16 transition-all duration-200 flex items-center ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.06)]' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center cursor-pointer select-none">
          <span className="font-mona">
            <span className="font-bold text-[#0F172A] text-xl tracking-tight">MarketMind</span>
            <span className="text-[#FF2D20] font-extrabold text-xl ml-0.5">AI</span>
          </span>
        </a>

        {/* Center links - Desktop */}
        <div className="hidden lg:flex items-center gap-8">
          <a href="#features" className="text-[14px] font-semibold text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer">Features</a>
          <a href="#dashboard" className="text-[14px] font-semibold text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer">Analytics</a>
          <a href="#pricing" className="text-[14px] font-semibold text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer">Pricing</a>
          <a href="#testimonials" className="text-[14px] font-semibold text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer">Reviews</a>
          <a href="#faq" className="text-[14px] font-semibold text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer">FAQ</a>
          <button 
            onClick={onShowDashboard}
            className="text-[14px] font-extrabold text-[#FF2D20] hover:text-[#E5261A] transition-colors cursor-pointer"
          >
            Live Demo Dashboard
          </button>
        </div>

        {/* Right actions - Desktop */}
        <div className="hidden lg:flex items-center gap-5">
          <button 
            onClick={onSignIn}
            className="text-[14px] font-semibold text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <button 
            onClick={onSignUp}
            className="bg-[#FF2D20] hover:bg-[#E5261A] text-white text-[15px] font-semibold tracking-tight px-5 py-2.5 rounded-lg inline-flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer transition-colors duration-150"
          >
            Get Started
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="lg:hidden text-[#0F172A] hover:text-[#FF2D20] p-1.5 cursor-pointer"
          aria-label="Toggle menu"
        >
          {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="absolute top-16 left-0 w-full bg-white border-b border-[#E2E8F0] shadow-lg overflow-hidden lg:hidden flex flex-col px-6 py-8 gap-6 z-40"
          >
            <a 
              href="#features" 
              onClick={() => setIsOpen(false)}
              className="text-[16px] font-semibold text-[#475569] hover:text-[#0F172A] transition-colors py-2 border-b border-[#F1F5F9] cursor-pointer"
            >
              Features
            </a>
            <a 
              href="#dashboard" 
              onClick={() => setIsOpen(false)}
              className="text-[16px] font-semibold text-[#475569] hover:text-[#0F172A] transition-colors py-2 border-b border-[#F1F5F9] cursor-pointer"
            >
              Analytics
            </a>
            <a 
              href="#pricing" 
              onClick={() => setIsOpen(false)}
              className="text-[16px] font-semibold text-[#475569] hover:text-[#0F172A] transition-colors py-2 border-b border-[#F1F5F9] cursor-pointer"
            >
              Pricing
            </a>
            <a 
              href="#testimonials" 
              onClick={() => setIsOpen(false)}
              className="text-[16px] font-semibold text-[#475569] hover:text-[#0F172A] transition-colors py-2 border-b border-[#F1F5F9] cursor-pointer"
            >
              Reviews
            </a>
            <a 
              href="#faq" 
              onClick={() => setIsOpen(false)}
              className="text-[16px] font-semibold text-[#475569] hover:text-[#0F172A] transition-colors py-2 border-b border-[#F1F5F9] cursor-pointer"
            >
              FAQ
            </a>
            <button 
              onClick={() => { setIsOpen(false); onShowDashboard(); }}
              className="text-[16px] font-extrabold text-[#FF2D20] hover:text-[#E5261A] text-left py-2 border-b border-[#F1F5F9] cursor-pointer"
            >
              Live Demo Dashboard
            </button>
            <div className="flex flex-col gap-4 mt-2">
              <button 
                onClick={() => { setIsOpen(false); onSignIn(); }}
                className="text-[16px] font-semibold text-[#475569] hover:text-[#0F172A] py-3 text-center rounded-lg border border-[#E2E8F0] cursor-pointer"
              >
                Sign In
              </button>
              <button 
                onClick={() => { setIsOpen(false); onSignUp(); }}
                className="bg-[#FF2D20] text-white py-3 text-center rounded-lg font-semibold text-[16px] flex items-center justify-center gap-2 cursor-pointer hover:bg-[#E5261A]"
              >
                Get Started
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// --- HERO SECTION ---
function Hero({ onGetStarted }) {
  const [heroRef, heroInView] = useScrollAnimation()
  
  // Animate numeric statistics when in viewport
  const roasCount = useCounter(247, heroInView)
  const setupCount = useCounter(70, heroInView)
  const costCount = useCounter(38, heroInView)

  return (
    <section id="hero" className="relative min-h-screen pt-24 pb-20 flex flex-col justify-center overflow-hidden">
      {/* Background Dot-Grid with Fade overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-80"
        style={{
          backgroundImage: "radial-gradient(circle, #CBD5E1 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white pointer-events-none z-0" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side Content */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Announcement Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF1F0] border border-[#FECACA] text-[#FF2D20] text-[13px] font-semibold uppercase tracking-wider mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#FF2D20] animate-pulse" />
            Gemini Powered · Now in Public Beta
          </motion.div>

          {/* Hero H1 */}
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-poppins font-medium text-[32px] md:text-[48px] tracking-tight text-[#0F172A] leading-[1.1] mb-6 max-w-2xl"
          >
            The AI Engine That Turns Marketing Data Into{' '}
            <span className="relative inline-block text-[#FF2D20]">
              Revenue
              <span className="absolute left-0 bottom-[-10px] w-full">
                <svg viewBox="0 0 200 20" className="text-[#FF2D20] w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 10 C 50 2, 150 2, 197 10" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
                </svg>
              </span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#475569] text-lg lg:text-xl font-normal leading-[1.65] mb-8 max-w-xl"
            style={{ fontVariationSettings: "'wdth' 100, 'wght' 400" }}
          >
            MarketMind AI unifies campaign management, real-time analytics, and AI-driven content generation so you stop guessing and start growing.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-5 w-full sm:w-auto"
          >
            <button 
              onClick={onGetStarted}
              className="bg-[#FF2D20] hover:bg-[#E5261A] text-white px-7 py-3.5 rounded-lg font-semibold text-[15px] tracking-tight flex items-center justify-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer transition-colors duration-150"
            >
              Start for Free
              <ArrowRightIcon className="w-4 h-4" />
            </button>
            <a 
              href="#dashboard"
              className="border border-[#E2E8F0] text-[#0F172A] px-7 py-3.5 rounded-lg font-semibold text-[15px] hover:border-[#CBD5E1] hover:bg-[#F8FAFC] flex items-center justify-center gap-2 cursor-pointer transition-all duration-150"
            >
              <PlayCircleIcon className="w-5 h-5 text-[#475569]" />
              Watch 2-min Demo
            </a>
          </motion.div>

          {/* Below CTAs footnote */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-[#94A3B8] font-medium"
          >
            <span className="flex items-center gap-1.5"><CheckIcon className="w-4 h-4 text-[#FF2D20]" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckIcon className="w-4 h-4 text-[#FF2D20]" /> 14-day free trial</span>
            <span className="flex items-center gap-1.5"><CheckIcon className="w-4 h-4 text-[#FF2D20]" /> Cancel anytime</span>
          </motion.div>
        </div>

        {/* Right Side Visual (Floating Analytics Card) */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-5 w-full max-w-sm"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4 border-b border-[#F1F5F9] pb-3">
              <div>
                <span className="text-[13px] font-semibold text-[#0F172A] block text-left">Campaign Performance</span>
                <span className="text-[11px] text-[#94A3B8] font-medium block text-left">May 26, 2026</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-150 text-green-700 text-[10px] font-semibold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Live
              </span>
            </div>

            {/* Spark Area Chart */}
            <div className="w-full mb-5">
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF2D20" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#FF2D20" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#FF2D20', strokeWidth: 1, strokeDasharray: '3 3' }} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Daily Revenue"
                    stroke="#FF2D20" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Micro Stats Grid */}
            <div className="grid grid-cols-3 gap-2 border-t border-[#F1F5F9] pt-4">
              <div className="text-left">
                <div className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider mb-0.5">CTR</div>
                <div className="flex items-center gap-0.5 text-sm font-extrabold text-[#0F172A]">
                  <ArrowUpIcon className="w-3.5 h-3.5 text-green-500" />
                  <span>4.2%</span>
                </div>
              </div>
              <div className="text-left">
                <div className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider mb-0.5">ROAS</div>
                <div className="flex items-center gap-0.5 text-sm font-extrabold text-[#0F172A]">
                  <ChartBarIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>7.5x</span>
                </div>
              </div>
              <div className="text-left">
                <div className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider mb-0.5">CPC</div>
                <div className="flex items-center gap-0.5 text-sm font-extrabold text-[#0F172A]">
                  <ArrowDownIcon className="w-3.5 h-3.5 text-green-500" />
                  <span>$0.84</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Prominent Stats Strip at Bottom */}
      <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-16 lg:mt-24 border-t border-[#E2E8F0] pt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {heroStats.map((stat, idx) => {
            let activeCount = 0
            if (idx === 0) activeCount = roasCount
            if (idx === 1) activeCount = setupCount
            if (idx === 2) activeCount = costCount

            return (
              <div key={idx} className="flex items-center gap-4 text-left p-2">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-slate-50 border border-[#E2E8F0] ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-2xl lg:text-3xl font-extrabold text-[#0F172A] tracking-tight font-mona">
                    {stat.prefix}{activeCount}{stat.suffix}
                  </span>
                  <span className="block text-sm text-[#475569] font-semibold">{stat.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// --- TRUSTED BY LOGO STRIP ---
function LogoStrip() {
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

// --- PROBLEM STATEMENT ---
function ProblemSection() {
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
            <h3 className="text-xl font-bold text-[#0F172A] mt-6 mb-3 tracking-tight font-mona">No Real-Time Visibility</h3>
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

// --- FEATURES SECTION (4 Alternating Blocks) ---

// Feature Block 1 Visual (Grouped Bar Chart)
const campaignPerformanceData = [
  { week: 'Wk 1', Clicks: 2400, Conversions: 680 },
  { week: 'Wk 2', Clicks: 3200, Conversions: 920 },
  { week: 'Wk 3', Clicks: 4500, Conversions: 1400 },
  { week: 'Wk 4', Clicks: 3900, Conversions: 1250 },
  { week: 'Wk 5', Clicks: 5400, Conversions: 1850 },
]

function CampaignVisual() {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm w-full">
      <div className="flex items-center justify-between border-b pb-3 mb-4 text-left">
        <div>
          <span className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider">Dashboard View</span>
          <span className="text-sm font-semibold text-[#0F172A] block">Clicks vs Conversions</span>
        </div>
        <span className="text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-md font-bold">Auto-Optimized</span>
      </div>
      <div className="w-full">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={campaignPerformanceData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="week" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', fontWeight: 650 }} />
            <Bar dataKey="Clicks" fill="#3B82F6" name="Clicks" radius={[4, 4, 0, 0]} barSize={16} />
            <Bar dataKey="Conversions" fill="#FF2D20" name="Conversions" radius={[4, 4, 0, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Feature Block 2 Visual (Composed Chart)
const analyticsChartData = [
  { name: 'May 1', Spend: 120, CTR: 1.8 },
  { name: 'May 5', Spend: 240, CTR: 2.2 },
  { name: 'May 10', Spend: 310, CTR: 2.5 },
  { name: 'May 12', Spend: 450, CTR: 3.8 },
  { name: 'May 15', Spend: 520, CTR: 4.1 },
  { name: 'May 20', Spend: 480, CTR: 3.9 },
  { name: 'May 25', Spend: 600, CTR: 4.5 },
]

function AnalyticsVisual() {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm w-full">
      <div className="flex items-center justify-between border-b pb-3 mb-4 text-left">
        <div>
          <span className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider animate-pulse">● Live Engine</span>
          <span className="text-sm font-semibold text-[#0F172A] block">CTR Trends vs Spend</span>
        </div>
        <span className="text-[11px] text-[#94A3B8] font-bold">Updated 3s ago</span>
      </div>
      <div className="w-full">
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={analyticsChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', fontWeight: 650 }} />
            <Bar dataKey="Spend" name="Spend ($)" fill="#EFF6FF" stroke="#3B82F6" strokeWidth={1} radius={[4, 4, 0, 0]} barSize={26} />
            <Line type="monotone" dataKey="CTR" name="CTR (%)" stroke="#FF2D20" strokeWidth={2.5} dot={false} />
            <ReferenceLine x="May 12" stroke="#94A3B8" strokeDasharray="3 3" label={{ value: 'Ad Launch', position: 'top', fill: '#94A3B8', fontSize: 10, fontWeight: 700 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Feature Block 3 Visual (Light AI Content Generator Bubble Panel)
function ContentVisual() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm w-full text-left">
      <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3.5 mb-5">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-5 h-5 text-[#FF2D20]" />
          <span className="text-[#0F172A] font-semibold text-sm">AI Content Generator</span>
        </div>
        <span className="bg-[#F8FAFC] border border-[#E2E8F0] text-[#94A3B8] text-[10px] font-bold px-2 py-0.5 rounded tracking-wide">
          Gemini
        </span>
      </div>

      <div className="space-y-4">
        {/* Output Bubble 1 */}
        <div className="bg-[#F8FAFC] rounded-xl p-3.5 text-[13px] text-[#475569] leading-relaxed border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 font-bold text-amber-500 text-xs">
              <BoltIconSolid className="w-3.5 h-3.5" />
              Campaign Hook
            </span>
            <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full font-bold">Meta Ads</span>
          </div>
          "Stop scrolling: your store is losing $4,200 every day to campaigns that should be working."
        </div>

        {/* Output Bubble 2 */}
        <div className="bg-[#F8FAFC] rounded-xl p-3.5 text-[13px] text-[#475569] leading-relaxed border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 font-bold text-green-600 text-xs">
              <CameraIcon className="w-3.5 h-3.5" />
              Creative Caption
            </span>
            <span className="text-[10px] text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full font-bold">Instagram</span>
          </div>
          "Your product. Their problem. One powerful solution. Tap the link to see why 14,000+ customers switched."
        </div>

        {/* Output Bubble 3 */}
        <div className="bg-[#F8FAFC] rounded-xl p-3.5 text-[13px] text-[#475569] leading-relaxed border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 font-bold text-red-500 text-xs">
              <PlayCircleIcon className="w-3.5 h-3.5" />
              Video Hook Script
            </span>
            <span className="text-[10px] text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full font-bold">TikTok Ads</span>
          </div>
          "In the next 47 seconds, I'll show you the exact 3-word CTA that doubled our client's ROAS overnight."
        </div>
      </div>

      <div className="flex items-center justify-end mt-5 border-t border-[#F1F5F9] pt-3.5">
        <button className="flex items-center gap-1 text-[#94A3B8] hover:text-[#0F172A] text-xs font-semibold cursor-pointer transition-colors duration-150">
          <ArrowPathIcon className="w-3.5 h-3.5" />
          Regenerate Variations
        </button>
      </div>
    </div>
  )
}

// Main Features Section Wrapper
function FeaturesSection() {
  const [ref1, inView1] = useScrollAnimation()
  const [ref2, inView2] = useScrollAnimation()
  const [ref3, inView3] = useScrollAnimation()
  const [ref4, inView4] = useScrollAnimation()

  return (
    <section id="features" className="overflow-hidden">
      
      {/* Block 1: Campaign Management */}
      <div ref={ref1} className="bg-white py-24 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={inView1 ? "visible" : "hidden"}
            className="flex flex-col items-start text-left"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel text="Campaign Intelligence" color="red" />
            </motion.div>
            <motion.h3 
              variants={fadeUp}
              className="text-2xl md:text-3xl font-semibold text-[#0F172A] tracking-tight leading-tight mb-5 font-mona"
              style={{ fontVariationSettings: "'wdth' 100, 'wght' 550" }}
            >
              Manage Every Campaign From <span className="text-[#FF2D20]">One Command Center</span>
            </motion.h3>
            <motion.p variants={fadeIn} className="text-[#475569] text-[16px] leading-relaxed mb-6 font-medium">
              Launch, monitor, pause, and optimize campaigns across Google Ads, Meta, TikTok, and Email, all from a single dashboard. Set budget rules, automated A/B tests, and AI-powered auto-optimization triggers that act before you even wake up.
            </motion.p>
            <motion.ul variants={staggerContainer} className="space-y-3.5 mb-8">
              <FeatureCheck text="Multi-channel campaign scheduling" />
              <FeatureCheck text="AI budget auto-reallocation in real time" />
              <FeatureCheck text="A/B test automation with winner auto-selection" />
              <FeatureCheck text="Real-time performance anomaly alerts" />
              <FeatureCheck text="Drag-and-drop campaign calendar" />
            </motion.ul>
            <motion.a 
              variants={fadeUp}
              href="#pricing"
              className="text-[#FF2D20] font-bold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all duration-150 text-sm cursor-pointer group"
            >
              Explore Campaign Tools 
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.a>
          </motion.div>

          {/* Visual Side */}
          <motion.div 
            variants={scaleIn}
            initial="hidden"
            animate={inView1 ? "visible" : "hidden"}
            className="w-full flex justify-center"
          >
            <CampaignVisual />
          </motion.div>
        </div>
      </div>

      {/* Block 2: Real-Time Analytics */}
      <div ref={ref2} className="bg-[#F8FAFC] py-24 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visual Side (Left on Desktop) */}
          <motion.div 
            variants={scaleIn}
            initial="hidden"
            animate={inView2 ? "visible" : "hidden"}
            className="w-full flex justify-center lg:order-first order-last"
          >
            <AnalyticsVisual />
          </motion.div>

          {/* Text Content (Right on Desktop) */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={inView2 ? "visible" : "hidden"}
            className="flex flex-col items-start text-left"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel text="Live Analytics" color="blue" />
            </motion.div>
            <motion.h3 
              variants={fadeUp}
              className="text-2xl md:text-3xl font-semibold text-[#0F172A] tracking-tight leading-tight mb-5 font-mona"
              style={{ fontVariationSettings: "'wdth' 100, 'wght' 550" }}
            >
              Real-Time Data That Tells You <span className="text-[#FF2D20]">What to Do Next</span>
            </motion.h3>
            <motion.p variants={fadeIn} className="text-[#475569] text-[16px] leading-relaxed mb-6 font-medium">
              Dashboards refresh every 30 seconds. Track CTR, ROAS, CPC, CPM, LTV, and churn risk with AI annotations that automatically explain every performance spike and drop in plain English.
            </motion.p>
            <motion.ul variants={staggerContainer} className="space-y-3.5 mb-8">
              <FeatureCheck text="30-second dashboard data refresh" />
              <FeatureCheck text="AI anomaly detection with plain-English explanations" />
              <FeatureCheck text="Custom KPI dashboard builder (drag & drop)" />
              <FeatureCheck text="Scheduled reports to email (PDF/CSV/Excel)" />
              <FeatureCheck text="Multi-account comparison view" />
            </motion.ul>
            <motion.a 
              variants={fadeUp}
              href="#pricing"
              className="text-[#FF2D20] font-bold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all duration-150 text-sm cursor-pointer group"
            >
              Learn More About Analytics
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Block 3: AI Content Generation */}
      <div ref={ref3} className="bg-white py-24 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={inView3 ? "visible" : "hidden"}
            className="flex flex-col items-start text-left"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel text="Content Engine" color="purple" />
            </motion.div>
            <motion.h3 
              variants={fadeUp}
              className="text-2xl md:text-3xl font-semibold text-[#0F172A] tracking-tight leading-tight mb-5 font-mona"
              style={{ fontVariationSettings: "'wdth' 100, 'wght' 550" }}
            >
              Generate Ad Copy, Captions, and Video Scripts <span className="text-[#FF2D20]">in Seconds</span>
            </motion.h3>
            <motion.p variants={fadeIn} className="text-[#475569] text-[16px] leading-relaxed mb-6 font-medium">
              Powered by Gemini fine-tuned on 2M+ high-converting ad creatives. Generate platform-native content for Meta, Google, TikTok, YouTube, and Email, with each variation fully optimized for the platform's specific algorithm.
            </motion.p>
            <motion.ul variants={staggerContainer} className="space-y-3.5 mb-8">
              <FeatureCheck text="Ad copy for Meta, Google, TikTok, LinkedIn" />
              <FeatureCheck text="Product photo caption generation from uploaded images" />
              <FeatureCheck text="YouTube video hook & full script writer" />
              <FeatureCheck text="Email subject line A/B variants (50 at once)" />
              <FeatureCheck text="Brand voice profile that learns and matches your tone" />
            </motion.ul>
            <motion.a 
              variants={fadeUp}
              href="#pricing"
              className="text-[#FF2D20] font-bold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all duration-150 text-sm cursor-pointer group"
            >
              Try Creative Writer 
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.a>
          </motion.div>

          {/* Visual Side */}
          <motion.div 
            variants={scaleIn}
            initial="hidden"
            animate={inView3 ? "visible" : "hidden"}
            className="w-full flex justify-center"
          >
            <ContentVisual />
          </motion.div>
        </div>
      </div>

      {/* Block 4: AI Advisor / Why Campaigns Fail */}
      <div ref={ref4} className="bg-[#F8FAFC] py-24 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visual Side (Left on Desktop) */}
          <motion.div 
            variants={scaleIn}
            initial="hidden"
            animate={inView4 ? "visible" : "hidden"}
            className="w-full flex justify-center lg:order-first order-last"
          >
            <ChatAdvisorVisual inView={inView4} />
          </motion.div>

          {/* Text Content (Right on Desktop) */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={inView4 ? "visible" : "hidden"}
            className="flex flex-col items-start text-left"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel text="AI Advisor" color="amber" />
            </motion.div>
            <motion.h3 
              variants={fadeUp}
              className="text-2xl md:text-3xl font-semibold text-[#0F172A] tracking-tight leading-tight mb-5 font-mona"
              style={{ fontVariationSettings: "'wdth' 100, 'wght' 550" }}
            >
              Ask Your Data Anything. Get <span className="text-[#FF2D20]">Plain-English Answers.</span>
            </motion.h3>
            <motion.p variants={fadeIn} className="text-[#475569] text-[16px] leading-relaxed mb-6 font-medium">
              Most analytics tools show you what happened. MarketMind AI tells you WHY it happened and WHAT to do about it. Ask any question about your campaigns in natural language and get expert-level analysis in seconds.
            </motion.p>
            <motion.ul variants={staggerContainer} className="space-y-3.5 mb-8">
              <FeatureCheck text="Natural language campaign Q&A (no SQL, no formulas)" />
              <FeatureCheck text="Root cause failure analysis with priority scores" />
              <FeatureCheck text="Actionable fix recommendations with effort estimates" />
              <FeatureCheck text="Cross-channel insight correlation" />
              <FeatureCheck text="Weekly AI campaign health digest to your inbox" />
            </motion.ul>
            <motion.a 
              variants={fadeUp}
              href="#pricing"
              className="text-[#FF2D20] font-bold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all duration-150 text-sm cursor-pointer group"
            >
              Meet Your Advisor
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// --- CHAT ADVISOR VISUAL WRAPPER ---
function ChatAdvisorVisual({ inView }) {
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
        <span className="font-semibold text-xs">Ask about your campaigns...</span>
        <SparklesIcon className="w-4 h-4 text-[#FF2D20]" />
      </div>
    </div>
  )
}

// --- ANALYTICS DASHBOARD PREVIEW ---
function DashboardSection() {
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
                      <th className="px-5 py-3 text-xs font-bold text-[#475569] uppercase tracking-wider">Campaign Name</th>
                      <th className="px-5 py-3 text-xs font-bold text-[#475569] uppercase tracking-wider">Status</th>
                      <th className="px-5 py-3 text-xs font-bold text-[#475569] uppercase tracking-wider">Budget Spent</th>
                      <th className="px-5 py-3 text-xs font-bold text-[#475569] uppercase tracking-wider">Revenue</th>
                      <th className="px-5 py-3 text-xs font-bold text-[#475569] uppercase tracking-wider">ROAS</th>
                      <th className="px-5 py-3 text-xs font-bold text-[#475569] uppercase tracking-wider">CTR</th>
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
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider ${statusStyles[camp.status]}`}>
                              {camp.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-xs font-medium text-[#475569]">{camp.spend}</td>
                          <td className="px-5 py-3.5 text-xs font-bold text-[#0F172A]">{camp.revenue}</td>
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

// --- SECURITY & 2FA SECTION ---
function SecuritySection() {
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

// --- PRICING SECTION ---
function PricingSection() {
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
            No hidden implementation fees. No complex user-seat scaling surprises. Adjust or cancel your subscription anytime with one click.
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
                    <button className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white py-3 rounded-lg font-bold text-sm tracking-tight shadow-sm cursor-pointer transition-colors duration-150">
                      {plan.cta}
                    </button>
                  ) : plan.popular ? (
                    <button className="w-full bg-[#FF2D20] hover:bg-[#E5261A] text-white py-3 rounded-lg font-bold text-sm tracking-tight shadow-sm cursor-pointer transition-colors duration-150">
                      {plan.cta}
                    </button>
                  ) : (
                    <button className="w-full bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] text-[#0F172A] py-3 rounded-lg font-bold text-sm tracking-tight shadow-sm cursor-pointer transition-all duration-150">
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

// --- TESTIMONIALS SECTION ---
function TestimonialsSection() {
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
          <div className="flex items-center justify-center gap-0.5 mt-4">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="w-5 h-5 text-amber-400" />
            ))}
          </div>
        </div>

        {/* Testimonial Cards Grid */}
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

// --- FAQ SECTION ---
function FAQSection() {
  const [ref, inView] = useScrollAnimation()
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section id="faq" ref={ref} className="bg-[#F8FAFC] py-24 border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
        {/* Left Column - Heading Info */}
        <div className="lg:col-span-1 text-left flex flex-col items-start sticky top-24">
          <SectionLabel text="FAQ" color="blue" />
          <motion.h2 
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="text-[26px] md:text-[34px] font-semibold text-[#0F172A] tracking-tight leading-tight mb-4 font-mona"
            style={{ fontVariationSettings: "'wdth' 100, 'wght' 550" }}
          >
            Everything You <span className="text-[#FF2D20]">Need to Know</span>
          </motion.h2>
          <motion.p 
            variants={fadeIn}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="text-[#475569] text-[15px] leading-relaxed mb-6 font-semibold"
          >
            Can't find the exact technical answer? Get in touch with our operations desk; we respond within 2 hours.
          </motion.p>
          <motion.button 
            variants={fadeUp}
            className="border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white text-[#0F172A] px-6 py-2.5 rounded-lg font-bold text-sm inline-flex items-center gap-2 cursor-pointer shadow-sm transition-all duration-150"
          >
            <EnvelopeIcon className="w-4 h-4 text-[#475569]" />
            Contact Support Desk
          </motion.button>
        </div>

        {/* Right Column - Accordion Lists */}
        <div className="lg:col-span-2 text-left bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div 
                key={idx}
                className="border-b border-[#E2E8F0] last:border-0"
              >
                {/* Header Row */}
                <div 
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex justify-between items-start cursor-pointer py-5 select-none hover:text-[#FF2D20] transition-colors"
                >
                  <span className="font-bold text-[#0F172A] text-[15px] flex-1 pr-4 font-mona">
                    {faq.q}
                  </span>
                  <ChevronDownIcon 
                    className={`w-4 h-4 text-[#94A3B8] flex-shrink-0 mt-1 transform transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#FF2D20]' : ''
                    }`} 
                  />
                </div>

                {/* Answer Content - AnimatePresence */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="text-[#475569] text-[14px] leading-relaxed pb-5 font-semibold">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// --- FINAL CTA SECTION ---
function CTASection({ onGetStarted }) {
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

// --- FOOTER ---
function Footer() {
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

// --- MAIN EXPORT APP ---
export default function App() {
  const [authView, setAuthView] = useState(null)
  const [viewProfile, setViewProfile] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <>
      {isLoggedIn ? (
        <Dashboard 
          onLogout={() => setIsLoggedIn(false)} 
          onOpenProfile={() => setViewProfile(true)} 
        />
      ) : (
        <main className="overflow-x-hidden w-full relative bg-white select-none">
          <Navbar 
            onSignIn={() => setAuthView('login')} 
            onSignUp={() => setAuthView('signup')} 
            onShowDashboard={() => setIsLoggedIn(true)}
          />
          <Hero onGetStarted={() => setAuthView('signup')} />
          <LogoStrip />
          <ProblemSection />
          <FeaturesSection />
          <DashboardSection />
          <SecuritySection />
          <PricingSection />
          <TestimonialsSection />
          <FAQSection />
          <CTASection onGetStarted={() => setAuthView('signup')} />
          <Footer />

          <AnimatePresence>
            {authView && (
              <AuthSystem
                initialView={authView}
                onClose={(result) => {
                  setAuthView(null)
                  if (result?.loggedIn) {
                    setIsLoggedIn(true)
                  }
                }}
              />
            )}
          </AnimatePresence>
        </main>
      )}

      <AnimatePresence>
        {viewProfile && (
          <ProfilePage onClose={() => setViewProfile(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
