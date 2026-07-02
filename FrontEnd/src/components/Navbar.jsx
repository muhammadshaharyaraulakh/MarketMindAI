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

export default function Navbar({ onSignIn, onSignUp, onShowDashboard }) {
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
