import React, { useState, useEffect, useMemo, useRef, useReducer } from 'react'
import { Routes, Route, useNavigate, useParams, useLocation, Navigate, Link, matchPath } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  PieChart,
  Pie,
  Area,
  Bar,
  Line,
  Cell,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts'
import CampaignPanel from './CampaignPanel'
import AdSetPanel from './AdSetPanel'
import AdPanel from './AdPanel'
import ConfirmDialog from './ConfirmDialog'

// Heroicons imports (Strictly Outline with thin stroke styling)
import { 
  ChartBarIcon,
  BoltIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon,
  CursorArrowRaysIcon,
  DocumentArrowDownIcon,
  ArrowLeftOnRectangleIcon,
  HeartIcon,
  ClipboardIcon,
  PaperAirplaneIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChatBubbleBottomCenterIcon,
  VideoCameraIcon,
  AtSymbolIcon,
  PhotoIcon,
  PresentationChartLineIcon,
  CircleStackIcon,
  PuzzlePieceIcon
} from '@heroicons/react/24/outline'

import {
  HeartIcon as HeartIconSolid,
  TrophyIcon,
  CheckCircleIcon as CheckCircleIconSolid
} from '@heroicons/react/24/solid'

import {
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/20/solid'

// ==========================================
// RELATIONAL INITIAL MOCK DATA
// ==========================================

const INITIAL_CAMPAIGNS = [
  { id: 1, name: 'Summer Performance Ads', platform: 'Google', status: 'Active', budget: 5000, startDate: '2026-05-01', endDate: '2026-06-01', objective: 'SALES', budget_type: 'Daily', bid_strategy: 'Maximize Conversions', sync_status: 'SYNCED', deletedAt: null },
  { id: 2, name: 'Meta Retargeting Q2', platform: 'Meta', status: 'Active', budget: 4000, startDate: '2026-05-10', endDate: '2026-06-10', objective: 'LEADS', budget_type: 'Lifetime', bid_strategy: 'Lowest Cost', sync_status: 'SYNCED', deletedAt: null },
  { id: 3, name: 'TikTok Brand Viral', platform: 'TikTok', status: 'Paused', budget: 2000, startDate: '2026-05-15', endDate: '2026-06-15', objective: 'AWARENESS', budget_type: 'Daily', bid_strategy: 'Cost Cap', sync_status: 'SYNCED', deletedAt: null },
  { id: 4, name: 'Email Newsletter Nurture', platform: 'Email', status: 'Active', budget: 1000, startDate: '2026-05-01', endDate: '2026-08-30', objective: 'TRAFFIC', budget_type: 'Daily', bid_strategy: 'Manual', sync_status: 'SYNCED', deletedAt: null }
]

const INITIAL_ANALYTICS = [
  // Campaign 1 Snapshots (Google)
  { id: 101, campaignId: 1, date: '2026-05-20', spend: 350, revenue: 2450, impressions: 12000, clicks: 520, leads: 24 },
  { id: 102, campaignId: 1, date: '2026-05-21', spend: 400, revenue: 3100, impressions: 14000, clicks: 590, leads: 28 },
  { id: 103, campaignId: 1, date: '2026-05-22', spend: 450, revenue: 3200, impressions: 15000, clicks: 610, leads: 31 },
  { id: 104, campaignId: 1, date: '2026-05-23', spend: 420, revenue: 3000, impressions: 13500, clicks: 570, leads: 26 },
  { id: 105, campaignId: 1, date: '2026-05-24', spend: 500, revenue: 4100, impressions: 18000, clicks: 760, leads: 39 },
  { id: 106, campaignId: 1, date: '2026-05-25', spend: 480, revenue: 3800, impressions: 16500, clicks: 690, leads: 34 },
  { id: 107, campaignId: 1, date: '2026-05-26', spend: 520, revenue: 4300, impressions: 19000, clicks: 810, leads: 43 },

  // Campaign 2 Snapshots (Meta)
  { id: 201, campaignId: 2, date: '2026-05-20', spend: 200, revenue: 1300, impressions: 8000, clicks: 310, leads: 12 },
  { id: 202, campaignId: 2, date: '2026-05-21', spend: 250, revenue: 1800, impressions: 9500, clicks: 380, leads: 16 },
  { id: 203, campaignId: 2, date: '2026-05-22', spend: 300, revenue: 2100, impressions: 11000, clicks: 420, leads: 20 },
  { id: 204, campaignId: 2, date: '2026-05-23', spend: 280, revenue: 1950, impressions: 10200, clicks: 390, leads: 18 },
  { id: 205, campaignId: 2, date: '2026-05-24', spend: 350, revenue: 2500, impressions: 13000, clicks: 510, leads: 24 },
  { id: 206, campaignId: 2, date: '2026-05-25', spend: 320, revenue: 2150, impressions: 12500, clicks: 470, leads: 22 },
  { id: 207, campaignId: 2, date: '2026-05-26', spend: 400, revenue: 2900, impressions: 15500, clicks: 590, leads: 32 },

  // Campaign 3 Snapshots (TikTok)
  { id: 301, campaignId: 3, date: '2026-05-22', spend: 150, revenue: 600, impressions: 6000, clicks: 120, leads: 6 },
  { id: 302, campaignId: 3, date: '2026-05-23', spend: 180, revenue: 720, impressions: 7200, clicks: 150, leads: 8 },
  { id: 303, campaignId: 3, date: '2026-05-24', spend: 200, revenue: 900, impressions: 8500, clicks: 180, leads: 11 },
  { id: 304, campaignId: 3, date: '2026-05-25', spend: 220, revenue: 950, impressions: 9000, clicks: 190, leads: 12 },
  { id: 305, campaignId: 3, date: '2026-05-26', spend: 250, revenue: 1100, impressions: 10500, clicks: 230, leads: 15 },

  // Campaign 4 Snapshots (Email)
  { id: 401, campaignId: 4, date: '2026-05-20', spend: 30, revenue: 600, impressions: 4000, clicks: 250, leads: 40 },
  { id: 402, campaignId: 4, date: '2026-05-23', spend: 40, revenue: 900, impressions: 5000, clicks: 320, leads: 58 },
  { id: 403, campaignId: 4, date: '2026-05-26', spend: 35, revenue: 850, impressions: 4800, clicks: 290, leads: 52 }
]

const INITIAL_CONTENT_PIECES = [
  { id: 1, campaignId: 1, platform: 'Google', type: 'Ad Copy', title: 'Conversion Boost Headline', text: 'Struggling with low conversion rates? MarketMind AI uses deep performance predictions to optimize your search keywords instantly. Get a 7.3x average ROAS lift.', bookmarked: true },
  { id: 2, campaignId: 2, platform: 'Meta', type: 'Caption', title: 'Ad Fatigue Solver Feed ad', text: 'Catch your ad fatigue before it burns your budget. Let our Gemini-powered engine design, execute, and scale high-performance ads on autopilot. ⚡ Click below for a free campaign audit!', bookmarked: false },
  { id: 3, campaignId: 2, platform: 'Meta', type: 'Video Script', title: '30s Hook Script for Lead Gen', text: 'Visual: Host holds phone with declining charts. Hook: Stop throwing cash at Meta ads that fail. Here is the 2am budget alert engine that saved our agency $3K last week.', bookmarked: true },
  { id: 4, campaignId: 3, platform: 'TikTok', type: 'Caption', title: 'Viral Spark Caption', text: 'Marketers are quiet about this AI hack 🤫 Stop guessing which video script converts. MarketMind predicted our target engagement score within 0.1%. #SaaS #GrowthHack', bookmarked: false },
  { id: 5, campaignId: 4, platform: 'Email', type: 'Subject Line', title: 'Q2 Newsletter Headline Option A', text: 'Stop burning ad budget (3 forecast models inside)', bookmarked: false }
]

const INITIAL_AB_TESTS = [
  { id: 1, campaignId: 1, name: 'Google High Urgency Headline Test', variantA: 'Stop Wasting Ad Budget - Try predicted AI Keywords', variantB: 'The Only AI Keywords Guaranteed to Boost Conversion Rates', splitRatio: '50/50', clicksA: 340, clicksB: 180, impressionsA: 8000, impressionsB: 8500, status: 'Running', winner: null },
  { id: 2, campaignId: 2, name: 'Meta Visual Ad-Copy Variant test', variantA: '⚡ Get a 2.4x ROAS increase in 7 days or your money back.', variantB: '⚡ Tired of low CTR? Let predicted AI build Meta creatives.', splitRatio: '60/40', clicksA: 410, clicksB: 480, impressionsA: 11000, impressionsB: 11500, status: 'Completed', winner: 'Variant B' },
  { id: 3, campaignId: 4, name: 'Email subject lines - Value vs Urgency', variantA: 'MarketMind AI: Slash Customer Acquisition Costs by 38%', variantB: 'Unlock your marketing forecast metrics inside today!', splitRatio: '50/50', clicksA: 180, clicksB: 240, impressionsA: 3000, impressionsB: 3050, status: 'Running', winner: null }
]

const INITIAL_ADSETS = [
  { id: 1, campaignId: 1, name: 'Search Broad Match', audienceType: 'Interest', platform: 'Google', status: 'Active', budget: 2500, goal: 'CONVERSIONS', spendToday: 150, billing_event: 'IMPRESSIONS', budget_type: 'Daily', start_time: '2026-05-01T00:00', end_time: '2026-06-01T23:59', frequency_cap: '3 per day', sync_status: 'SYNCED', targeting: { age_min: 18, age_max: 65, genders: ['All'], locations: ['US'], interests: ['SaaS'] }, deletedAt: null },
  { id: 2, campaignId: 1, name: 'Search Exact Match', audienceType: 'Custom', platform: 'Google', status: 'Active', budget: 2500, goal: 'CONVERSIONS', spendToday: 200, billing_event: 'CLICKS', budget_type: 'Daily', start_time: '2026-05-01T00:00', end_time: '2026-06-01T23:59', frequency_cap: 'None', sync_status: 'SYNCED', targeting: { age_min: 25, age_max: 55, genders: ['All'], locations: ['US', 'CA'], interests: ['B2B'] }, deletedAt: null }
]

const INITIAL_ADS = [
  { id: 1, adSetId: 1, name: 'Promo RSA 1', format: 'RESPONSIVE', platform: 'Google', status: 'Active', headline: 'Best SaaS Tools', description: 'Grow your business', cta: 'Sign Up', metrics: { impressions: 1200, clicks: 45, spend: 35 }, destination_url: 'https://marketmind.ai', cta_type: 'SIGN_UP', review_status: 'APPROVED', sync_status: 'SYNCED', ab_test_group: 'A', deletedAt: null },
  { id: 2, adSetId: 1, name: 'Promo RSA 2', format: 'RESPONSIVE', platform: 'Google', status: 'Paused', headline: 'AI Marketing', description: 'Automate ads', cta: 'Learn More', metrics: { impressions: 800, clicks: 20, spend: 15 }, destination_url: 'https://marketmind.ai/features', cta_type: 'LEARN_MORE', review_status: 'PENDING', sync_status: 'SYNCED', ab_test_group: 'B', deletedAt: null }
]

const INITIAL_INTEGRATIONS = [
  { platform: 'Google', accounts: [{ name: 'MarketMind Main', id: '123-456-7890', currency: 'USD', status: 'Connected' }], syncSettings: { frequency: '1 hour', duration: '30 days' } },
  { platform: 'Meta', accounts: [], syncSettings: { frequency: 'Every 15 min', duration: '7 days' } },
  { platform: 'Snapchat', accounts: [], syncSettings: { frequency: 'Daily', duration: '90 days' } }
]

// ==========================================
// STATE REDUCER
// ==========================================

const INITIAL_STATE = {
  campaigns: INITIAL_CAMPAIGNS,
  analytics: INITIAL_ANALYTICS,
  contentPieces: INITIAL_CONTENT_PIECES,
  abTests: INITIAL_AB_TESTS,
  adSets: INITIAL_ADSETS,
  ads: INITIAL_ADS,
  integrations: INITIAL_INTEGRATIONS,
  ui: {
    activePanelType: null,
    editingItem: null,
    isLoading: false,
    oauthStep: 0,
    confirmDialog: { isOpen: false, type: null, id: null, title: '', message: '' }
  },
  searchQuery: '',
  platformFilter: 'All',
  statusFilter: 'All',
  chatMessages: [
    { sender: 'ai', text: 'Welcome Rashid! I have analyzed your 4 active marketing campaigns. Our average portfolio ROAS is outstanding at 8.08x. Ask me to diagnose daily snapshots, check A/B test results, or craft brand-new platform-native creatives!' }
  ],
  isGeneratingContent: false,
  isGeneratingReport: false,
  reportProgress: 0,
  generatedReportLink: null
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload }
    case 'SET_PLATFORM_FILTER':
      return { ...state, platformFilter: action.payload }
    case 'SET_STATUS_FILTER':
      return { ...state, statusFilter: action.payload }
    
    // UI Panels
    case 'SET_ACTIVE_PANEL':
      return { ...state, ui: { ...state.ui, activePanelType: action.payload.type, editingItem: action.payload.item || null } }
    case 'CLOSE_PANEL':
      return { ...state, ui: { ...state.ui, activePanelType: null, editingItem: null } }
    case 'SET_OAUTH_STEP':
      return { ...state, ui: { ...state.ui, oauthStep: action.payload } }

    // Campaigns CRUD
    case 'ADD_CAMPAIGN':
      return { 
        ...state, 
        campaigns: [{...action.payload, sync_status: 'PENDING', deletedAt: null}, ...state.campaigns],
        ui: { ...state.ui, activePanelType: null }
      }
    case 'UPDATE_CAMPAIGN':
      return {
        ...state,
        campaigns: state.campaigns.map(c => c.id === action.payload.id ? { ...action.payload, sync_status: 'PENDING' } : c)
      }
    case 'DELETE_CAMPAIGN':
      return {
        ...state,
        campaigns: state.campaigns.map(c => c.id === action.payload ? { ...c, deletedAt: new Date().toISOString() } : c),
        ui: { ...state.ui, confirmDialog: { ...state.ui.confirmDialog, isOpen: false } }
      }

    // AdSets CRUD
    case 'ADD_ADSET':
      return { ...state, adSets: [{...action.payload, sync_status: 'PENDING', deletedAt: null}, ...state.adSets], ui: { ...state.ui, activePanelType: null } }
    case 'UPDATE_ADSET':
      return { ...state, adSets: state.adSets.map(a => a.id === action.payload.id ? { ...action.payload, sync_status: 'PENDING' } : a) }
    case 'DELETE_ADSET':
      return { ...state, adSets: state.adSets.map(a => a.id === action.payload ? { ...a, deletedAt: new Date().toISOString() } : a), ui: { ...state.ui, confirmDialog: { ...state.ui.confirmDialog, isOpen: false } } }

    // Ads CRUD
    case 'ADD_AD':
      return { ...state, ads: [{...action.payload, sync_status: 'PENDING', deletedAt: null}, ...state.ads], ui: { ...state.ui, activePanelType: null } }
    case 'UPDATE_AD':
      return { ...state, ads: state.ads.map(a => a.id === action.payload.id ? { ...action.payload, sync_status: 'PENDING' } : a) }
    case 'DELETE_AD':
      return { ...state, ads: state.ads.map(a => a.id === action.payload ? { ...a, deletedAt: new Date().toISOString() } : a), ui: { ...state.ui, confirmDialog: { ...state.ui.confirmDialog, isOpen: false } } }

    case 'OPEN_CONFIRM':
      return { ...state, ui: { ...state.ui, confirmDialog: { isOpen: true, ...action.payload } } }
    case 'CLOSE_CONFIRM':
      return { ...state, ui: { ...state.ui, confirmDialog: { ...state.ui.confirmDialog, isOpen: false } } }
    case 'SYNC_SUCCESS': {
      const { entityType, id } = action.payload
      return {
        ...state,
        [entityType]: state[entityType].map(item => item.id === id ? { ...item, sync_status: 'SYNCED', ...(entityType === 'ads' ? { review_status: 'IN_REVIEW' } : {}) } : item)
      }
    }
    case 'SET_AD_APPROVED':
      return { ...state, ads: state.ads.map(a => a.id === action.payload ? { ...a, review_status: 'APPROVED', status: 'Active' } : a) }
    case 'SET_AD_REJECTED':
      return { ...state, ads: state.ads.map(a => a.id === action.payload.id ? { ...a, review_status: 'REJECTED', rejection_reason: action.payload.reason, status: 'Draft' } : a) }
    case 'TOGGLE_AD_STATUS':
      return { ...state, ads: state.ads.map(a => a.id === action.payload ? { ...a, status: a.status === 'Active' ? 'Paused' : 'Active' } : a) }

    // Integrations CRUD
    case 'CONNECT_ACCOUNT':
      return { ...state, integrations: state.integrations.map(i => i.platform === action.payload.platform ? { ...i, accounts: [...i.accounts, action.payload.account] } : i) }
    case 'DISCONNECT_ACCOUNT':
      return { ...state, integrations: state.integrations.map(i => i.platform === action.payload.platform ? { ...i, accounts: i.accounts.filter(a => a.id !== action.payload.accountId) } : i) }
    case 'UPDATE_SYNC_SETTINGS':
      return { ...state, integrations: state.integrations.map(i => i.platform === action.payload.platform ? { ...i, syncSettings: action.payload.syncSettings } : i) }

    // Analytics CRUD
    case 'ADD_SNAPSHOT':
      return { ...state, analytics: [action.payload, ...state.analytics] }
    case 'UPDATE_SNAPSHOT':
      return { ...state, analytics: state.analytics.map(a => a.id === action.payload.id ? action.payload : a) }
    case 'DELETE_SNAPSHOT':
      return { ...state, analytics: state.analytics.filter(a => a.id !== action.payload) }

    // Content Pieces CRUD
    case 'ADD_CONTENT':
      return { ...state, contentPieces: [action.payload, ...state.contentPieces] }
    case 'UPDATE_CONTENT':
      return { ...state, contentPieces: state.contentPieces.map(cp => cp.id === action.payload.id ? action.payload : cp) }
    case 'DELETE_CONTENT':
      return { ...state, contentPieces: state.contentPieces.filter(cp => cp.id !== action.payload) }
    case 'TOGGLE_BOOKMARK_CONTENT':
      return {
        ...state,
        contentPieces: state.contentPieces.map(cp => 
          cp.id === action.payload ? { ...cp, bookmarked: !cp.bookmarked } : cp
        )
      }

    // A/B Tests CRUD
    case 'ADD_ABTEST':
      return { ...state, abTests: [action.payload, ...state.abTests] }
    case 'UPDATE_ABTEST':
      return { ...state, abTests: state.abTests.map(t => t.id === action.payload.id ? action.payload : t) }
    case 'DELETE_ABTEST':
      return { ...state, abTests: state.abTests.filter(t => t.id !== action.payload) }

    // General
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.payload] }
    case 'SET_GENERATING_CONTENT':
      return { ...state, isGeneratingContent: action.payload }
    case 'SET_GENERATING_REPORT':
      return { ...state, isGeneratingReport: action.payload }
    case 'SET_REPORT_PROGRESS':
      return { ...state, reportProgress: action.payload }
    case 'SET_REPORT_LINK':
      return { ...state, generatedReportLink: action.payload }
    default:
      return state
  }
}

// ==========================================
// REUSABLE PRESENTATIONAL METRICS
// ==========================================

const StatusBadge = ({ status }) => {
  const styles = {
    Active: 'bg-green-50 text-green-700 border-green-200/80',
    Paused: 'bg-slate-50 text-slate-500 border-slate-200/80',
    Optimizing: 'bg-blue-50 text-blue-600 border-blue-200/80'
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mona ${styles[status] || styles.Paused}`}>
      <span className={`w-1 h-1 rounded-full mr-1.5 ${status === 'Active' ? 'bg-green-500' : status === 'Optimizing' ? 'bg-blue-500' : 'bg-slate-400'}`} />
      {status}
    </span>
  )
}

const SyncBadge = ({ sync_status }) => {
  const isSyncing = sync_status === 'PENDING'
  if (!sync_status) return null
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ml-2 ${isSyncing ? 'bg-slate-50 text-slate-500 border-slate-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
      {isSyncing ? 'Syncing...' : 'Synced'}
    </span>
  )
}

const AdStatusBadge = ({ ad }) => {
  if (ad.review_status === 'REJECTED') return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border bg-red-50 text-red-700 border-red-200">Rejected</span>
  if (ad.review_status === 'IN_REVIEW') return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border bg-blue-50 text-blue-700 border-blue-200">Pending Review</span>
  if (ad.sync_status === 'PENDING') return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border bg-slate-50 text-slate-500 border-slate-200">Syncing...</span>
  if (ad.status === 'Active') return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border bg-green-50 text-green-700 border-green-200">Active</span>
  if (ad.status === 'Paused') return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border bg-yellow-50 text-yellow-700 border-yellow-200">Paused</span>
  if (ad.status === 'Draft') return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border bg-gray-50 text-gray-700 border-gray-200">Draft</span>
  return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border bg-slate-50 text-slate-500 border-slate-200">{ad.status}</span>
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl shadow-lg text-xs font-semibold font-mona">
        <p className="text-[#0F172A] mb-1 font-bold">{label}</p>
        {payload.map((item, idx) => (
          <p key={idx} style={{ color: item.color }} className="flex justify-between gap-6 py-0.5">
            <span className="text-[#475569]">{item.name}:</span>
            <span className="font-bold">
              {item.name === 'ROAS' ? `${item.value}x` : `$${item.value.toLocaleString()}`}
            </span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

const KPICard = ({ title, value, change, isPositive, suffix = '', prefix = '', icon: Icon, color = 'text-[#FF2D20]' }) => {
  return (
    <div className="bg-[#F8FAFC] rounded-xl p-5 border border-[#E2E8F0] shadow-sm text-left flex flex-col justify-between hover:shadow-md transition-all duration-300">
      <div>
        <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1 font-mona">{title}</span>
        <span className="text-2xl font-extrabold text-[#0F172A] font-mona block mb-1" style={{ fontVariationSettings: "'wdth' 100, 'wght' 600" }}>
          {prefix}{value.toLocaleString(undefined, { minimumFractionDigits: typeof value === 'number' && !Number.isInteger(value) ? 2 : 0, maximumFractionDigits: 2 })}{suffix}
        </span>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className={`inline-flex items-center text-xs font-bold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
          {isPositive ? <ArrowUpIcon className="w-3.5 h-3.5 mr-0.5 shrink-0" /> : <ArrowDownIcon className="w-3.5 h-3.5 mr-0.5 shrink-0" />}
          {isPositive ? '↑' : '↓'} {change}% vs last period
        </span>
        <div className={`p-1.5 bg-white border border-[#E2E8F0] rounded-lg ${color}`}>
          <Icon className="w-4 h-4 stroke-[1.5]" />
        </div>
      </div>
    </div>
  )
}

// ==========================================
// MAIN DASHBOARD COMPONENT
// ==========================================

export default function Dashboard({ onLogout, onOpenProfile, user }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const location = useLocation()
  const navigate = useNavigate()
  
  // Determine active view for sidebar highlighting
  const currentPath = location.pathname
  let sidebarActive = 'dashboard'
  if (currentPath.startsWith('/campaigns')) sidebarActive = 'campaigns'
  else if (currentPath.startsWith('/advisor')) sidebarActive = 'advisor'
  else if (currentPath.startsWith('/reports')) sidebarActive = 'reports'
  else if (currentPath.startsWith('/integrations')) sidebarActive = 'integrations'

  // Extract params via matchPath since we are keeping the massive inline code intact 
  // as per "untouched" requirement for existing campaign list/detail.

  
  const campaignMatch = matchPath('/campaigns/:id/*', currentPath)
  const adSetMatch = matchPath('/campaigns/:id/adsets/:adSetId/ads', currentPath)
  const selectedCampaignId = campaignMatch ? Number(campaignMatch.params.id) : null
  const selectedAdSetId = adSetMatch ? Number(adSetMatch.params.adSetId) : null

  const [showRevenue, setShowRevenue] = useState(true)

  const activeCampaigns = state.campaigns.filter(c => !c.deletedAt)
  const activeAdSets = state.adSets.filter(a => !a.deletedAt)
  const activeAds = state.ads.filter(a => !a.deletedAt)

  // Platform Icon Helper
  const getPlatformIcon = (platform) => {
    switch(platform) {
      case 'Google': return <MagnifyingGlassIcon className="w-3 h-3 inline-block mr-1" />
      case 'Meta': return <ChatBubbleBottomCenterIcon className="w-3 h-3 inline-block mr-1" />
      case 'Snapchat': return <VideoCameraIcon className="w-3 h-3 inline-block mr-1" />
      case 'Email': return <AtSymbolIcon className="w-3 h-3 inline-block mr-1" />
      default: return null
    }
  }

  // Relational Campaign aggregators
  const campaignStats = useMemo(() => {
    return activeCampaigns.map(camp => {
      const relatedAnalytics = state.analytics.filter(a => a.campaignId === camp.id)
      
      const totalSpend = relatedAnalytics.reduce((sum, a) => sum + a.spend, 0)
      const totalRevenue = relatedAnalytics.reduce((sum, a) => sum + a.revenue, 0)
      const totalImpressions = relatedAnalytics.reduce((sum, a) => sum + a.impressions, 0)
      const totalClicks = relatedAnalytics.reduce((sum, a) => sum + a.clicks, 0)
      const totalLeads = relatedAnalytics.reduce((sum, a) => sum + a.leads, 0)
      
      const roas = totalSpend > 0 ? +(totalRevenue / totalSpend).toFixed(2) : 0
      const ctr = totalImpressions > 0 ? +((totalClicks / totalImpressions) * 100).toFixed(2) : 0
      const cpa = totalLeads > 0 ? +(totalSpend / totalLeads).toFixed(2) : 0

      return {
        ...camp,
        totalSpend,
        totalRevenue,
        totalImpressions,
        totalClicks,
        totalLeads,
        roas,
        ctr,
        cpa
      }
    })
  }, [state.campaigns, state.analytics])

  // Consolidated global statistics
  const portfolioStats = useMemo(() => {
    const totalSpend = campaignStats.reduce((sum, c) => sum + c.totalSpend, 0)
    const totalRevenue = campaignStats.reduce((sum, c) => sum + c.totalRevenue, 0)
    const totalImpressions = campaignStats.reduce((sum, c) => sum + c.totalImpressions, 0)
    const totalClicks = campaignStats.reduce((sum, c) => sum + c.totalClicks, 0)
    const totalLeads = campaignStats.reduce((sum, c) => sum + c.totalLeads, 0)

    const roas = totalSpend > 0 ? +(totalRevenue / totalSpend).toFixed(2) : 0
    const ctr = totalImpressions > 0 ? +((totalClicks / totalImpressions) * 100).toFixed(2) : 0
    const cpa = totalLeads > 0 ? +(totalSpend / totalLeads).toFixed(2) : 0
    const budgetLimit = activeCampaigns.reduce((sum, c) => sum + c.budget, 0)

    return {
      totalSpend,
      totalRevenue,
      totalImpressions,
      totalClicks,
      totalLeads,
      roas,
      ctr,
      cpa,
      budgetLimit
    }
  }, [campaignStats, state.campaigns])

  const selectedCampaign = useMemo(() => {
    if (!state.selectedCampaignId) return null
    return campaignStats.find(c => c.id === state.selectedCampaignId) || null
  }, [campaignStats, state.selectedCampaignId])

  const consolidatedDailyChartData = useMemo(() => {
    const dailyMap = {}
    state.analytics.forEach(snap => {
      if (!dailyMap[snap.date]) {
        dailyMap[snap.date] = { date: snap.date, spend: 0, revenue: 0 }
      }
      dailyMap[snap.date].spend += snap.spend
      dailyMap[snap.date].revenue += snap.revenue
    })

    return Object.values(dailyMap)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(d => ({
        day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
        dateStr: d.date,
        spend: d.spend,
        revenue: d.revenue,
        roas: d.spend > 0 ? +(d.revenue / d.spend).toFixed(2) : 0
      }))
  }, [state.analytics])

  const trafficShareData = useMemo(() => {
    const platformData = {}
    campaignStats.forEach(c => {
      if (!platformData[c.platform]) {
        platformData[c.platform] = 0
      }
      platformData[c.platform] += c.totalSpend
    })

    const total = Object.values(platformData).reduce((sum, val) => sum + val, 0) || 1
    const colors = { Google: '#3B82F6', Meta: '#FF2D20', TikTok: '#8B5CF6', Email: '#22C55E' }
    
    return Object.keys(platformData).map(plat => ({
      name: `${plat} Ads`,
      value: Math.round((platformData[plat] / total) * 100),
      color: colors[plat] || '#64748B'
    }))
  }, [campaignStats])

  const filteredCampaigns = useMemo(() => {
    return campaignStats.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(state.searchQuery.toLowerCase())
      const matchesPlatform = state.platformFilter === 'All' || c.platform === state.platformFilter
      const matchesStatus = state.statusFilter === 'All' || c.status === state.statusFilter
      return matchesSearch && matchesPlatform && matchesStatus
    })
  }, [campaignStats, state.searchQuery, state.platformFilter, state.statusFilter])

  // Sub tab views within Campaign Workspace
  const [workspaceTab, setWorkspaceTab] = useState('analytics') // 'analytics', 'content', 'ab_testing'
  
  // Snapshots form
  const [newSnapDate, setNewSnapDate] = useState('')
  const [newSnapSpend, setNewSnapSpend] = useState('')
  const [newSnapRevenue, setNewSnapRevenue] = useState('')
  const [newSnapImpressions, setNewSnapImpressions] = useState('')
  const [newSnapClicks, setNewSnapClicks] = useState('')
  const [newSnapLeads, setNewSnapLeads] = useState('')
  const [editingSnapshotId, setEditingSnapshotId] = useState(null)
  const [editSnapVal, setEditSnapVal] = useState({})

  // Content generator form
  const [genTone, setGenTone] = useState('Persuasive')
  const [genKeywords, setGenKeywords] = useState('')
  const [genType, setGenType] = useState('Ad Copy')
  const [editingContentId, setEditingContentId] = useState(null)
  const [editContentText, setEditContentText] = useState('')

  // A/B test form
  const [newABName, setNewABName] = useState('')
  const [newABVarA, setNewABVarA] = useState('')
  const [newABVarB, setNewABVarB] = useState('')

  // Campaign create form
  const [newCampName, setNewCampName] = useState('')
  const [newCampPlatform, setNewCampPlatform] = useState('Google')
  const [newCampBudget, setNewCampBudget] = useState('')
  const [newCampStart, setNewCampStart] = useState('')
  const [newCampEnd, setNewCampEnd] = useState('')

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleLaunchCampaign = (e) => {
    e.preventDefault()
    if (!newCampName.trim() || !newCampBudget) return

    const newCampId = Date.now()
    const budgetVal = parseFloat(newCampBudget)
    const newCamp = {
      id: newCampId,
      name: newCampName,
      platform: newCampPlatform,
      status: 'Active',
      budget: budgetVal,
      startDate: newCampStart || '2026-06-01',
      endDate: newCampEnd || '2026-07-01'
    }

    dispatch({ type: 'ADD_CAMPAIGN', payload: newCamp })

    // Auto populate 3 snapshots
    const baseImpressions = Math.round(budgetVal * 4.5)
    const baseSpend = Math.round(budgetVal * 0.15)
    
    for (let i = 2; i >= 0; i--) {
      const snapDate = new Date()
      snapDate.setDate(snapDate.getDate() - i)
      const dayStr = snapDate.toISOString().split('T')[0]
      const multiplier = 0.8 + Math.random() * 0.4
      const clicks = Math.round(baseImpressions * 0.04 * multiplier)
      const leads = Math.round(clicks * 0.08 * multiplier)

      dispatch({
        type: 'ADD_SNAPSHOT',
        payload: {
          id: Date.now() + i * 100,
          campaignId: newCampId,
          date: dayStr,
          spend: Math.round(baseSpend * multiplier),
          revenue: Math.round(baseSpend * multiplier * (5.5 + Math.random() * 3.5)),
          impressions: Math.round(baseImpressions * multiplier),
          clicks,
          leads
        }
      })
    }

    dispatch({
      type: 'ADD_CONTENT',
      payload: {
        id: Date.now() + 500,
        campaignId: newCampId,
        platform: newCampPlatform,
        type: 'Ad Copy',
        title: 'Initial Predicted Ad Variation',
        text: `Launch boost for ${newCampName}! Start scaling on ${newCampPlatform} Ads with high performance predictability. Generated by MarketMind AI context models.`,
        bookmarked: false
      }
    })

    setNewCampName('')
    setNewCampBudget('')
    setNewCampStart('')
    setNewCampEnd('')
  }

  const submitEditCampaign = (e) => {
    e.preventDefault()
    if (!editingCampaign) return
    dispatch({ type: 'UPDATE_CAMPAIGN', payload: editingCampaign })
    setEditingCampaign(null)
  }

  const handleAddSnapshot = (e) => {
    e.preventDefault()
    if (!newSnapDate || !newSnapSpend || !newSnapRevenue) return

    const newSnap = {
      id: Date.now(),
      campaignId: state.selectedCampaignId,
      date: newSnapDate,
      spend: parseFloat(newSnapSpend),
      revenue: parseFloat(newSnapRevenue),
      impressions: parseInt(newSnapImpressions) || 0,
      clicks: parseInt(newSnapClicks) || 0,
      leads: parseInt(newSnapLeads) || 0
    }

    dispatch({ type: 'ADD_SNAPSHOT', payload: newSnap })
    setNewSnapDate('')
    setNewSnapSpend('')
    setNewSnapRevenue('')
    setNewSnapImpressions('')
    setNewSnapClicks('')
    setNewSnapLeads('')
  }

  const startEditSnapshot = (snap) => {
    setEditingSnapshotId(snap.id)
    setEditSnapVal({ ...snap })
  }

  const saveEditedSnapshot = () => {
    dispatch({ type: 'UPDATE_SNAPSHOT', payload: editSnapVal })
    setEditingSnapshotId(null)
  }

  const handleAIContentGeneration = (e) => {
    e.preventDefault()
    if (!genKeywords.trim() || !selectedCampaign) return

    dispatch({ type: 'SET_GENERATING_CONTENT', payload: true })
    setTimeout(() => {
      const newPiece = {
        id: Date.now(),
        campaignId: selectedCampaign.id,
        platform: selectedCampaign.platform,
        type: genType,
        title: `AI Synthesized ${genType} Variation`,
        text: `Boost conversions in your "${selectedCampaign.name}" with platform-native copy context focusing on "${genKeywords}". Highly optimized engagement scores predicted.`,
        bookmarked: false
      }

      dispatch({ type: 'ADD_CONTENT', payload: newPiece })
      dispatch({ type: 'SET_GENERATING_CONTENT', payload: false })
      setGenKeywords('')
    }, 1200)
  }

  const saveContentEdit = (cp) => {
    dispatch({ type: 'UPDATE_CONTENT', payload: { ...cp, text: editContentText } })
    setEditingContentId(null)
  }

  const handleAddABTest = (e) => {
    e.preventDefault()
    if (!newABName.trim() || !newABVarA.trim() || !newABVarB.trim()) return

    const newTest = {
      id: Date.now(),
      campaignId: state.selectedCampaignId,
      name: newABName,
      variantA: newABVarA,
      variantB: newABVarB,
      splitRatio: '50/50',
      clicksA: 0,
      clicksB: 0,
      impressionsA: 0,
      impressionsB: 0,
      status: 'Running',
      winner: null
    }

    dispatch({ type: 'ADD_ABTEST', payload: newTest })
    setNewABName('')
    setNewABVarA('')
    setNewABVarB('')
  }

  const handleSimulateSplitEngagement = (testId) => {
    const test = state.abTests.find(t => t.id === testId)
    if (!test || test.status === 'Completed') return

    const impA = test.impressionsA + Math.round(400 + Math.random() * 400)
    const impB = test.impressionsB + Math.round(400 + Math.random() * 400)
    const rateA = 0.02 + Math.random() * 0.025
    const rateB = 0.025 + Math.random() * 0.035
    const clickA = test.clicksA + Math.round(impA * rateA)
    const clickB = test.clicksB + Math.round(impB * rateB)

    dispatch({
      type: 'UPDATE_ABTEST',
      payload: { ...test, impressionsA: impA, impressionsB: impB, clicksA: clickA, clicksB: clickB }
    })
  }

  const handleSetWinner = (testId, winnerStr) => {
    const test = state.abTests.find(t => t.id === testId)
    if (!test) return

    dispatch({
      type: 'UPDATE_ABTEST',
      payload: { ...test, status: 'Completed', winner: winnerStr }
    })

    dispatch({
      type: 'ADD_CONTENT',
      payload: {
        id: Date.now(),
        campaignId: test.campaignId,
        platform: selectedCampaign?.platform || 'Google',
        type: 'Ad Copy',
        title: `🏆 Winner creative: ${test.name}`,
        text: winnerStr === 'Variant A' ? test.variantA : test.variantB,
        bookmarked: true
      }
    })
  }

  const [chatInput, setChatInput] = useState('')
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMsg = { sender: 'user', text: chatInput }
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMsg })
    setChatInput('')

    setTimeout(() => {
      let replyText = "I'm ready to evaluate your marketing workspace parameters. Ask me to diagnose ROAS trends, check CPA efficiency, or run split testing forecasts."
      const lowInput = chatInput.toLowerCase()
      
      if (lowInput.includes('roas') || lowInput.includes('revenue')) {
        replyText = `Our unified portfolio ROAS is currently running high at ${portfolioStats.roas}x, fueled by $${portfolioStats.totalRevenue.toLocaleString()} in calculated revenue. Google Summer Performance leads with an individual ROAS of ${campaignStats[0]?.roas}x.`
      } else if (lowInput.includes('spend') || lowInput.includes('budget') || lowInput.includes('allocation')) {
        const usage = Math.round((portfolioStats.totalSpend / (portfolioStats.budgetLimit || 1)) * 100)
        replyText = `We have utilized $${portfolioStats.totalSpend.toLocaleString()} (${usage}%) of our global $${portfolioStats.budgetLimit.toLocaleString()} in-memory cap. Meta Retargeting has spent $${campaignStats[1]?.totalSpend.toLocaleString()}, representing a highly efficient channel.`
      } else if (lowInput.includes('tiktok') || lowInput.includes('viral')) {
        const tik = campaignStats.find(c => c.platform === 'TikTok')
        replyText = tik 
          ? `The "${tik.name}" campaign is currently ${tik.status} with a calculated CPA of $${tik.cpa}. It has gathered ${tik.totalLeads} conversion leads across ${tik.totalImpressions.toLocaleString()} views.`
          : 'I cannot find any TikTok active campaign in our current relational state tree.'
      }

      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { sender: 'ai', text: replyText } })
    }, 1200)
  }

  const handleGenerateReport = () => {
    dispatch({ type: 'SET_GENERATING_REPORT', payload: true })
    dispatch({ type: 'SET_REPORT_PROGRESS', payload: 0 })
    dispatch({ type: 'SET_REPORT_LINK', payload: null })

    let progress = 0
    const interval = setInterval(() => {
      progress += 25
      dispatch({ type: 'SET_REPORT_PROGRESS', payload: progress })

      if (progress >= 100) {
        clearInterval(interval)
        dispatch({ type: 'SET_GENERATING_REPORT', payload: false })
        dispatch({ type: 'SET_REPORT_LINK', payload: `https://marketmind.ai/exports/report_fyp_${Date.now()}.pdf` })
      }
    }, 300)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-mona text-[#0F172A] antialiased overflow-hidden">
      {/* ==========================================
          SIDEBAR: CLEAN WHITE LIGHT THEME
          ========================================== */}
      <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col justify-between shrink-0 z-30 relative shadow-sm">
        <div>
          {/* Logo Header */}
          <div className="h-16 flex items-center px-6 border-b border-[#E2E8F0] select-none">
            <span className="font-mona font-bold text-lg tracking-tight">
              MarketMind<span className="text-[#FF2D20] font-black">AI</span>
            </span>
            <span className="text-[9px] font-bold text-[#FF2D20] border border-[#FF2D20]/30 rounded px-1 ml-2 uppercase">Console</span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {[
              { id: 'dashboard', path: '/dashboard', label: 'Overview Canvas', icon: PresentationChartLineIcon },
              { id: 'campaigns', path: '/campaigns', label: 'Campaign Hub', icon: ChartBarIcon },
              { id: 'advisor', path: '/advisor', label: 'AI Advisor Chat', icon: ChatBubbleLeftRightIcon },
              { id: 'reports', path: '/reports', label: 'Reports Export', icon: DocumentArrowDownIcon },
              { id: 'integrations', path: '/integrations', label: 'Platform Integrations', icon: PuzzlePieceIcon }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer border ${
                  sidebarActive === tab.id 
                    ? 'bg-[#FFF1F0] border-[#FF2D20]/20 text-[#FF2D20] font-semibold' 
                    : 'bg-white border-transparent text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                }`}
              >
                <tab.icon className="w-4.5 h-4.5 stroke-[1.5]" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-[#E2E8F0]">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#475569] hover:bg-[#FFF1F0] hover:text-[#FF2D20] transition-colors cursor-pointer"
          >
            <ArrowLeftOnRectangleIcon className="w-4.5 h-4.5 stroke-[1.5] text-red-500" />
            Sign Out Console
          </button>
        </div>
      </aside>

      {/* ==========================================
          MAIN CONTAINER
          ========================================== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative h-screen">
        {/* Top bar header */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider font-mona">
              MarketMind SaaS Dashboard
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-bold text-green-500 uppercase">● Live Preview Connection</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
              <span className="text-xs font-semibold text-[#0F172A]">{user ? user.name : 'Rashid (FYP Marketer)'}</span>
              <span className="text-[9px] font-bold text-[#FF2D20] uppercase tracking-widest mt-0.5">Enterprise Admin</span>
            </div>
            <button 
              onClick={onOpenProfile}
              title="Open Profile"
              className="w-8 h-8 rounded-full bg-[#FFF1F0] border border-[#FECACA] flex items-center justify-center font-bold text-xs text-[#FF2D20] hover:bg-[#FF2D20] hover:text-white transition-colors cursor-pointer"
            >
              {user && user.name ? user.name.charAt(0).toUpperCase() : 'R'}
            </button>
          </div>
        </header>

        {/* Content body padding container */}
        <div className="p-8 flex-1 max-w-7xl w-full mx-auto space-y-8">
          
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* ==========================================
                VIEW 1: OVERVIEW CANVAS
                ========================================== */}
            <Route path="/dashboard" element={
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              {/* Titles */}
              <div>
                <h2 className="text-2xl font-semibold text-[#0F172A] tracking-tight font-mona" style={{ fontVariationSettings: "'wdth' 100, 'wght' 550" }}>
                  A Dashboard Built for <span className="text-[#FF2D20]">Real Decisions</span>
                </h2>
                <p className="text-sm font-medium text-[#475569] mt-1">Not vanity metrics. Actionable KPIs and unified ad spend attribution.</p>
              </div>

              {/* Stat Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="Total Ad Spend" value={portfolioStats.totalSpend} change={8.2} isPositive={false} prefix="$" icon={CircleStackIcon} color="text-blue-600" />
                <KPICard title="Attributed Revenue" value={portfolioStats.totalRevenue} change={31.4} isPositive={true} prefix="$" icon={ArrowTrendingUpIcon} color="text-green-600" />
                <KPICard title="Average ROAS" value={portfolioStats.roas} change={5.9} isPositive={true} suffix="x" icon={ChartBarIcon} color="text-[#FF2D20]" />
                <KPICard title="Portfolio CTR" value={portfolioStats.ctr} change={12.4} isPositive={true} suffix="%" icon={CursorArrowRaysIcon} color="text-purple-600" />
              </div>

              {/* Main Composed Chart Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left Line Chart Panel */}
                <div className="lg:col-span-3 border border-[#E2E8F0] rounded-2xl p-5 text-left bg-white shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-0.5">Campaign Performance</span>
                      <span className="text-sm font-bold text-[#0F172A] block font-mona">Revenue vs Ad Spend (Daily Metrics)</span>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setShowRevenue(true)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer border ${
                          showRevenue ? 'bg-[#FF2D20] text-white border-transparent' : 'bg-white border-[#E2E8F0] text-[#475569]'
                        }`}
                      >
                        Revenue
                      </button>
                      <button
                        onClick={() => setShowRevenue(false)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer border ${
                          !showRevenue ? 'bg-[#FF2D20] text-white border-transparent' : 'bg-white border-[#E2E8F0] text-[#475569]'
                        }`}
                      >
                        ROAS
                      </button>
                    </div>
                  </div>

                  <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={consolidatedDailyChartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                        <XAxis dataKey="day" stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="spend" name="Ad Spend" fill="#EFF6FF" stroke="#3B82F6" strokeWidth={1} radius={[2, 2, 0, 0]} barSize={24} />
                        {showRevenue ? (
                          <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#FF2D20" strokeWidth={2} dot={false} />
                        ) : (
                          <Line type="monotone" dataKey="roas" name="ROAS" stroke="#10B981" strokeWidth={2} dot={false} />
                        )}
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Right Pie Attribution Chart Panel */}
                <div className="lg:col-span-2 border border-[#E2E8F0] rounded-2xl p-5 text-left bg-white shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-0.5">Traffic Source Attribution</span>
                    <span className="text-sm font-bold text-[#0F172A] block font-mona">Attributed Sales Channels</span>
                  </div>

                  <div className="relative w-full h-44 flex items-center justify-center my-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={trafficShareData} cx="50%" cy="50%" innerRadius={42} outerRadius={60} paddingAngle={3} dataKey="value">
                          {trafficShareData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-base font-bold text-[#0F172A]">${portfolioStats.totalSpend.toLocaleString()}</span>
                      <span className="text-[8px] font-bold text-[#94A3B8] uppercase mt-0.5">Total Spent</span>
                    </div>
                  </div>

                  {/* Clean details list */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E2E8F0]">
                    {trafficShareData.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] font-semibold text-[#475569]">
                        <span className="w-2.5 h-2.5 rounded shrink-0 shadow-sm" style={{ backgroundColor: item.color }} />
                        <span className="truncate">{item.name}: {item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          } />
            {/* ==========================================
                VIEW 2: CAMPAIGN HUB
                ========================================== */}
            <Route path="/campaigns" element={
              <AnimatePresence mode="wait">
                <motion.div key="hub_master" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  {/* Title & trigger */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#0F172A] tracking-tight font-mona">Campaign Management Console</h2>
                      <p className="text-xs font-semibold text-[#94A3B8] mt-0.5">Control individual campaign budgets, platforms, and specific analytics relationships.</p>
                    </div>
                    <button
                      onClick={() => dispatch({ type: 'SET_ACTIVE_PANEL', payload: { type: 'campaign' } })}
                      className="bg-[#FF2D20] hover:bg-[#E5261A] text-white text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <PlusIcon className="w-4 h-4 shrink-0" />
                      Configure Campaign
                    </button>
                  </div>

                  {/* Filters and Inputs */}
                  <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                    <div className="relative flex-1">
                      <MagnifyingGlassIcon className="w-4.5 h-4.5 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search campaign label..."
                        value={state.searchQuery}
                        onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#FF2D20]"
                      />
                    </div>
                    
                    <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                      {['All', 'Google', 'Meta', 'TikTok', 'Email'].map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => dispatch({ type: 'SET_PLATFORM_FILTER', payload: p })}
                          className={`px-3 py-2 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                            state.platformFilter === p 
                              ? 'bg-[#FFF1F0] border-[#FF2D20]/20 text-[#FF2D20] font-bold' 
                              : 'bg-white border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Relational tabular listing */}
                  <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                            <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider pl-6 font-mona">Campaign Title</th>
                            <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider font-mona">Status</th>
                            <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider font-mona">Daily Spend</th>
                            <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider font-mona">Revenue</th>
                            <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider font-mona">Calculated ROAS</th>
                            <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider font-mona">CTR Ratio</th>
                            <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider pr-6 text-right font-mona">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E8F0]">
                          {filteredCampaigns.map((camp) => (
                            <tr key={camp.id} className="hover:bg-[#F8FAFC]/50 transition-colors cursor-pointer group">
                              <td onClick={() => dispatch({ type: 'ZOOM_CAMPAIGN', payload: camp.id })} className="p-4 pl-6">
                                <span className="block text-xs font-bold text-[#0F172A] group-hover:text-[#FF2D20] transition-colors">{camp.name}</span>
                                <span className="flex items-center text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest mt-0.5 font-mona">
                                  {getPlatformIcon(camp.platform)} {camp.platform} Network
                                </span>
                              </td>
                              <td onClick={() => dispatch({ type: 'ZOOM_CAMPAIGN', payload: camp.id })} className="p-4">
                                <StatusBadge status={camp.status} />
                                <SyncBadge sync_status={camp.sync_status} />
                              </td>
                              <td onClick={() => dispatch({ type: 'ZOOM_CAMPAIGN', payload: camp.id })} className="p-4 text-xs font-bold text-[#0F172A]">
                                ${camp.totalSpend.toLocaleString()}
                              </td>
                              <td onClick={() => dispatch({ type: 'ZOOM_CAMPAIGN', payload: camp.id })} className="p-4 text-xs font-bold text-[#0F172A]">
                                ${camp.totalRevenue.toLocaleString()}
                              </td>
                              <td onClick={() => dispatch({ type: 'ZOOM_CAMPAIGN', payload: camp.id })} className="p-4">
                                <span className="text-xs font-bold text-[#0F172A]">{camp.roas}x</span>
                              </td>
                              <td onClick={() => navigate(`/campaigns/${camp.id}`)} className="p-4">
                                <span className="text-xs font-bold text-[#FF2D20]">{camp.ctr}%</span>
                              </td>
                              <td className="p-4 pr-6 text-right">
                                <div className="inline-flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                                  <button
                                    onClick={() => dispatch({ type: 'SET_ACTIVE_PANEL', payload: { type: 'campaign', item: camp } })}
                                    className="p-1.5 hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] rounded-lg text-[#94A3B8] hover:text-blue-500 cursor-pointer transition-all"
                                  >
                                    <PencilIcon className="w-3.5 h-3.5 stroke-[1.5]" />
                                  </button>
                                  <button
                                    onClick={() => dispatch({ type: 'OPEN_CONFIRM', payload: { type: 'DELETE_CAMPAIGN', id: camp.id, title: 'Delete Campaign', message: 'Are you sure you want to delete this campaign? This action cannot be undone.' } })}
                                    className="p-1.5 hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] rounded-lg text-[#94A3B8] hover:text-red-500 cursor-pointer transition-all"
                                  >
                                    <TrashIcon className="w-3.5 h-3.5 stroke-[1.5]" />
                                  </button>
                                  <button
                                    onClick={() => navigate(`/campaigns/${camp.id}`)}
                                    className="p-1.5 hover:bg-[#FFF1F0] border border-transparent hover:border-[#FF2D20]/20 rounded-lg text-[#94A3B8] hover:text-[#FF2D20] cursor-pointer transition-all ml-1"
                                  >
                                    <ChevronRightIcon className="w-3.5 h-3.5 stroke-2" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            } />

            {/* SUB VIEW 2B: INDIVIDUAL CAMPAIGN WORKSPACE */}
            <Route path="/campaigns/:id/*" element={
              <AnimatePresence mode="wait">
                <motion.div key="hub_workspace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  {/* Top nav */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E8F0] pb-5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate('/campaigns')}
                        className="p-2 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-xl text-[#475569] shadow-sm cursor-pointer transition-all"
                      >
                        <ArrowLeftIcon className="w-4 h-4 stroke-2" />
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-bold text-[#0F172A] font-mona leading-tight">{selectedCampaign?.name}</h2>
                          <span className="px-2 py-0.5 border border-[#E2E8F0] bg-[#F8FAFC] text-[#94A3B8] font-bold text-[9px] uppercase tracking-wide rounded-md font-mona">
                            {selectedCampaign?.platform} Ads
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-[#94A3B8] mt-0.5">
                          Campaign Lifecycle: {selectedCampaign?.startDate} to {selectedCampaign?.endDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={selectedCampaign?.status} />
                      <SyncBadge sync_status={selectedCampaign?.sync_status} />
                      <button
                        onClick={() => dispatch({ type: 'SET_ACTIVE_PANEL', payload: { type: 'campaign', item: selectedCampaign } })}
                        className="bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] text-[11px] font-semibold px-3 py-2 rounded-xl cursor-pointer transition-all shadow-sm inline-flex items-center gap-1"
                      >
                        <PencilIcon className="w-3.5 h-3.5 stroke-[1.5]" />
                        Edit Settings
                      </button>
                    </div>
                  </div>

                  {/* Consolidated Workspace Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard title="Revenue Generated" value={selectedCampaign?.totalRevenue || 0} change={12.4} isPositive={true} prefix="$" icon={ArrowTrendingUpIcon} color="text-green-600" />
                    <KPICard title="Spend Logged" value={selectedCampaign?.totalSpend || 0} change={6.8} isPositive={false} prefix="$" icon={CircleStackIcon} color="text-blue-600" />
                    <KPICard title="Calculated ROAS" value={selectedCampaign?.roas || 0} change={15.2} isPositive={true} suffix="x" icon={ChartBarIcon} color="text-[#FF2D20]" />
                    <KPICard title="Platform CTR" value={selectedCampaign?.ctr || 0} change={9.5} isPositive={true} suffix="%" icon={CursorArrowRaysIcon} color="text-purple-600" />
                  </div>

                  {/* Inner Tab bar navigation */}
                  <div className="flex overflow-x-auto no-scrollbar border-b border-[#E2E8F0]">
                    {[
                      { id: 'analytics', label: 'Analytics Logs', count: state.analytics.filter(a => a.campaignId === selectedCampaign?.id).length },
                      { id: 'adsets', label: 'Ad Sets', count: activeAdSets.filter(a => a.campaignId === selectedCampaign?.id).length },
                      { id: 'content', label: 'AI Creative Studio', count: state.contentPieces.filter(cp => cp.campaignId === selectedCampaign?.id).length },
                      { id: 'ab_testing', label: 'A/B Splitting', count: state.abTests.filter(t => t.campaignId === selectedCampaign?.id).length }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setWorkspaceTab(tab.id)}
                        className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
                          workspaceTab === tab.id 
                            ? 'border-[#FF2D20] text-[#FF2D20]' 
                            : 'border-transparent text-[#94A3B8] hover:text-[#475569]'
                        }`}
                      >
                        {tab.label}
                        <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${workspaceTab === tab.id ? 'bg-[#FFF1F0] text-[#FF2D20]' : 'bg-[#F8FAFC] text-[#94A3B8]'}`}>
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Tab Sub View components */}
                  <div className="pt-2">

                    {/* SUB TAB 1: ANALYTICS SNAPSHOTS CRUD */}
                    {workspaceTab === 'analytics' && (
                      <div className="space-y-6 animate-fadeIn">
                        {/* Area Chart trend */}
                        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
                          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-0.5">Workspace Analytics</span>
                          <span className="text-sm font-bold text-[#0F172A] block font-mona mb-4">Ad Spend vs Attributed Revenue</span>
                          <div className="w-full h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={
                                state.analytics
                                  .filter(a => a.campaignId === selectedCampaign?.id)
                                  .sort((a,b) => new Date(a.date) - new Date(b.date))
                              } margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                                <XAxis dataKey="date" stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="revenue" name="Daily Revenue" stroke="#FF2D20" strokeWidth={1.5} fill="#FFF1F0" fillOpacity={0.4} />
                                <Area type="monotone" dataKey="spend" name="Daily Spend" stroke="#3B82F6" strokeWidth={1.5} fill="none" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Relational snap logs list */}
                        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
                          <div className="p-4 border-b border-[#E2E8F0]">
                            <span className="text-xs font-bold text-[#0F172A] block font-mona">Daily Relational Entries</span>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                                  <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase pl-6 font-mona">Date</th>
                                  <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase font-mona">Spend</th>
                                  <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase font-mona">Revenue</th>
                                  <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase font-mona">ROAS</th>
                                  <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase font-mona">Clicks / Imps</th>
                                  <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase font-mona">Leads</th>
                                  <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase pr-6 text-right font-mona">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#E2E8F0]">
                                {state.analytics
                                  .filter(a => a.campaignId === selectedCampaign?.id)
                                  .sort((a,b) => new Date(b.date) - new Date(a.date))
                                  .map(snap => {
                                    const isEditing = editingSnapshotId === snap.id
                                    const snapROAS = snap.spend > 0 ? (snap.revenue / snap.spend).toFixed(1) : '0'

                                    return (
                                      <tr key={snap.id} className="hover:bg-[#F8FAFC]/50 transition-colors">
                                        <td className="p-4 pl-6 text-xs font-bold text-[#0F172A]">
                                          {isEditing ? (
                                            <input 
                                              type="date" 
                                              value={editSnapVal.date} 
                                              onChange={(e) => setEditSnapVal({ ...editSnapVal, date: e.target.value })}
                                              className="border border-[#E2E8F0] rounded px-2 py-1 text-xs font-semibold focus:outline-none"
                                            />
                                          ) : snap.date}
                                        </td>
                                        <td className="p-4 text-xs font-bold text-[#0F172A]">
                                          {isEditing ? (
                                            <input 
                                              type="number" 
                                              value={editSnapVal.spend} 
                                              onChange={(e) => setEditSnapVal({ ...editSnapVal, spend: parseFloat(e.target.value) || 0 })}
                                              className="border border-[#E2E8F0] rounded px-2 py-1 text-xs font-semibold w-20 focus:outline-none"
                                            />
                                          ) : `$${snap.spend.toLocaleString()}`}
                                        </td>
                                        <td className="p-4 text-xs font-bold text-[#0F172A]">
                                          {isEditing ? (
                                            <input 
                                              type="number" 
                                              value={editSnapVal.revenue} 
                                              onChange={(e) => setEditSnapVal({ ...editSnapVal, revenue: parseFloat(e.target.value) || 0 })}
                                              className="border border-[#E2E8F0] rounded px-2 py-1 text-xs font-semibold w-20 focus:outline-none"
                                            />
                                          ) : `$${snap.revenue.toLocaleString()}`}
                                        </td>
                                        <td className="p-4 text-xs font-extrabold text-[#0F172A]">{snapROAS}x</td>
                                        <td className="p-4 text-xs font-semibold text-[#475569]">
                                          {isEditing ? (
                                            <div className="flex gap-1">
                                              <input 
                                                type="number" 
                                                value={editSnapVal.clicks} 
                                                onChange={(e) => setEditSnapVal({ ...editSnapVal, clicks: parseInt(e.target.value) || 0 })}
                                                className="border border-[#E2E8F0] rounded px-1.5 py-1 text-xs font-semibold w-14 focus:outline-none"
                                              />
                                              <input 
                                                type="number" 
                                                value={editSnapVal.impressions} 
                                                onChange={(e) => setEditSnapVal({ ...editSnapVal, impressions: parseInt(e.target.value) || 0 })}
                                                className="border border-[#E2E8F0] rounded px-1.5 py-1 text-xs font-semibold w-16 focus:outline-none"
                                              />
                                            </div>
                                          ) : `${snap.clicks.toLocaleString()} / ${snap.impressions.toLocaleString()}`}
                                        </td>
                                        <td className="p-4 text-xs font-bold text-[#0F172A]">
                                          {isEditing ? (
                                            <input 
                                              type="number" 
                                              value={editSnapVal.leads} 
                                              onChange={(e) => setEditSnapVal({ ...editSnapVal, leads: parseInt(e.target.value) || 0 })}
                                              className="border border-[#E2E8F0] rounded px-2 py-1 text-xs font-semibold w-14 focus:outline-none"
                                            />
                                          ) : snap.leads.toLocaleString()}
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                          {isEditing ? (
                                            <div className="inline-flex gap-1">
                                              <button 
                                                onClick={saveEditedSnapshot}
                                                className="bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] uppercase px-2.5 py-1.5 rounded-lg cursor-pointer"
                                              >
                                                Save
                                              </button>
                                              <button 
                                                onClick={() => setEditingSnapshotId(null)}
                                                className="bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-slate-100 text-[#475569] font-bold text-[10px] uppercase px-2.5 py-1.5 rounded-lg cursor-pointer"
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                          ) : (
                                            <div className="inline-flex items-center gap-1">
                                              <button
                                                onClick={() => startEditSnapshot(snap)}
                                                className="p-1 hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] rounded-lg text-[#94A3B8] hover:text-blue-500 cursor-pointer transition-all"
                                              >
                                                <PencilIcon className="w-3.5 h-3.5 stroke-[1.5]" />
                                              </button>
                                              <button
                                                onClick={() => dispatch({ type: 'DELETE_SNAPSHOT', payload: snap.id })}
                                                className="p-1 hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] rounded-lg text-[#94A3B8] hover:text-red-500 cursor-pointer transition-all"
                                              >
                                                <TrashIcon className="w-3.5 h-3.5 stroke-[1.5]" />
                                              </button>
                                            </div>
                                          )}
                                        </td>
                                      </tr>
                                    )
                                  })}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Add Snap form */}
                        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
                          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-3 font-mona">Record Daily Performance Log</span>
                          <form onSubmit={handleAddSnapshot} className="grid grid-cols-2 md:grid-cols-6 gap-3 items-end">
                            <div>
                              <label className="block text-[9px] font-bold text-[#94A3B8] uppercase mb-1.5">Date</label>
                              <input 
                                type="date" 
                                value={newSnapDate}
                                onChange={(e) => setNewSnapDate(e.target.value)}
                                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF2D20] bg-white"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-[#94A3B8] uppercase mb-1.5">Spend ($)</label>
                              <input 
                                type="number" 
                                placeholder="150"
                                value={newSnapSpend}
                                onChange={(e) => setNewSnapSpend(e.target.value)}
                                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF2D20] bg-white"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-[#94A3B8] uppercase mb-1.5">Revenue ($)</label>
                              <input 
                                type="number" 
                                placeholder="1200"
                                value={newSnapRevenue}
                                onChange={(e) => setNewSnapRevenue(e.target.value)}
                                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF2D20] bg-white"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-[#94A3B8] uppercase mb-1.5">Impressions</label>
                              <input 
                                type="number" 
                                placeholder="5000"
                                value={newSnapImpressions}
                                onChange={(e) => setNewSnapImpressions(e.target.value)}
                                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-xs font-semibold focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-[#94A3B8] uppercase mb-1.5">Clicks</label>
                              <input 
                                type="number" 
                                placeholder="240"
                                value={newSnapClicks}
                                onChange={(e) => setNewSnapClicks(e.target.value)}
                                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-xs font-semibold focus:outline-none"
                              />
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <label className="block text-[9px] font-bold text-[#94A3B8] uppercase mb-1.5">Leads</label>
                                <input 
                                  type="number" 
                                  placeholder="18"
                                  value={newSnapLeads}
                                  onChange={(e) => setNewSnapLeads(e.target.value)}
                                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-xs font-semibold focus:outline-none"
                                />
                              </div>
                              <button 
                                type="submit"
                                className="bg-[#FF2D20] hover:bg-[#E5261A] text-white p-2 rounded-xl cursor-pointer transition-colors shrink-0 shadow-sm inline-flex items-center justify-center"
                              >
                                <PlusIcon className="w-4.5 h-4.5" />
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}

                    {/* SUB TAB 2: AD SETS */}
                    {workspaceTab === 'adsets' && (
                      <div className="space-y-6 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-0.5">Campaign Audiences</span>
                            <span className="text-sm font-bold text-[#0F172A] block font-mona">Ad Sets Management</span>
                          </div>
                          <button
                            onClick={() => dispatch({ type: 'SET_ACTIVE_PANEL', payload: { type: 'adset' } })}
                            className="bg-[#FF2D20] hover:bg-[#E5261A] text-white text-[11px] font-bold px-4 py-2 rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                          >
                            <PlusIcon className="w-4 h-4 shrink-0" />
                            Create Ad Set
                          </button>
                        </div>
                        
                        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
                          {activeAdSets.filter(a => a.campaignId === selectedCampaign?.id).length > 0 ? (
                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                                    <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider pl-6 font-mona">Ad Set Name</th>
                                    <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider font-mona">Audience Type</th>
                                    <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider font-mona">Status</th>
                                    <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider font-mona">Daily Budget</th>
                                    <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider font-mona">Spend Today</th>
                                    <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider font-mona">Goal</th>
                                    <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider text-right pr-6 font-mona">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {activeAdSets
                                    .filter(a => a.campaignId === selectedCampaign?.id)
                                    .map(adSet => (
                                      <tr key={adSet.id} onClick={() => navigate(`/campaigns/${selectedCampaign?.id}/adsets/${adSet.id}/ads`)} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors cursor-pointer group">
                                        <td className="p-4 pl-6 text-xs font-bold text-[#0F172A]">
                                          {adSet.name}
                                          <span className="block text-[10px] font-semibold text-[#94A3B8] mt-0.5">{adSet.platform}</span>
                                        </td>
                                        <td className="p-4 text-xs font-semibold text-[#475569]">{adSet.audienceType}</td>
                                        <td className="p-4"><StatusBadge status={adSet.status} /><SyncBadge sync_status={adSet.sync_status} /></td>
                                        <td className="p-4 text-xs font-bold text-[#0F172A]">${adSet.budget.toLocaleString()}</td>
                                        <td className="p-4 text-xs font-bold text-[#FF2D20]">${adSet.spendToday.toLocaleString()}</td>
                                        <td className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">{adSet.goal}</td>
                                        <td className="p-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                                          <div className="inline-flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                              onClick={() => dispatch({ type: 'SET_ACTIVE_PANEL', payload: { type: 'adset', item: adSet } })}
                                              className="p-1.5 hover:bg-white border border-transparent hover:border-[#E2E8F0] rounded-lg text-[#94A3B8] hover:text-blue-500 cursor-pointer transition-all shadow-sm"
                                            >
                                              <PencilIcon className="w-3.5 h-3.5 stroke-[1.5]" />
                                            </button>
                                            <button
                                              onClick={() => dispatch({ type: 'OPEN_CONFIRM', payload: { type: 'DELETE_ADSET', id: adSet.id, title: 'Delete Ad Set', message: 'Are you sure you want to delete this Ad Set? This action cannot be undone.' } })}
                                              className="p-1.5 hover:bg-white border border-transparent hover:border-[#E2E8F0] rounded-lg text-[#94A3B8] hover:text-red-500 cursor-pointer transition-all shadow-sm"
                                            >
                                              <TrashIcon className="w-3.5 h-3.5 stroke-[1.5]" />
                                            </button>
                                            <button
                                              onClick={() => navigate(`/campaigns/${selectedCampaign?.id}/adsets/${adSet.id}/ads`)}
                                              className="p-1.5 bg-[#FFF1F0] hover:bg-[#FF2D20] border border-transparent rounded-lg text-[#FF2D20] hover:text-white cursor-pointer transition-all ml-1 shadow-[0_1px_2px_rgba(255,45,32,0.1)]"
                                            >
                                              <ChevronRightIcon className="w-3.5 h-3.5 stroke-2" />
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="p-12 flex flex-col items-center justify-center text-center">
                              <div className="w-16 h-16 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl flex items-center justify-center mb-4 text-[#94A3B8]">
                                <CircleStackIcon className="w-8 h-8 stroke-[1.5]" />
                              </div>
                              <h3 className="text-sm font-bold text-[#0F172A] font-mona mb-1">No Ad Sets Configured</h3>
                              <p className="text-xs font-semibold text-[#94A3B8] max-w-xs mb-6">Create an ad set to define audience targeting, platform networks, and daily optimization goals.</p>
                              <button
                                onClick={() => dispatch({ type: 'SET_ACTIVE_PANEL', payload: { type: 'adset' } })}
                                className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] text-[#0F172A] text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-all shadow-sm"
                              >
                                Create First Ad Set
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* SUB TAB 3: AI CREATIVE STUDIO */}
                    {workspaceTab === 'content' && (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
                        {/* Left Generator form */}
                        <div className="lg:col-span-5 bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-sm self-start">
                          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-0.5">Studio Generator</span>
                          <span className="text-sm font-bold text-[#0F172A] block font-mona mb-5">Predictive AI Copywriter</span>
                          
                          <form onSubmit={handleAIContentGeneration} className="space-y-4">
                            <div>
                              <label className="block text-[9px] font-bold text-[#94A3B8] uppercase mb-1.5">Platform Target Focus</label>
                              <div className="grid grid-cols-3 gap-1.5">
                                {['Ad Copy', 'Caption', 'Video Script'].map((type, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setGenType(type)}
                                    className={`py-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer border ${
                                      genType === type 
                                        ? 'bg-[#FFF1F0] border-[#FF2D20]/20 text-[#FF2D20]' 
                                        : 'bg-white border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]'
                                    }`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-[9px] font-bold text-[#94A3B8] uppercase mb-1.5">Copywriter Tone</label>
                              <select 
                                value={genTone}
                                onChange={(e) => setGenTone(e.target.value)}
                                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#0F172A] bg-white focus:outline-none"
                              >
                                <option value="Persuasive">Persuasive Conversion</option>
                                <option value="Urgent">High Urgency Spark</option>
                                <option value="Educational">Educational Overview</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[9px] font-bold text-[#94A3B8] uppercase mb-1.5">Core Product Keywords</label>
                              <input
                                type="text"
                                placeholder="e.g. ad fatigue, automated budget alerts"
                                value={genKeywords}
                                onChange={(e) => setGenKeywords(e.target.value)}
                                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF2D20] bg-white"
                                required
                              />
                            </div>

                            <button
                              type="submit"
                              disabled={state.isGeneratingContent}
                              className="w-full bg-[#FF2D20] hover:bg-[#E5261A] text-white text-xs font-bold py-3 rounded-xl cursor-pointer transition-all disabled:opacity-50 inline-flex items-center justify-center gap-1.5 shadow-sm"
                            >
                              <SparklesIcon className="w-4 h-4 stroke-[1.5]" />
                              {state.isGeneratingContent ? 'AI processing copy...' : 'Synthesize Copy Variation'}
                            </button>
                          </form>
                        </div>

                        {/* Right Output variants */}
                        <div className="lg:col-span-7 space-y-4">
                          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block font-mona">Synthesized Copy Ad Variations</span>
                          
                          <AnimatePresence mode="wait">
                            {state.isGeneratingContent ? (
                              <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }}
                                className="border border-[#E2E8F0] rounded-2xl p-5 bg-white animate-pulse space-y-3"
                              >
                                <div className="h-3 bg-slate-200 rounded w-1/4" />
                                <div className="h-3.5 bg-slate-200 rounded w-5/6" />
                                <div className="h-3 bg-slate-200 rounded w-1/2" />
                              </motion.div>
                            ) : (
                              <div className="space-y-4">
                                {state.contentPieces.filter(cp => cp.campaignId === selectedCampaign?.id).length === 0 ? (
                                  <div className="border border-dashed border-[#E2E8F0] rounded-2xl p-8 text-center text-[#94A3B8] font-semibold text-xs bg-white">
                                    No ad copywriting assets generated yet. Set keywords and synthesize now!
                                  </div>
                                ) : (
                                  state.contentPieces
                                    .filter(cp => cp.campaignId === selectedCampaign?.id)
                                    .map(piece => {
                                      const isEditingContent = editingContentId === piece.id

                                      return (
                                        <div key={piece.id} className="border border-[#E2E8F0] rounded-2xl p-4 bg-white shadow-sm flex gap-4 hover:shadow-md transition-all">
                                          <div className="shrink-0 flex flex-col items-center">
                                            <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-lg bg-[#FFF1F0] border border-[#FF2D20]/20 text-[#FF2D20]">
                                              {piece.type}
                                            </span>
                                          </div>

                                          <div className="flex-1 space-y-3">
                                            <div className="flex items-center justify-between">
                                              <span className="text-xs font-bold text-[#0F172A]">{piece.title}</span>
                                            </div>

                                            {isEditingContent ? (
                                              <div className="space-y-2">
                                                <textarea 
                                                  value={editContentText}
                                                  onChange={(e) => setEditContentText(e.target.value)}
                                                  className="w-full border border-[#E2E8F0] rounded-xl p-2.5 text-xs font-semibold text-[#475569] focus:outline-none focus:border-[#FF2D20] h-20 bg-white"
                                                />
                                                <div className="flex gap-1.5">
                                                  <button 
                                                    onClick={() => saveContentEdit(piece)}
                                                    className="bg-green-600 hover:bg-green-700 text-white font-bold text-[9px] uppercase px-2.5 py-1.5 rounded-lg cursor-pointer"
                                                  >
                                                    Save Changes
                                                  </button>
                                                  <button 
                                                    onClick={() => setEditingContentId(null)}
                                                    className="bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] font-bold text-[9px] uppercase px-2.5 py-1.5 rounded-lg cursor-pointer"
                                                  >
                                                    Cancel
                                                  </button>
                                                </div>
                                              </div>
                                            ) : (
                                              <p className="text-xs font-semibold leading-relaxed text-[#475569]">{piece.text}</p>
                                            )}

                                            {!isEditingContent && (
                                              <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-2.5">
                                                <div className="flex items-center gap-3">
                                                  <button 
                                                    onClick={() => {
                                                      navigator.clipboard.writeText(piece.text)
                                                      alert('Copied to clipboard!')
                                                    }}
                                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                                                  >
                                                    <ClipboardIcon className="w-3.5 h-3.5 stroke-[1.5]" />
                                                    Copy
                                                  </button>
                                                  <button 
                                                    onClick={() => dispatch({ type: 'TOGGLE_BOOKMARK_CONTENT', payload: piece.id })}
                                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-[#94A3B8] hover:text-[#FF2D20] cursor-pointer"
                                                  >
                                                    {piece.bookmarked ? <HeartIconSolid className="w-3.5 h-3.5 text-red-500" /> : <HeartIcon className="w-3.5 h-3.5 stroke-[1.5]" />}
                                                    {piece.bookmarked ? 'Bookmarked' : 'Save'}
                                                  </button>
                                                </div>
                                                
                                                <div className="inline-flex items-center gap-1">
                                                  <button
                                                    onClick={() => {
                                                      setEditingContentId(piece.id)
                                                      setEditContentText(piece.text)
                                                    }}
                                                    className="p-1 hover:bg-[#F8FAFC] rounded text-[#94A3B8] hover:text-blue-500 cursor-pointer"
                                                  >
                                                    <PencilIcon className="w-3.5 h-3.5 stroke-[1.5]" />
                                                  </button>
                                                  <button
                                                    onClick={() => dispatch({ type: 'DELETE_CONTENT', payload: piece.id })}
                                                    className="p-1 hover:bg-[#F8FAFC] rounded text-[#94A3B8] hover:text-red-500 cursor-pointer"
                                                  >
                                                    <TrashIcon className="w-3.5 h-3.5 stroke-[1.5]" />
                                                  </button>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )
                                    })
                                )}
                              </div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}

                    {/* SUB TAB 3: A/B TESTING SPLITS CRUD */}
                    {workspaceTab === 'ab_testing' && (
                      <div className="space-y-6 animate-fadeIn">
                        {/* A/B splits list */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {state.abTests.filter(t => t.campaignId === selectedCampaign?.id).length === 0 ? (
                            <div className="col-span-2 border border-dashed border-[#E2E8F0] rounded-2xl p-8 text-center text-[#94A3B8] font-semibold text-xs bg-white">
                              No A/B split performance tests registered. Create one below!
                            </div>
                          ) : (
                            state.abTests
                              .filter(t => t.campaignId === selectedCampaign?.id)
                              .map(test => {
                                const ctrA = test.impressionsA > 0 ? ((test.clicksA / test.impressionsA) * 100).toFixed(2) : '0.00'
                                const ctrB = test.impressionsB > 0 ? ((test.clicksB / test.impressionsB) * 100).toFixed(2) : '0.00'

                                return (
                                  <div key={test.id} className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden">
                                    {test.winner && (
                                      <span className="absolute top-0 right-0 bg-[#FF2D20] text-white text-[8px] font-black px-2.5 py-1.5 uppercase tracking-wider rounded-bl-xl inline-flex items-center gap-0.5 shadow">
                                        <TrophyIcon className="w-2.5 h-2.5" />
                                        Winner: {test.winner}
                                      </span>
                                    )}

                                    <div>
                                      <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold text-[#0F172A] pr-16 leading-tight">{test.name}</span>
                                        <span className={`px-2 py-0.5 border rounded-lg text-[8px] font-extrabold uppercase ${test.status === 'Running' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-[#E2E8F0] text-slate-500'}`}>
                                          {test.status}
                                        </span>
                                      </div>

                                      {/* Variant A comparison details */}
                                      <div className="space-y-1.5 border-b border-slate-50 pb-3 mb-3 text-left">
                                        <div className="flex justify-between text-[11px] font-semibold text-[#475569]">
                                          <span className={test.winner === 'Variant A' ? 'text-green-600 font-bold' : ''}>
                                            Variant A {test.winner === 'Variant A' && '🏆'}
                                          </span>
                                          <span>{test.clicksA} clicks ({ctrA}% CTR)</span>
                                        </div>
                                        <p className="text-[10px] font-semibold text-[#94A3B8] italic">"{test.variantA}"</p>
                                        <div className="w-full h-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full overflow-hidden">
                                          <div className={`h-full rounded-full ${test.winner === 'Variant A' ? 'bg-green-500' : 'bg-slate-400'}`} style={{ width: `${Math.min(100, parseFloat(ctrA) * 12)}%` }} />
                                        </div>
                                      </div>

                                      {/* Variant B comparison details */}
                                      <div className="space-y-1.5 pb-3 text-left">
                                        <div className="flex justify-between text-[11px] font-semibold text-[#475569]">
                                          <span className={test.winner === 'Variant B' ? 'text-green-600 font-bold' : ''}>
                                            Variant B {test.winner === 'Variant B' && '🏆'}
                                          </span>
                                          <span>{test.clicksB} clicks ({ctrB}% CTR)</span>
                                        </div>
                                        <p className="text-[10px] font-semibold text-[#94A3B8] italic">"{test.variantB}"</p>
                                        <div className="w-full h-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full overflow-hidden">
                                          <div className={`h-full rounded-full ${test.winner === 'Variant B' ? 'bg-green-500' : 'bg-[#FF2D20]'}`} style={{ width: `${Math.min(100, parseFloat(ctrB) * 12)}%` }} />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Action bar triggers */}
                                    <div className="border-t border-[#E2E8F0] pt-3.5 flex items-center justify-between">
                                      {test.status === 'Running' ? (
                                        <div className="inline-flex gap-2">
                                          <button
                                            onClick={() => handleSimulateSplitEngagement(test.id)}
                                            className="bg-[#F8FAFC] hover:bg-slate-100 border border-[#E2E8F0] text-[#475569] text-[9px] font-bold px-2.5 py-1 rounded-lg cursor-pointer"
                                          >
                                            Simulate
                                          </button>
                                          <button
                                            onClick={() => handleSetWinner(test.id, parseFloat(ctrA) >= parseFloat(ctrB) ? 'Variant A' : 'Variant B')}
                                            className="bg-[#FF2D20] hover:bg-[#E5261A] text-white text-[9px] font-bold px-2.5 py-1 rounded-lg cursor-pointer shadow-sm"
                                          >
                                            Winner
                                          </button>
                                        </div>
                                      ) : (
                                        <span className="text-[9px] font-bold text-[#94A3B8] uppercase">Completed split</span>
                                      )}

                                      <button
                                        onClick={() => dispatch({ type: 'DELETE_ABTEST', payload: test.id })}
                                        className="p-1 text-[#94A3B8] hover:text-red-500 hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] rounded-lg cursor-pointer transition-all"
                                      >
                                        <TrashIcon className="w-3.5 h-3.5 stroke-[1.5]" />
                                      </button>
                                    </div>
                                  </div>
                                )
                              })
                          )}
                        </div>

                        {/* Create split test form panel */}
                        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm max-w-xl text-left">
                          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-3 font-mona">Initiate A/B Performance Split</span>
                          <form onSubmit={handleAddABTest} className="space-y-3">
                            <div>
                              <label className="block text-[9px] font-bold text-[#94A3B8] uppercase mb-1">Test Name</label>
                              <input 
                                type="text" 
                                placeholder="Headline Urgent Hook Test"
                                value={newABName}
                                onChange={(e) => setNewABName(e.target.value)}
                                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF2D20] bg-white"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[9px] font-bold text-[#94A3B8] uppercase mb-1">Variant A hook copy</label>
                                <textarea 
                                  placeholder="Try predicted AI Keywords..."
                                  value={newABVarA}
                                  onChange={(e) => setNewABVarA(e.target.value)}
                                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF2D20] h-16 bg-white"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-[#94A3B8] uppercase mb-1">Variant B hook copy</label>
                                <textarea 
                                  placeholder="Stop wasting ad spend guarantee..."
                                  value={newABVarB}
                                  onChange={(e) => setNewABVarB(e.target.value)}
                                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF2D20] h-16 bg-white"
                                  required
                                />
                              </div>
                            </div>
                            <button
                              type="submit"
                              className="bg-[#FF2D20] hover:bg-[#E5261A] text-white text-[10px] font-bold px-3 py-2 rounded-xl cursor-pointer shadow-sm transition-all"
                            >
                              Launch Split Test
                            </button>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            } />

            {/* ==========================================
                VIEW: ADS SCREEN (Sub-view of Ad Sets)
                ========================================== */}
            <Route path="/campaigns/:id/adsets/:adSetId/ads" element={
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => navigate(`/campaigns/${selectedCampaignId}`)}
                      className="p-2 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-xl text-[#475569] shadow-sm cursor-pointer transition-all"
                    >
                      <ArrowLeftIcon className="w-4 h-4 stroke-2" />
                    </button>
                    <div>
                      <h2 className="text-lg font-bold text-[#0F172A] font-mona leading-tight">
                        <span className="text-[#94A3B8] font-semibold">Campaigns / {selectedCampaign?.name} / {selectedAdSet?.name} / </span> Ads
                      </h2>
                      <p className="text-[11px] font-semibold text-[#94A3B8] mt-0.5">Manage individual ads for this Ad Set.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => dispatch({ type: 'SET_ACTIVE_PANEL', payload: { type: 'ad' } })}
                    className="bg-[#FF2D20] hover:bg-[#E5261A] text-white text-[11px] font-bold px-4 py-2 rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <PlusIcon className="w-4 h-4 shrink-0" />
                    Create Ad
                  </button>
                </div>

                {/* Ads Grid */}
                {activeAds.filter(a => a.adSetId === selectedAdSetId).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeAds.filter(a => a.adSetId === selectedAdSetId).map(ad => (
                      <div key={ad.id} className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm flex flex-col justify-between overflow-hidden">
                        {ad.review_status === 'REJECTED' && (
                          <div className="bg-red-50 text-red-700 px-4 py-2.5 text-[10px] font-bold border-b border-red-100 flex justify-between items-center">
                            <span>Rejected — {ad.rejection_reason}</span>
                            <button 
                              onClick={() => {
                                dispatch({ type: 'SET_ACTIVE_PANEL', payload: { type: 'ad', item: ad } });
                              }}
                              className="underline hover:text-red-900"
                            >
                              Edit & Resubmit
                            </button>
                          </div>
                        )}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                            <div className="p-4">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex gap-3">
                                <div className="w-12 h-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-center shrink-0">
                                  <PhotoIcon className="w-5 h-5 text-[#94A3B8]" />
                                </div>
                                <div>
                                  <h3 className="text-sm font-bold text-[#0F172A]">{ad.name}</h3>
                                  <span className="text-[10px] font-semibold text-[#94A3B8] flex items-center">
                                    {getPlatformIcon(ad.platform)} {ad.format} · {ad.platform}
                                  </span>
                                </div>
                              </div>
                            </div>
                              <div className="flex flex-col items-end gap-2">
                                <AdStatusBadge ad={ad} />
                                {(ad.status === 'Active' || ad.status === 'Paused') && ad.review_status === 'APPROVED' && (
                                  <button 
                                    onClick={() => dispatch({ type: 'TOGGLE_AD_STATUS', payload: ad.id })}
                                    className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${ad.status === 'Active' ? 'bg-green-500' : 'bg-slate-300'}`}
                                  >
                                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${ad.status === 'Active' ? 'translate-x-3' : 'translate-x-0.5'}`} />
                                  </button>
                                )}
                              </div>
                          
                          <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] mb-4 relative">
                            <p className="text-[11px] font-bold text-[#0F172A] mb-1 pr-16">Headline: <span className="font-semibold text-[#475569]">{ad.headline}</span></p>
                            <p className="text-[10px] text-[#475569] line-clamp-2 pr-16">{ad.description}</p>
                            <span className="absolute top-3 right-3 bg-white border border-[#E2E8F0] text-[9px] font-bold text-[#0F172A] px-2 py-0.5 rounded shadow-sm">
                              {ad.cta_type || 'LEARN_MORE'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-2 mb-4 text-center">
                            <div className="bg-[#FFF1F0] p-2 rounded-lg">
                              <span className="block text-[8px] font-bold text-[#FF2D20] uppercase">Spend</span>
                              <span className="block text-xs font-extrabold text-[#0F172A]">${ad.metrics.spend}</span>
                            </div>
                            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-2 rounded-lg">
                              <span className="block text-[8px] font-bold text-[#94A3B8] uppercase">Impr.</span>
                              <span className="block text-xs font-extrabold text-[#0F172A]">{ad.metrics.impressions}</span>
                            </div>
                            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-2 rounded-lg">
                              <span className="block text-[8px] font-bold text-[#94A3B8] uppercase">Clicks</span>
                              <span className="block text-xs font-extrabold text-[#0F172A]">{ad.metrics.clicks}</span>
                            </div>
                            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-2 rounded-lg">
                              <span className="block text-[8px] font-bold text-[#94A3B8] uppercase">CTR</span>
                              <span className="block text-xs font-extrabold text-[#0F172A]">
                                {ad.metrics.impressions > 0 ? ((ad.metrics.clicks / ad.metrics.impressions) * 100).toFixed(1) : '0.0'}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => dispatch({ type: 'SET_ACTIVE_PANEL', payload: { type: 'ad', item: ad } })}
                            className="flex-1 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] text-[11px] font-bold py-2 rounded-xl cursor-pointer transition-all shadow-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => dispatch({ type: 'OPEN_CONFIRM', payload: { type: 'DELETE_AD', id: ad.id, title: 'Delete Ad', message: 'Are you sure you want to delete this ad? This action cannot be undone.' } })}
                            className="bg-white border border-[#E2E8F0] hover:bg-red-50 text-[#94A3B8] hover:text-red-500 px-3 py-2 rounded-xl cursor-pointer transition-all shadow-sm"
                          >
                            <TrashIcon className="w-4 h-4 stroke-[1.5]" />
                          </button>
                        </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 flex flex-col items-center justify-center text-center bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
                    <div className="w-16 h-16 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl flex items-center justify-center mb-4 text-[#94A3B8]">
                      <CursorArrowRaysIcon className="w-8 h-8 stroke-[1.5]" />
                    </div>
                    <h3 className="text-sm font-bold text-[#0F172A] font-mona mb-1">No Ads Created</h3>
                    <p className="text-xs font-semibold text-[#94A3B8] max-w-xs mb-6">Start building your creative variations for this ad set.</p>
                    <button
                      onClick={() => dispatch({ type: 'SET_ACTIVE_PANEL', payload: { type: 'ad' } })}
                      className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] text-[#0F172A] text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-all shadow-sm"
                    >
                      Create First Ad
                    </button>
                  </div>
                )}
              </motion.div>
            } />

          {/* ==========================================
              VIEW 3: AI ADVISOR CHAT
              ========================================== */}
          <Route path="/advisor" element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A] font-mona leading-tight">Gemini Campaign Advisor</h2>
                <p className="text-xs font-semibold text-[#94A3B8] mt-0.5">Ask about daily spends, campaign ROAS configurations, or split test results.</p>
              </div>

              {/* Chat Canvas Frame */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden flex flex-col h-[480px]">
                {/* Messages area */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4">
                  {state.chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                      {msg.sender !== 'user' && (
                        <div className="w-7 h-7 rounded-lg bg-[#FF2D20] shrink-0 flex items-center justify-center font-bold text-white text-[9px] mt-0.5 shadow-sm shadow-[#FF2D20]/25">
                          AI
                        </div>
                      )}
                      
                      <div className={`max-w-md p-3 rounded-2xl text-xs font-semibold leading-relaxed ${
                        msg.sender === 'user' ? 'bg-[#FF2D20] text-white rounded-tr-none' : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] rounded-bl-none'
                      }`}>
                        {msg.text}
                      </div>

                      {msg.sender === 'user' && (
                        <div className="w-7 h-7 rounded-lg bg-[#FFF1F0] border border-[#FECACA] shrink-0 flex items-center justify-center font-bold text-[#FF2D20] text-[9px] mt-0.5">
                          R
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Suggestions bar */}
                <div className="px-5 py-2.5 border-t border-[#E2E8F0] bg-[#F8FAFC]/50 flex gap-1.5 overflow-x-auto no-scrollbar">
                  <button 
                    onClick={() => dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { sender: 'user', text: 'Analyze Q2 Portfolio ROAS metrics' } })}
                    className="text-[9px] font-bold text-[#475569] bg-white border border-[#E2E8F0] px-2.5 py-1 rounded-full hover:bg-[#F8FAFC] cursor-pointer shadow-sm"
                  >
                    Analyze Portfolio ROAS
                  </button>
                  <button 
                    onClick={() => dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { sender: 'user', text: 'Where is my ad budget burning?' } })}
                    className="text-[9px] font-bold text-[#475569] bg-white border border-[#E2E8F0] px-2.5 py-1 rounded-full hover:bg-[#F8FAFC] cursor-pointer shadow-sm"
                  >
                    Check Budget Cap
                  </button>
                </div>

                {/* Text entry field */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-[#E2E8F0] bg-white flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask Gemini advisor about ad spend fatigue or CTR optimizations..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#FF2D20]"
                  />
                  <button 
                    type="submit"
                    className="bg-[#FF2D20] hover:bg-[#E5261A] text-white p-2 rounded-xl shrink-0 cursor-pointer transition-colors shadow-sm inline-flex items-center justify-center"
                  >
                    <PaperAirplaneIcon className="w-4.5 h-4.5 stroke-2" />
                  </button>
                </form>
              </div>
            </motion.div>
          } />

          {/* ==========================================
              VIEW 4: REPORTS EXPORT
              ========================================== */}
          <Route path="/reports" element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A] font-mona leading-tight">SaaS Performance Reports</h2>
                <p className="text-xs font-semibold text-[#94A3B8] mt-0.5">Export current relational database entities in PDF scopes.</p>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm max-w-xl">
                <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-4 font-mona">Export Configurations</span>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-[#94A3B8] uppercase mb-1">Time Range Scope</label>
                      <select className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-xs font-bold text-slate-500 bg-white">
                        <option>Last 7 Days (May 2026)</option>
                        <option>Last 30 Days</option>
                        <option>FYP Period (Year to Date)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-[#94A3B8] uppercase mb-1">Scope Channels</label>
                      <select className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-xs font-bold text-slate-500 bg-white">
                        <option>All Platforms</option>
                        <option>Google Ads Network</option>
                        <option>Meta Ads Network</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateReport}
                    disabled={state.isGeneratingReport}
                    className="bg-[#FF2D20] hover:bg-[#E5261A] text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors inline-flex items-center gap-1 shadow-sm disabled:opacity-50"
                  >
                    <DocumentArrowDownIcon className="w-4 h-4 stroke-2" />
                    {state.isGeneratingReport ? 'Compiling PDF...' : 'Compile PDF Report'}
                  </button>

                  {/* Progress gauge */}
                  {state.isGeneratingReport && (
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[11px] font-bold text-[#0F172A]">
                        <span>Analyzing campaign metrics...</span>
                        <span>{state.reportProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#FF2D20] rounded-full transition-all duration-200"
                          style={{ width: `${state.reportProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Complete status */}
                  {state.generatedReportLink && (
                    <div className="border border-green-200 rounded-xl p-3.5 bg-green-50/50 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <CheckCircleIconSolid className="w-5 h-5 text-green-600 shrink-0" />
                        <div>
                          <span className="block text-xs font-bold text-green-950">PDF compiled successfully</span>
                          <span className="block text-[10px] font-semibold text-green-700 mt-0.5">Size: 2.4 MB · Ready for presenter logs</span>
                        </div>
                      </div>
                      <a
                        href={state.generatedReportLink}
                        download
                        className="bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Download
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          } />

          {/* ==========================================
              VIEW 5: PLATFORM INTEGRATIONS
              ========================================== */}
          <Route path="/integrations" element={
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A] font-mona leading-tight">Platform Integrations</h2>
                <p className="text-xs font-semibold text-[#94A3B8] mt-0.5">Manage connected ad accounts and OAuth tokens.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {state.integrations.map((integration, idx) => (
                  <div key={idx} className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm text-left flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#0F172A] font-mona mb-1">{integration.platform}</h3>
                      {integration.accounts.length > 0 ? (
                        <div className="space-y-3 mt-4">
                          {integration.accounts.map((acc, aIdx) => (
                            <div key={aIdx} className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl flex items-center justify-between">
                              <div>
                                <p className="text-xs font-bold text-[#0F172A]">{acc.name}</p>
                                <p className="text-[10px] font-semibold text-[#94A3B8]">ID: {acc.id}</p>
                              </div>
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs font-semibold text-[#94A3B8] mt-4">No accounts connected.</p>
                      )}
                    </div>
                    <button 
                      onClick={() => {
                        dispatch({ type: 'SET_OAUTH_STEP', payload: 1 })
                        // Local state modal logic can be wired here or inside a specialized panel
                      }}
                      className={`mt-6 w-full text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors shadow-sm ${
                        integration.accounts.length > 0 
                          ? 'bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#FFF1F0] hover:text-[#FF2D20]' 
                          : 'bg-[#FF2D20] text-white hover:bg-[#E5261A]'
                      }`}
                    >
                      {integration.accounts.length > 0 ? 'Manage Settings' : 'Connect Account'}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          } />

          </Routes>
        </div>
      </main>

      {/* ==========================================
          MODALS & DRAWERS
          ========================================== */}

      <AnimatePresence>
        {state.ui.activePanelType === 'campaign' && (
          <CampaignPanel 
            item={state.ui.activePanelItem}
            onClose={() => dispatch({ type: 'SET_ACTIVE_PANEL', payload: { type: null } })}
            onSave={(data) => {
              dispatch({ type: state.ui.activePanelItem ? 'UPDATE_CAMPAIGN' : 'ADD_CAMPAIGN', payload: data })
              setTimeout(() => dispatch({ type: 'SYNC_SUCCESS', payload: { entityType: 'campaigns', id: data.id } }), 1500)
              dispatch({ type: 'SET_ACTIVE_PANEL', payload: { type: null } })
            }}
          />
        )}
        
        {state.ui.activePanelType === 'adset' && (
          <AdSetPanel 
            item={state.ui.activePanelItem}
            campaignId={selectedCampaignId}
            onClose={() => dispatch({ type: 'SET_ACTIVE_PANEL', payload: { type: null } })}
            onSave={(data) => {
              dispatch({ type: state.ui.activePanelItem ? 'UPDATE_ADSET' : 'ADD_ADSET', payload: data })
              setTimeout(() => dispatch({ type: 'SYNC_SUCCESS', payload: { entityType: 'adSets', id: data.id } }), 1500)
              dispatch({ type: 'SET_ACTIVE_PANEL', payload: { type: null } })
            }}
          />
        )}
        
        {state.ui.activePanelType === 'ad' && (
          <AdPanel 
            item={state.ui.activePanelItem}
            adSetId={selectedAdSetId}
            platform={selectedCampaign?.platform}
            onClose={() => dispatch({ type: 'SET_ACTIVE_PANEL', payload: { type: null } })}
            onSave={(data) => {
              dispatch({ type: state.ui.activePanelItem ? 'UPDATE_AD' : 'ADD_AD', payload: data })
              setTimeout(() => {
                dispatch({ type: 'SYNC_SUCCESS', payload: { entityType: 'ads', id: data.id } })
                setTimeout(() => {
                  const isApproved = Math.random() < 0.8
                  if (isApproved) {
                    dispatch({ type: 'SET_AD_APPROVED', payload: data.id })
                  } else {
                    const reasons = ["Image text exceeds 20% coverage", "Landing page mismatch", "Missing privacy policy link"]
                    const reason = reasons[Math.floor(Math.random() * reasons.length)]
                    dispatch({ type: 'SET_AD_REJECTED', payload: { id: data.id, reason } })
                  }
                }, 2000)
              }, 1500)
              dispatch({ type: 'SET_ACTIVE_PANEL', payload: { type: null } })
            }}
          />
        )}
      </AnimatePresence>
      <ConfirmDialog 
        isOpen={state.ui.confirmDialog.isOpen}
        title={state.ui.confirmDialog.title}
        message={state.ui.confirmDialog.message}
        onConfirm={() => {
          dispatch({ type: state.ui.confirmDialog.type, payload: state.ui.confirmDialog.id });
        }}
        onCancel={() => dispatch({ type: 'CLOSE_CONFIRM' })}
      />
    </div>
  )
}
