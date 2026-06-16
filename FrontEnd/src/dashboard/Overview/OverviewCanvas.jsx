
import { motion } from 'framer-motion'
import { ResponsiveContainer, ComposedChart, PieChart, Pie, Bar, Line, Cell, XAxis, YAxis, Tooltip } from 'recharts'
import { CircleStackIcon, ArrowTrendingUpIcon, ChartBarIcon, CursorArrowRaysIcon } from '@heroicons/react/24/outline'

import CustomTooltip from '../components/CustomTooltip'
import KPICard from '../components/KPICard'

export default function OverviewCanvas({ portfolioStats, consolidatedDailyChartData, trafficShareData, showRevenue, setShowRevenue }) {
  return (
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
  )
}
