import { useState, useMemo, useReducer } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate, matchPath } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import OverviewCanvas from './Overview/OverviewCanvas'
import CampaignList from './CampaignHub/CampaignList'
import CampaignDetail from './CampaignHub/CampaignDetail'
import AdsScreen from './CampaignHub/AdsScreen'
import IntegrationsView from './Integrations/IntegrationsView'
import CampaignPanel from './CampaignHub/CampaignPanel'
import AdSetPanel from './CampaignHub/AdSetPanel'
import AdPanel from './CampaignHub/AdPanel'
import ConfirmDialog from './CampaignHub/ConfirmDialog'
import DataIngestion from './DataIngestion/DataIngestion'
import AIInsights from './AIInsights/AIInsights'
import AIAdvisorChat from './AIAdvisor/AIAdvisorChat'
import ReportsExport from './ReportsExport/ReportsExport'
import ContentStudio from './studio/ContentStudio'
import CampaignSimulator from './simulator/CampaignSimulator'
import {
  BoltIcon,
  BeakerIcon,
  SparklesIcon,
  ArrowLeftOnRectangleIcon,
  PuzzlePieceIcon,
  ArrowUpTrayIcon,
  LightBulbIcon,
  Squares2X2Icon,
  MegaphoneIcon,
  MagnifyingGlassIcon,
  ChatBubbleBottomCenterIcon,
  VideoCameraIcon,
  AtSymbolIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
// ==========================================
// RELATIONAL INITIAL MOCK DATA
// ==========================================

const INITIAL_CAMPAIGNS = [
  { id: 1, name: 'Summer Performance Ads', platform: 'Google', status: 'Active', budget: 5000, startDate: '2026-05-01', endDate: '2026-06-01', objective: 'SALES', budget_type: 'Daily', bid_strategy: 'Maximize Conversions', sync_status: 'SYNCED', deletedAt: null },
  { id: 2, name: 'Meta Retargeting Q2', platform: 'Meta', status: 'Active', budget: 4000, startDate: '2026-05-10', endDate: '2026-06-10', objective: 'LEADS', budget_type: 'Lifetime', bid_strategy: 'Lowest Cost', sync_status: 'SYNCED', deletedAt: null },
  { id: 3, name: 'Snapchat Brand Viral', platform: 'Snapchat', status: 'Paused', budget: 2000, startDate: '2026-05-15', endDate: '2026-06-15', objective: 'AWARENESS', budget_type: 'Daily', bid_strategy: 'Cost Cap', sync_status: 'SYNCED', deletedAt: null }
]

const generateMockAnalytics = () => {
  const data = []
  let id = 100
  // Helper for random variance
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
  
  for (let i = 1; i <= 30; i++) {
    const day = i < 10 ? `0${i}` : `${i}`
    const date = `2026-05-${day}`
    
    // Campaign 1: Google (All 30 days)
    let spend1 = rand(300, 600)
    data.push({ id: id++, campaignId: 1, date, spend: spend1, revenue: spend1 * (rand(40, 80)/10), impressions: spend1 * 35, clicks: spend1 * 1.5, leads: Math.floor(spend1 / rand(12, 18)) })
    
    // Campaign 2: Meta (Starts May 10)
    if (i >= 10) {
      let spend2 = rand(200, 450)
      data.push({ id: id++, campaignId: 2, date, spend: spend2, revenue: spend2 * (rand(30, 90)/10), impressions: spend2 * 40, clicks: spend2 * 1.8, leads: Math.floor(spend2 / rand(10, 15)) })
    }
    
    // Campaign 3: Snapchat (Starts May 15)
    if (i >= 15) {
      let spend3 = rand(150, 300)
      data.push({ id: id++, campaignId: 3, date, spend: spend3, revenue: spend3 * (rand(20, 60)/10), impressions: spend3 * 50, clicks: spend3 * 2.5, leads: Math.floor(spend3 / rand(8, 12)) })
    }
  }
  return data
}

const INITIAL_ANALYTICS = generateMockAnalytics()

const INITIAL_CONTENT_PIECES = []

const INITIAL_AB_TESTS = [
  { id: 1, campaignId: 1, name: 'Google High Urgency Headline Test', variantA: 'Stop Wasting Ad Budget - Try predicted AI Keywords', variantB: 'The Only AI Keywords Guaranteed to Boost Conversion Rates', splitRatio: '50/50', clicksA: 340, clicksB: 180, impressionsA: 8000, impressionsB: 8500, status: 'Running', winner: null },
  { id: 2, campaignId: 2, name: 'Meta Visual Ad-Copy Variant test', variantA: '⚡ Get a 2.4x ROAS increase in 7 days or your money back.', variantB: '⚡ Tired of low CTR? Let predicted AI build Meta creatives.', splitRatio: '60/40', clicksA: 410, clicksB: 480, impressionsA: 11000, impressionsB: 11500, status: 'Completed', winner: 'Variant B' }
]

const INITIAL_ADSETS = [
  { id: 1, campaignId: 1, name: 'Search Broad Match', audienceType: 'Broad', platform: 'Google', status: 'Active', budget: 2500, goal: 'CONVERSIONS', spendToday: 150, billing_event: 'IMPRESSIONS', budget_type: 'Daily', start_time: '2026-05-01T00:00', end_time: '2026-06-01T23:59', frequency_cap: '3 per day', sync_status: 'SYNCED', targeting: { age_min: 18, age_max: 65, genders: ['All'], locations: ['US'], interests: ['SaaS'] }, deletedAt: null },
  { id: 2, campaignId: 1, name: 'Search Exact Match', audienceType: 'Custom', platform: 'Google', status: 'Active', budget: 2500, goal: 'CONVERSIONS', spendToday: 200, billing_event: 'CLICKS', budget_type: 'Daily', start_time: '2026-05-01T00:00', end_time: '2026-06-01T23:59', frequency_cap: 'None', sync_status: 'SYNCED', targeting: { age_min: 25, age_max: 55, genders: ['All'], locations: ['US', 'CA'], interests: ['B2B'] }, deletedAt: null },
  { id: 3, campaignId: 2, name: 'LAL 1% Purchasers', audienceType: 'Lookalike', platform: 'Meta', status: 'Active', budget: 4000, goal: 'CONVERSIONS', spendToday: 320, billing_event: 'IMPRESSIONS', budget_type: 'Lifetime', start_time: '2026-05-10T00:00', end_time: '2026-06-10T23:59', frequency_cap: 'None', sync_status: 'SYNCED', targeting: { age_min: 20, age_max: 50, genders: ['All'], locations: ['US', 'UK', 'CA'], interests: ['Marketing'] }, deletedAt: null },
  { id: 4, campaignId: 3, name: 'Gen Z Outreach', audienceType: 'Broad', platform: 'Snapchat', status: 'Paused', budget: 2000, goal: 'IMPRESSIONS', spendToday: 0, billing_event: 'IMPRESSIONS', budget_type: 'Daily', start_time: '2026-05-15T00:00', end_time: '2026-06-15T23:59', frequency_cap: '1 per day', sync_status: 'SYNCED', targeting: { age_min: 13, age_max: 24, genders: ['All'], locations: ['US'], interests: ['Tech'] }, deletedAt: null }
]

const INITIAL_ADS = [
  { id: 1, adSetId: 1, name: 'Promo RSA 1', format: 'RESPONSIVE', platform: 'Google', status: 'Active', headline: 'Best SaaS Tools', description: 'Grow your business', cta: 'Sign Up', metrics: { impressions: 1200, clicks: 45, spend: 35, conversions: 2 }, destination_url: 'https://marketmind.ai', cta_type: 'SIGN_UP', review_status: 'APPROVED', sync_status: 'SYNCED', ab_test_group: 'A', deletedAt: null },
  { id: 2, adSetId: 1, name: 'Promo RSA 2', format: 'RESPONSIVE', platform: 'Google', status: 'Paused', headline: 'AI Marketing', description: 'Automate ads', cta: 'Learn More', metrics: { impressions: 800, clicks: 20, spend: 15, conversions: 1 }, destination_url: 'https://marketmind.ai/features', cta_type: 'LEARN_MORE', review_status: 'PENDING', sync_status: 'SYNCED', ab_test_group: 'B', deletedAt: null },
  { id: 3, adSetId: 3, name: 'Meta Lead Gen Image', format: 'Image', platform: 'Meta', status: 'Active', primaryText: 'Tired of high CPAs?', headline: 'Lower Your CPA Today', cta_type: 'LEARN_MORE', metrics: { spend: 150, impressions: 5000, clicks: 125, conversions: 10 }, instagram: true, review_status: 'APPROVED', sync_status: 'SYNCED', ab_test_group: 'A', deletedAt: null },
  { id: 4, adSetId: 4, name: 'Snap Story Ad', format: 'Video', platform: 'Snapchat', status: 'Paused', brandName: 'MarketMind AI', headline: 'Viral Growth Hack', attachment_url: 'https://marketmind.ai', cta_type: 'SIGN_UP', metrics: { spend: 0, impressions: 0, clicks: 0, conversions: 0 }, review_status: 'APPROVED', sync_status: 'SYNCED', ab_test_group: 'A', deletedAt: null }
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
  ingestion: {
    uploads: []
  },
  insights: {
    alerts: [
      { id: 1, severity: 'Critical', title: 'High CPA on Snapchat', detail: 'Cost per acquisition has spiked 40% in the last 24h.', campaign: 'Snapchat Brand Viral', platform: 'Snapchat', time: '2m ago' },
      { id: 2, severity: 'Warning', title: 'Ad fatigue detected', detail: 'Creative variation B is showing a CTR drop.', campaign: 'Meta Retargeting Q2', platform: 'Meta', time: '1h ago' }
    ],
    recommendations: [
      { id: 1, title: 'Shift budget to Google Ads', category: 'Budget', body: 'Google Ads is performing 2x better than Meta. Shift $500/day.', campaign: 'Summer Performance Ads', impact: 'High Impact' },
      { id: 2, title: 'Pause low-performing Ad Set', category: 'Optimization', body: 'Ad Set 3 has 0 conversions. Pause it to save budget.', campaign: 'Meta Retargeting Q2', impact: 'Medium Impact' }
    ],
    lastRefreshed: 'Just now',
    isRefreshing: false
  },
  chat: {
    messages: [
      { role: 'model', parts: [{ text: 'Hello! I am your MarketMind AI Advisor. I monitor your campaign ROAS and budget allocation in real time. How can I help you scale today?' }] }
    ],
    isLoading: false,
    geminiApiKey: ''
  },
  reports: {
    history: [
      { id: 1, name: 'Q1_Executive_Summary.pdf', type: 'PDF · 2.4 MB', date: 'May 14, 2026' },
      { id: 2, name: 'Meta_Ads_Audit.pdf', type: 'PDF · 1.1 MB', date: 'May 12, 2026' }
    ],
    isGenerating: false
  },
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
    { sender: 'ai', text: 'Welcome Rashid! I have analyzed your 3 active marketing campaigns. Our average portfolio ROAS is outstanding at 8.08x. Ask me to diagnose daily snapshots, check A/B test results, or craft brand-new platform-native creatives!' }
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
    case 'ADD_CHAT_MESSAGE_V2':
      return { ...state, chat: { ...state.chat, messages: [...state.chat.messages, action.payload] } }
    case 'SET_CHAT_LOADING':
      return { ...state, chat: { ...state.chat, isLoading: action.payload } }
    case 'SET_GEMINI_KEY':
      return { ...state, chat: { ...state.chat, geminiApiKey: action.payload } }
    case 'SET_GENERATING':
      return { ...state, reports: { ...state.reports, isGenerating: action.payload } }
    case 'ADD_REPORT_HISTORY':
      return { ...state, reports: { ...state.reports, history: [action.payload, ...state.reports.history] } }
    case 'ADD_UPLOAD':
      return { ...state, ingestion: { ...state.ingestion, uploads: [action.payload, ...state.ingestion.uploads] } }
    case 'DELETE_UPLOAD':
      return { ...state, ingestion: { ...state.ingestion, uploads: state.ingestion.uploads.filter(u => u.id !== action.payload) } }
    case 'SET_INSIGHTS_REFRESHING':
      return { ...state, insights: { ...state.insights, isRefreshing: action.payload, lastRefreshed: action.payload ? state.insights.lastRefreshed : 'Just now' } }
    default:
      return state
  }
}

// ==========================================
// REUSABLE PRESENTATIONAL METRICS
// ==========================================

export default function Dashboard({ user, onLogout, onOpenProfile }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const location = useLocation()
  const navigate = useNavigate()
  
  // Determine active view for sidebar highlighting
  const currentPath = location.pathname
  const sidebarActive = location.pathname.includes('/campaigns') ? 'campaigns' 
                      : location.pathname.includes('/data') ? 'data'
                      : location.pathname.includes('/insights') ? 'insights'
                      : location.pathname.includes('/advisor') ? 'advisor' 
                      : location.pathname.includes('/studio') ? 'studio'
                      : location.pathname.includes('/simulator') ? 'simulator'
                      : location.pathname.includes('/reports') ? 'reports' 
                      : location.pathname.includes('/integrations') ? 'integrations' 
                      : 'dashboard'

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
    if (!selectedCampaignId) return null
    return campaignStats.find(c => c.id === selectedCampaignId) || null
  }, [campaignStats, selectedCampaignId])

  const selectedAdSet = useMemo(() => {
    if (!selectedAdSetId) return null
    return state.adSets.find(a => a.id === selectedAdSetId) || null
  }, [state.adSets, selectedAdSetId])

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
        day: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
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
    const colors = { Google: '#3B82F6', Meta: '#FF2D20', Snapchat: '#EAB308' }
    
    return Object.keys(platformData).map(plat => ({
      name: `${plat} Ads`,
      value: Math.round((platformData[plat] / total) * 100),
      color: colors[plat] || '#64748B'
    }))
  }, [campaignStats])

  const platformComparisonData = useMemo(() => {
    const platformData = {}
    campaignStats.forEach(c => {
      if (!platformData[c.platform]) {
        platformData[c.platform] = { platform: c.platform, spend: 0, revenue: 0 }
      }
      platformData[c.platform].spend += c.totalSpend
      platformData[c.platform].revenue += c.totalRevenue
    })
    return Object.values(platformData)
  }, [campaignStats])

  const bestROASPlatform = useMemo(() => {
    if (platformComparisonData.length === 0) return { platform: 'N/A', roas: 0 }
    return platformComparisonData.map(p => ({
      ...p,
      roas: p.spend > 0 ? p.revenue / p.spend : 0
    })).reduce((prev, current) => (prev.roas > current.roas) ? prev : current)
  }, [platformComparisonData])

  const cpaTrendData = useMemo(() => {
    const dailyMap = {}
    state.analytics.forEach(snap => {
      if (!dailyMap[snap.date]) {
        dailyMap[snap.date] = { date: snap.date, spend: 0, leads: 0 }
      }
      dailyMap[snap.date].spend += snap.spend
      dailyMap[snap.date].leads += (snap.leads || 0)
    })

    return Object.values(dailyMap)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(d => ({
        day: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dateStr: d.date,
        cpa: d.leads > 0 ? +(d.spend / d.leads).toFixed(2) : 0
      }))
  }, [state.analytics])

  const filteredCampaigns = useMemo(() => {
    return campaignStats.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(state.searchQuery.toLowerCase())
      const matchesPlatform = state.platformFilter === 'All' || c.platform === state.platformFilter
      const matchesStatus = state.statusFilter === 'All' || c.status === state.statusFilter
      return matchesSearch && matchesPlatform && matchesStatus
    })
  }, [campaignStats, state.searchQuery, state.platformFilter, state.statusFilter])



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
              { id: 'dashboard', path: '/dashboard', label: 'Overview Canvas', icon: Squares2X2Icon },
              { id: 'campaigns', path: '/campaigns', label: 'Campaign Hub', icon: MegaphoneIcon },
              { id: 'data', path: '/data', label: 'Data Ingestion', icon: ArrowUpTrayIcon },
              { id: 'insights', path: '/insights', label: 'AI Insights', icon: LightBulbIcon },
              { id: 'advisor', path: '/advisor', label: 'AI Advisor Chat', icon: SparklesIcon },
              { id: 'studio', path: '/studio', label: 'Content Studio', icon: SparklesIcon },
              { id: 'simulator', path: '/simulator', label: 'Campaign Simulator', icon: BeakerIcon },
              { id: 'reports', path: '/reports', label: 'Reports Export', icon: BoltIcon },
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

        {/* Footer Profile & Logout */}
        <div className="p-4 border-t border-[#E2E8F0] space-y-2">
          <button
            onClick={onOpenProfile}
            className="w-full flex items-center gap-3 px-4 py-2 text-[13px] font-bold text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer"
          >
            <UserCircleIcon className="w-5 h-5 stroke-[1.5]" />
            <span className="truncate">
              {user && user.name 
                ? user.name.split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' ')
                : 'Test User'}
            </span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#475569] hover:bg-[#FFF1F0] hover:text-[#FF2D20] transition-colors cursor-pointer"
          >
            <ArrowLeftOnRectangleIcon className="w-4.5 h-4.5 stroke-[1.5] text-red-500" />
            Logout
          </button>
        </div>
      </aside>

      {/* ==========================================
          MAIN CONTAINER
          ========================================== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative h-screen [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">


        {/* Content body padding container */}
        <div className="p-8 flex-1 max-w-7xl w-full mx-auto space-y-8">
          
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <OverviewCanvas 
                portfolioStats={portfolioStats}
                consolidatedDailyChartData={consolidatedDailyChartData}
                trafficShareData={trafficShareData}
                showRevenue={showRevenue}
                setShowRevenue={setShowRevenue}
                activeCampaignsCount={activeCampaigns.length}
                platformComparisonData={platformComparisonData}
                bestROASPlatform={bestROASPlatform}
                cpaTrendData={cpaTrendData}
              />
            } />
            <Route path="/campaigns" element={
              <CampaignList 
                state={state} 
                dispatch={dispatch} 
                navigate={navigate}
                filteredCampaigns={filteredCampaigns}
                getPlatformIcon={getPlatformIcon}
              />
            } />
            <Route path="/campaigns/:id/*" element={
              <CampaignDetail 
                state={state} 
                dispatch={dispatch}
                navigate={navigate}
                selectedCampaign={selectedCampaign}
                selectedCampaignId={selectedCampaignId}
                activeAdSets={activeAdSets}
                campaignStats={campaignStats}
                portfolioStats={portfolioStats}
              />
            } />
            <Route path="/campaigns/:id/adsets/:adSetId/ads" element={
              <AdsScreen 
                state={state}
                dispatch={dispatch}
                navigate={navigate}
                selectedCampaign={selectedCampaign}
                selectedCampaignId={selectedCampaignId}
                selectedAdSet={selectedAdSet}
                selectedAdSetId={selectedAdSetId}
                activeAds={activeAds}
                getPlatformIcon={getPlatformIcon}
              />
            } />
            <Route path="/data" element={<DataIngestion state={state} dispatch={dispatch} />} />
            <Route path="/insights" element={<AIInsights state={state} dispatch={dispatch} />} />
            <Route path="/advisor" element={<AIAdvisorChat state={state} dispatch={dispatch} portfolioStats={portfolioStats} campaignStats={campaignStats} />} />
            <Route path="/reports" element={<ReportsExport state={state} dispatch={dispatch} />} />
            <Route path="/integrations" element={<IntegrationsView state={state} dispatch={dispatch} />} />
            <Route path="/studio" element={<ContentStudio state={state} dispatch={dispatch} />} />
            <Route path="/simulator" element={<CampaignSimulator state={state} dispatch={dispatch} />} />
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
