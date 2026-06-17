
import { motion } from 'framer-motion'
import { ResponsiveContainer, ComposedChart, PieChart, Pie, BarChart, Bar, LineChart, Line, AreaChart, Area, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { CircleStackIcon, ArrowTrendingUpIcon, ChartBarIcon, CursorArrowRaysIcon, UsersIcon, CurrencyDollarIcon, MegaphoneIcon, TrophyIcon } from '@heroicons/react/24/outline'

import CustomTooltip from '../components/CustomTooltip'
import KPICard from '../components/KPICard'

export default function OverviewCanvas({ 
  portfolioStats, 
  consolidatedDailyChartData, 
  trafficShareData, 
  showRevenue, 
  setShowRevenue,
  activeCampaignsCount,
  platformComparisonData,
  bestROASPlatform,
  cpaTrendData
}) {
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
        <KPICard title="Total Ad Spend" value={portfolioStats.totalSpend} change={8.2} isPositive={false} prefix="$" icon={CircleStackIcon} color="text-blue-600" />
        <KPICard title="Attributed Revenue" value={portfolioStats.totalRevenue} change={31.4} isPositive={true} prefix="$" icon={ArrowTrendingUpIcon} color="text-green-600" />
        <KPICard title="Average ROAS" value={portfolioStats.roas} change={5.9} isPositive={true} suffix="x" icon={ChartBarIcon} color="text-[#FF2D20]" />
        <KPICard title="Portfolio CTR" value={portfolioStats.ctr} change={12.4} isPositive={true} suffix="%" icon={CursorArrowRaysIcon} color="text-purple-600" />
      </div>

      {/* Stat Cards Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Conversions" value={portfolioStats.totalLeads} change={14.2} isPositive={true} icon={UsersIcon} color="text-indigo-600" />
        <KPICard title="Avg CPA" value={portfolioStats.cpa} change={-2.4} isPositive={true} prefix="$" icon={CurrencyDollarIcon} color="text-teal-600" />
        <KPICard title="Active Campaigns" value={activeCampaignsCount} change={0} isPositive={true} icon={MegaphoneIcon} color="text-orange-500" />
        <KPICard title={`Best Platform: ${bestROASPlatform?.platform || 'N/A'}`} value={bestROASPlatform?.roas || 0} change={8.5} isPositive={true} suffix="x" icon={TrophyIcon} color="text-yellow-500" />
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
            <ComposedChart data={consolidatedDailyChartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
              <XAxis dataKey="day" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="spend" name="Ad Spend" fill="#EFF6FF" stroke="#3B82F6" strokeWidth={1} radius={[4, 4, 0, 0]} barSize={32} />
              {showRevenue ? (
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#FF2D20" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
              ) : (
                <Line type="monotone" dataKey="roas" name="ROAS" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
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
                <Pie data={trafficShareData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {trafficShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-lg font-bold text-[#0F172A]">${portfolioStats.totalSpend.toLocaleString()}</span>
              <span className="text-[9px] font-bold text-[#94A3B8] uppercase mt-0.5">Total Spent</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E2E8F0]">
            {trafficShareData.map((item, idx) => (
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
              <BarChart data={platformComparisonData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
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
            <span className="text-lg font-bold text-[#F59E0B]">${portfolioStats.cpa}</span>
          </div>
        </div>
        
        <div className="w-full h-72 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cpaTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
