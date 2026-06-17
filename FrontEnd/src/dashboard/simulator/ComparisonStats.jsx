import React from 'react'
import { ArrowRightIcon } from '@heroicons/react/24/solid'

export default function ComparisonStats({ stats }) {
  // Helpers for determining color direction
  // Spend: neutral/bad if increases, we'll use gray or red depending on preference, instruction says red-600 if cost increases.
  const spendColor = stats.spend.projected > stats.spend.current ? 'text-red-600' : 'text-green-600'
  const roasColor = stats.roas.projected < stats.roas.current ? 'text-red-600' : 'text-green-600'
  const revColor = stats.revenue.projected > stats.revenue.current ? 'text-green-600' : 'text-red-600'

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Spend Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Daily Spend</h4>
        <div className="flex items-center gap-3">
          <span className="text-lg font-medium text-gray-400">${Math.round(stats.spend.current).toLocaleString()}</span>
          <ArrowRightIcon className="w-4 h-4 text-gray-300" />
          <span className={`text-2xl font-bold ${spendColor}`}>${Math.round(stats.spend.projected).toLocaleString()}</span>
        </div>
      </div>

      {/* ROAS Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Projected ROAS</h4>
        <div className="flex items-center gap-3">
          <span className="text-lg font-medium text-gray-400">{stats.roas.current}x</span>
          <ArrowRightIcon className="w-4 h-4 text-gray-300" />
          <span className={`text-2xl font-bold ${roasColor}`}>{stats.roas.projected.toFixed(2)}x</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">Range: {stats.roas.range}</p>
      </div>

      {/* Revenue Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Projected Revenue</h4>
        <div className="flex items-center gap-3">
          <span className="text-lg font-medium text-gray-400">${Math.round(stats.revenue.current).toLocaleString()}/mo</span>
          <ArrowRightIcon className="w-4 h-4 text-gray-300" />
          <span className={`text-2xl font-bold ${revColor}`}>${Math.round(stats.revenue.projected).toLocaleString()}/mo</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">Range: {stats.revenue.range}</p>
      </div>
    </div>
  )
}
