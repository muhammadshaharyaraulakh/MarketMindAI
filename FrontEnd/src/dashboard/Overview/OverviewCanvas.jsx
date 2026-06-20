import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { ResponsiveContainer, ComposedChart, PieChart, Pie, BarChart, Bar, LineChart, Line, AreaChart, Area, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { CircleStackIcon, ArrowTrendingUpIcon, ChartBarIcon, CursorArrowRaysIcon, UsersIcon, CurrencyDollarIcon, MegaphoneIcon, TrophyIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

import CustomTooltip from '../components/CustomTooltip'
import KPICard from '../components/KPICard'

export default function OverviewCanvas() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [showRevenue, setShowRevenue] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await axios.get('/api/overview/dashboard')
      setData(res.data)
    } catch (e) {
      console.error(e)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <ArrowPathIcon className="w-8 h-8 text-[#FF2D20] animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading your real-time dashboard data...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4 bg-white border border-red-100 rounded-2xl p-8 max-w-lg mx-auto shadow-sm">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-2">
          <ChartBarIcon className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 font-mona">Failed to load dashboard</h3>
        <p className="text-sm text-slate-500 text-center max-w-sm">We couldn't retrieve your aggregated campaign data. Please check your connection and try again.</p>
        <button onClick={fetchData} className="px-5 py-2.5 bg-[#FF2D20] hover:bg-[#E5261A] text-white text-sm font-bold rounded-xl transition-colors shadow-sm">
          Retry Connection
        </button>
      </div>
    )
  }

  const { kpi_cards, revenue_spend_trend, platform_attribution, platform_efficiency, cpa_trend } = data
  
  // Format attribution for pie chart
  const colors = { Google: '#3B82F6', Meta: '#FF2D20', Snapchat: '#EAB308' }
  const formattedAttribution = platform_attribution.map(p => ({
    name: `${p.platform} Ads`,
    value: p.percentage,
    color: colors[p.platform] || '#64748B',
    spend: p.spend
  }))

  const getDayLabel = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formattedTrend = revenue_spend_trend.map(d => ({
    ...d,
    day: getDayLabel(d.date)
  }))

  const formattedCpaTrend = cpa_trend.daily.map(d => ({
    ...d,
    day: getDayLabel(d.date)
  }))

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-12">
      {/* Titles */}
      <div>
        <h2 className="text-2xl font-semibold text-[#0F172A] tracking-tight font-mona" style={{ fontVariationSettings: "'wdth' 100, 'wght' 550" }}>
          A Dashboard Built for <span className="text-[#FF2D20]">Real Decisions</span>
        </h2>
        <p className="text-sm font-medium text-[#475569] mt-1">Not vanity metrics. Actionable KPIs and unified ad spend attribution.</p>
      </div>

      {/* Stat Cards Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Ad Spend" value={kpi_cards.total_spend.value} change={kpi_cards.total_spend.change} isPositive={kpi_cards.total_spend.change !== null && kpi_cards.total_spend.change <= 0} prefix="$" icon={CircleStackIcon} color="text-blue-600" />
        <KPICard title="Attributed Revenue" value={kpi_cards.total_revenue.value} change={kpi_cards.total_revenue.change} isPositive={kpi_cards.total_revenue.change !== null && kpi_cards.total_revenue.change >= 0} prefix="$" icon={ArrowTrendingUpIcon} color="text-green-600" />
        <KPICard title="Average ROAS" value={kpi_cards.average_roas.value} change={kpi_cards.average_roas.change} isPositive={kpi_cards.average_roas.change !== null && kpi_cards.average_roas.change >= 0} suffix="x" icon={ChartBarIcon} color="text-[#FF2D20]" />
        <KPICard title="Portfolio CTR" value={kpi_cards.portfolio_ctr.value} change={kpi_cards.portfolio_ctr.change} isPositive={kpi_cards.portfolio_ctr.change !== null && kpi_cards.portfolio_ctr.change >= 0} suffix="%" icon={CursorArrowRaysIcon} color="text-purple-600" />
      </div>

      {/* Stat Cards Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Conversions" value={kpi_cards.total_conversions.value} change={kpi_cards.total_conversions.change} isPositive={kpi_cards.total_conversions.change !== null && kpi_cards.total_conversions.change >= 0} icon={UsersIcon} color="text-indigo-600" />
        <KPICard title="Avg CPA" value={kpi_cards.avg_cpa.value} change={kpi_cards.avg_cpa.change} isPositive={kpi_cards.avg_cpa.change !== null && kpi_cards.avg_cpa.change <= 0} prefix="$" icon={CurrencyDollarIcon} color="text-teal-600" />
        <KPICard title="Active Campaigns" value={kpi_cards.active_campaigns.value} change={kpi_cards.active_campaigns.change} isPositive={kpi_cards.active_campaigns.change !== null && kpi_cards.active_campaigns.change >= 0} icon={MegaphoneIcon} color="text-orange-500" />
        <KPICard title={`Best Platform: ${kpi_cards.best_platform.platform ? kpi_cards.best_platform.platform.charAt(0).toUpperCase() + kpi_cards.best_platform.platform.slice(1) : 'N/A'}`} value={kpi_cards.best_platform.roas} change={kpi_cards.best_platform.change} isPositive={kpi_cards.best_platform.change !== null && kpi_cards.best_platform.change >= 0} suffix="x" icon={TrophyIcon} color="text-yellow-500" />
      </div>

      {/* Full Width Revenue vs Ad Spend Chart */}
      <div className="border border-[#E2E8F0] rounded-2xl p-6 text-left bg-white shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-0.5">Campaign Performance</span>
            <span className="text-sm font-bold text-[#0F172A] block font-mona">Revenue vs Ad Spend (Current Month)</span>
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

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={formattedTrend} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
              <XAxis dataKey="day" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
              {!showRevenue && <YAxis yAxisId="right" orientation="right" stroke="#10B981" fontSize={10} tickLine={false} axisLine={false} />}
              <Tooltip content={<CustomTooltip />} />
              <Bar yAxisId="left" dataKey="spend" name="Ad Spend" fill="#EFF6FF" stroke="#3B82F6" strokeWidth={1} radius={[4, 4, 0, 0]} barSize={32} />
              {showRevenue ? (
                <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#FF2D20" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
              ) : (
                <Line yAxisId="right" type="monotone" dataKey="roas" name="ROAS" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Half Width Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Attribution Chart Panel */}
        <div className="border border-[#E2E8F0] rounded-2xl p-6 text-left bg-white shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-0.5">Traffic Source Attribution</span>
            <span className="text-sm font-bold text-[#0F172A] block font-mona">Attributed Sales Channels</span>
          </div>

          <div className="relative w-full h-56 flex items-center justify-center my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={formattedAttribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {formattedAttribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-lg font-bold text-[#0F172A]">${(kpi_cards.total_spend.value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="text-[9px] font-bold text-[#94A3B8] uppercase mt-0.5">Total Spent</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E2E8F0]">
            {formattedAttribution.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-[#475569]">
                <span className="w-3 h-3 rounded shrink-0 shadow-sm" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Comparison */}
        <div className="border border-[#E2E8F0] rounded-2xl p-6 text-left bg-white shadow-sm flex flex-col justify-between">
          <div className="mb-6">
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-0.5">Efficiency Split</span>
            <span className="text-sm font-bold text-[#0F172A] block font-mona">Spend vs Revenue by Platform</span>
          </div>
          <div className="w-full h-64 mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platform_efficiency} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="platform" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="spend" name="Ad Spend" fill="#EFF6FF" stroke="#3B82F6" strokeWidth={1} radius={[4, 4, 0, 0]} barSize={28} />
                <Bar dataKey="revenue" name="Revenue" fill="#ECFCCB" stroke="#84CC16" strokeWidth={1} radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Full Width CPA Trend Chart (Improved) */}
      <div className="border border-[#E2E8F0] rounded-2xl p-6 text-left bg-white shadow-sm flex flex-col justify-between relative overflow-hidden">
        {/* Subtle background gradient to make it "better" */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFFBEB]/50 to-transparent pointer-events-none" />
        
        <div className="mb-6 relative z-10 flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-0.5">Cost Efficiency</span>
            <span className="text-sm font-bold text-[#0F172A] block font-mona">CPA Trend (Current Month)</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-[#475569] block">Current Avg</span>
            <span className="text-lg font-bold text-[#F59E0B]">${(kpi_cards.avg_cpa.value || 0).toFixed(2)}</span>
          </div>
        </div>
        
        <div className="w-full h-72 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedCpaTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCpa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="cpa" 
                name="Avg CPA" 
                stroke="#F59E0B" 
                fillOpacity={1} 
                fill="url(#colorCpa)"
                strokeWidth={3} 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#F59E0B' }} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}
