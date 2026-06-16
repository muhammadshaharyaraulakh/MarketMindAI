import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'
import { 
  ArrowLeftIcon, PencilIcon, TrashIcon, ChevronRightIcon,
  ClipboardIcon, PlusIcon, CircleStackIcon,
  ArrowTrendingUpIcon, ChartBarIcon, CursorArrowRaysIcon,
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

  const handleAddSnapshot = (e) => {
    e.preventDefault()
    if (!newSnapDate || !newSnapSpend || !newSnapRevenue) return

    const newSnap = {
      id: Date.now(),
      campaignId: selectedCampaignId,
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
  )
}
