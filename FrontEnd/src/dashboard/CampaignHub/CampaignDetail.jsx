import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'
import { 
  ArrowLeftIcon, PencilIcon, TrashIcon, ChevronRightIcon,
  ClipboardIcon, PlusIcon, CircleStackIcon,
  ArrowTrendingUpIcon, ChartBarIcon, CursorArrowRaysIcon, SparklesIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid, TrophyIcon } from '@heroicons/react/24/solid'
import { HeartIcon } from '@heroicons/react/24/outline'

import StatusBadge from './StatusBadge'
import SyncBadge from './SyncBadge'
import CustomTooltip from '../components/CustomTooltip'
import KPICard from '../components/KPICard'

export default function CampaignDetail({ state, dispatch, navigate, selectedCampaign, selectedCampaignId, activeAdSets }) {
  const [workspaceTab, setWorkspaceTab] = useState('analytics')
  
  // Snapshots form
  const [isSnapModalOpen, setIsSnapModalOpen] = useState(false)
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

  const handleAddSnapshot = async (e) => {
    e.preventDefault()
    if (!newSnapDate || !newSnapSpend || !newSnapRevenue) return

    try {
      const response = await axios.post(`/api/campaigns/${selectedCampaignId}/daily-logs`, {
        date: newSnapDate,
        spend: parseFloat(newSnapSpend),
        revenue: parseFloat(newSnapRevenue),
        impressions: parseInt(newSnapImpressions) || 0,
        clicks: parseInt(newSnapClicks) || 0,
        leads: parseInt(newSnapLeads) || 0
      })
      if (response.data && response.data.status === 'success') {
        dispatch({ type: 'SET_ANALYTICS', payload: response.data.data })
        setNewSnapDate('')
        setNewSnapSpend('')
        setNewSnapRevenue('')
        setNewSnapImpressions('')
        setNewSnapClicks('')
        setNewSnapLeads('')
        setIsSnapModalOpen(false)
      }
    } catch (err) {
      console.error('Failed to add snapshot', err)
    }
  }

  const startEditSnapshot = (snap) => {
    setEditingSnapshotId(snap.id)
    setEditSnapVal({ ...snap })
  }

  const saveEditedSnapshot = async () => {
    try {
      const response = await axios.put(`/api/campaigns/${selectedCampaignId}/daily-logs/${editSnapVal.id}`, {
        date: editSnapVal.date,
        spend: parseFloat(editSnapVal.spend),
        revenue: parseFloat(editSnapVal.revenue),
        impressions: parseInt(editSnapVal.impressions) || 0,
        clicks: parseInt(editSnapVal.clicks) || 0,
        leads: parseInt(editSnapVal.leads) || 0
      })
      if (response.data && response.data.status === 'success') {
        dispatch({ type: 'SET_ANALYTICS', payload: response.data.data })
        setEditingSnapshotId(null)
      }
    } catch (err) {
      console.error('Failed to update snapshot', err)
    }
  }

  const handleDeleteSnapshot = async (logId) => {
    try {
      const response = await axios.delete(`/api/campaigns/${selectedCampaignId}/daily-logs/${logId}`)
      if (response.data && response.data.status === 'success') {
        dispatch({ type: 'SET_ANALYTICS', payload: response.data.data })
      }
    } catch (err) {
      console.error('Failed to delete snapshot', err)
    }
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
      campaignId: selectedCampaignId,
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

    const impA = test.impressionsA + Math.round(400 + Math.random() * 400) // eslint-disable-line react-hooks/purity
    const impB = test.impressionsB + Math.round(400 + Math.random() * 400) // eslint-disable-line react-hooks/purity
    const rateA = 0.02 + Math.random() * 0.025 // eslint-disable-line react-hooks/purity
    const rateB = 0.025 + Math.random() * 0.035 // eslint-disable-line react-hooks/purity
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

  useEffect(() => {
    if (!selectedCampaignId) return
    const fetchCampaignDetails = async () => {
      try {
        const [adSetsRes, logsRes] = await Promise.all([
          axios.get(`/api/campaigns/${selectedCampaignId}/adsets`),
          axios.get(`/api/campaigns/${selectedCampaignId}/daily-logs`)
        ])
        
        if (adSetsRes.data?.status === 'success') {
          dispatch({ type: 'SET_ADSETS', payload: adSetsRes.data.data })
        }
        if (logsRes.data?.status === 'success') {
          dispatch({ type: 'SET_ANALYTICS', payload: logsRes.data.data })
        }
      } catch (err) {
        console.error('Failed to load campaign details', err)
      }
    }
    fetchCampaignDetails()
  }, [selectedCampaignId, dispatch])

  const handleToggleCampaignStatus = async () => {
    try {
      const response = await axios.patch(`/api/campaigns/${selectedCampaignId}/toggle-status`)
      if (response.data && response.data.status === 'success') {
        dispatch({ type: 'UPDATE_CAMPAIGN', payload: response.data.data })
      }
    } catch (err) {
      console.error('Failed to toggle campaign status', err)
    }
  }

  return (
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
                <h2 className="text-lg font-medium text-[#0F172A] font-mona leading-tight">{selectedCampaign?.name}</h2>
                <span className="px-2 py-0.5 border border-[#E2E8F0] bg-[#F8FAFC] text-[#94A3B8] font-medium text-[9px] uppercase tracking-wide rounded-md font-mona">
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
              onClick={handleToggleCampaignStatus}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${selectedCampaign?.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${selectedCampaign?.status === 'active' ? 'translate-x-4' : 'translate-x-1'}`} />
            </button>
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
            { id: 'adsets', label: 'Ad Sets', count: activeAdSets.filter(a => a.campaignId === selectedCampaign?.id).length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setWorkspaceTab(tab.id)}
              className={`px-5 py-3.5 text-xs font-medium uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
                workspaceTab === tab.id 
                  ? 'border-[#FF2D20] text-[#FF2D20]' 
                  : 'border-transparent text-[#94A3B8] hover:text-[#475569]'
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-medium ${workspaceTab === tab.id ? 'bg-[#FFF1F0] text-[#FF2D20]' : 'bg-[#F8FAFC] text-[#94A3B8]'}`}>
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
                <span className="text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider block mb-0.5">Workspace Analytics</span>
                <span className="text-sm font-medium text-[#0F172A] block font-mona mb-4">Ad Spend vs Attributed Revenue</span>
                {state.analytics.filter(a => a.campaignId === selectedCampaign?.id).length > 0 ? (
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
                ) : (
                  <div className="w-full h-64 flex flex-col items-center justify-center border border-dashed border-[#E2E8F0] rounded-xl bg-[#F8FAFC]">
                    <ChartBarIcon className="w-8 h-8 text-[#94A3B8] mb-2 stroke-[1.5]" />
                    <p className="text-xs font-medium text-[#475569]">No graph data available</p>
                    <p className="text-[10px] font-medium text-[#94A3B8] mt-1 text-center max-w-[200px]">Add daily relational logs to generate ROAS and performance trends.</p>
                  </div>
                )}
              </div>

              {/* Relational snap logs list */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-xs font-medium text-[#0F172A] block font-mona">Daily Relational Entries</span>
                  <button
                    onClick={() => setIsSnapModalOpen(true)}
                    className="bg-[#FF2D20] hover:bg-[#E5261A] text-white text-[10px] font-medium px-3 py-1.5 rounded-xl cursor-pointer shadow-sm transition-all inline-flex items-center gap-1"
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                    Record Daily Log
                  </button>
                </div>

                {state.analytics.filter(a => a.campaignId === selectedCampaign?.id).length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                        <th className="p-4 text-[10px] font-medium text-[#0F172A] uppercase pl-6 font-mona">Date</th>
                        <th className="p-4 text-[10px] font-medium text-[#0F172A] uppercase font-mona">Spend</th>
                        <th className="p-4 text-[10px] font-medium text-[#0F172A] uppercase font-mona">Revenue</th>
                        <th className="p-4 text-[10px] font-medium text-[#0F172A] uppercase font-mona">ROAS</th>
                        <th className="p-4 text-[10px] font-medium text-[#0F172A] uppercase font-mona">Clicks / Imps</th>
                        <th className="p-4 text-[10px] font-medium text-[#0F172A] uppercase font-mona">Leads</th>
                        <th className="p-4 text-[10px] font-medium text-[#0F172A] uppercase pr-6 text-right font-mona">Actions</th>
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
                              <td className="p-4 pl-6 text-xs font-light text-[#0F172A]">
                                {isEditing ? (
                                  <input 
                                    type="date" 
                                    value={editSnapVal.date} 
                                    onChange={(e) => setEditSnapVal({ ...editSnapVal, date: e.target.value })}
                                    className="border border-[#E2E8F0] rounded px-2 py-1 text-xs font-semibold focus:outline-none"
                                  />
                                ) : snap.date}
                              </td>
                              <td className="p-4 text-xs font-light text-[#0F172A]">
                                {isEditing ? (
                                  <input 
                                    type="number" 
                                    value={editSnapVal.spend} 
                                    onChange={(e) => setEditSnapVal({ ...editSnapVal, spend: parseFloat(e.target.value) || 0 })}
                                    className="border border-[#E2E8F0] rounded px-2 py-1 text-xs font-semibold w-20 focus:outline-none"
                                  />
                                ) : `$${snap.spend.toLocaleString()}`}
                              </td>
                              <td className="p-4 text-xs font-light text-[#0F172A]">
                                {isEditing ? (
                                  <input 
                                    type="number" 
                                    value={editSnapVal.revenue} 
                                    onChange={(e) => setEditSnapVal({ ...editSnapVal, revenue: parseFloat(e.target.value) || 0 })}
                                    className="border border-[#E2E8F0] rounded px-2 py-1 text-xs font-semibold w-20 focus:outline-none"
                                  />
                                ) : `$${snap.revenue.toLocaleString()}`}
                              </td>
                              <td className="p-4 text-xs font-light text-[#0F172A]">{snapROAS}x</td>
                              <td className="p-4 text-xs font-light text-[#475569]">
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
                              <td className="p-4 text-xs font-light text-[#0F172A]">
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
                                      className="bg-green-600 hover:bg-green-700 text-white font-medium text-[10px] uppercase px-2.5 py-1.5 rounded-lg cursor-pointer"
                                    >
                                      Save
                                    </button>
                                    <button 
                                      onClick={() => setEditingSnapshotId(null)}
                                      className="bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-slate-100 text-[#475569] font-medium text-[10px] uppercase px-2.5 py-1.5 rounded-lg cursor-pointer"
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
                                      onClick={() => handleDeleteSnapshot(snap.id)}
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
                ) : (
                  <div className="p-10 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-center mb-3 text-[#94A3B8]">
                      <CircleStackIcon className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <h3 className="text-[13px] font-medium text-[#0F172A] font-mona mb-1">No analytics logs recorded</h3>
                    <p className="text-[11px] font-semibold text-[#94A3B8] max-w-[250px]">Click 'Record Daily Log' to add your daily ad performance metrics.</p>
                  </div>
                )}
              </div>

              {/* Add Snap form Modal */}
              <AnimatePresence>
                {isSnapModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white rounded-2xl shadow-xl border border-[#E2E8F0] w-full max-w-sm overflow-hidden relative"
                    >
                      <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
                        <span className="text-sm font-medium text-[#0F172A] font-mona">Record Daily Performance Log</span>
                        <button onClick={() => setIsSnapModalOpen(false)} className="text-[#94A3B8] hover:text-[#0F172A] transition-colors cursor-pointer">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      <div className="p-6 bg-[#F8FAFC]">
                        <form onSubmit={handleAddSnapshot} className="flex flex-col gap-4">
                          <div>
                            <label className="block text-[10px] font-medium text-[#475569] uppercase mb-1.5">Date</label>
                            <input 
                              type="date" 
                              value={newSnapDate}
                              onChange={(e) => setNewSnapDate(e.target.value)}
                              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FF2D20] bg-white"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-medium text-[#475569] uppercase mb-1.5">Spend ($)</label>
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
                            <label className="block text-[10px] font-medium text-[#475569] uppercase mb-1.5">Revenue ($)</label>
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
                            <label className="block text-[10px] font-medium text-[#475569] uppercase mb-1.5">Impressions</label>
                            <input 
                              type="number" 
                              placeholder="5000"
                              value={newSnapImpressions}
                              onChange={(e) => setNewSnapImpressions(e.target.value)}
                              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-xs font-semibold focus:outline-none bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-medium text-[#475569] uppercase mb-1.5">Clicks</label>
                            <input 
                              type="number" 
                              placeholder="240"
                              value={newSnapClicks}
                              onChange={(e) => setNewSnapClicks(e.target.value)}
                              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-xs font-semibold focus:outline-none bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-medium text-[#475569] uppercase mb-1.5">Leads</label>
                            <input 
                              type="number" 
                              placeholder="18"
                              value={newSnapLeads}
                              onChange={(e) => setNewSnapLeads(e.target.value)}
                              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-xs font-semibold focus:outline-none bg-white"
                            />
                          </div>
                          <button 
                            type="submit"
                            className="bg-[#FF2D20] hover:bg-[#E5261A] text-white py-2.5 px-4 mt-2 rounded-xl text-xs font-semibold tracking-wide cursor-pointer transition-colors shadow-sm w-full"
                          >
                            Save Performance Log
                          </button>
                        </form>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* SUB TAB 2: AD SETS */}
          {workspaceTab === 'adsets' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider block mb-0.5">Campaign Audiences</span>
                  <span className="text-sm font-medium text-[#0F172A] block font-mona">Ad Sets Management</span>
                </div>
                <button
                  onClick={() => dispatch({ type: 'SET_ACTIVE_PANEL', payload: { type: 'adset' } })}
                  className="bg-[#FF2D20] hover:bg-[#E5261A] text-white text-[11px] font-medium px-4 py-2 rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
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
                          <th className="p-4 text-[10px] font-medium text-[#FF2D20] uppercase tracking-wider pl-6 font-mona">Ad Set Name</th>
                          <th className="p-4 text-[10px] font-medium text-[#FF2D20] uppercase tracking-wider font-mona">Audience Type</th>
                          <th className="p-4 text-[10px] font-medium text-[#FF2D20] uppercase tracking-wider font-mona">Status</th>
                          <th className="p-4 text-[10px] font-medium text-[#FF2D20] uppercase tracking-wider font-mona">Daily Budget</th>
                          <th className="p-4 text-[10px] font-medium text-[#FF2D20] uppercase tracking-wider font-mona">Spend Today</th>
                          <th className="p-4 text-[10px] font-medium text-[#FF2D20] uppercase tracking-wider font-mona">Goal</th>
                          <th className="p-4 text-[10px] font-medium text-[#FF2D20] uppercase tracking-wider text-right pr-6 font-mona">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeAdSets
                          .filter(a => a.campaignId === selectedCampaign?.id)
                          .map(adSet => (
                            <tr key={adSet.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors group">
                              <td className="p-4 pl-6 text-xs font-medium text-[#0F172A]">
                                {adSet.name}
                                <span className="block text-[10px] font-semibold text-[#94A3B8] mt-0.5">{adSet.platform}</span>
                              </td>
                              <td className="p-4 text-xs font-semibold text-[#475569]">{adSet.audienceType}</td>
                              <td className="p-4"><StatusBadge status={adSet.status} /><SyncBadge sync_status={adSet.sync_status} /></td>
                              <td className="p-4 text-xs font-medium text-[#0F172A]">${adSet.budget.toLocaleString()}</td>
                              <td className="p-4 text-xs font-medium text-[#FF2D20]">${adSet.spendToday.toLocaleString()}</td>
                              <td className="p-4 text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider">{adSet.goal}</td>
                              <td className="p-4 pr-6 text-right">
                                <div className="inline-flex items-center gap-1.5 transition-opacity">
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
                                    className="p-1.5 hover:bg-white border border-transparent hover:border-[#E2E8F0] rounded-lg text-[#94A3B8] hover:text-[#0F172A] cursor-pointer transition-all shadow-sm"
                                  >
                                    <ChevronRightIcon className="w-3.5 h-3.5 stroke-[2]" />
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
                    <h3 className="text-sm font-medium text-[#0F172A] font-mona mb-1">No Ad Sets Configured</h3>
                    <p className="text-xs font-semibold text-[#94A3B8] max-w-xs mb-6">Create an ad set to define audience targeting, platform networks, and daily optimization goals.</p>
                    <button
                      onClick={() => dispatch({ type: 'SET_ACTIVE_PANEL', payload: { type: 'adset' } })}
                      className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] text-[#0F172A] text-xs font-medium px-4 py-2.5 rounded-xl cursor-pointer transition-all shadow-sm"
                    >
                      Create First Ad Set
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}




        </div>
      </motion.div>
    </AnimatePresence>
  )
}
