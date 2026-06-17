import React, { useState } from 'react'
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, Legend } from 'recharts'

export default function ProjectionChart({ data }) {
  const [metric, setMetric] = useState('Revenue')

  const getLines = () => {
    switch(metric) {
      case 'Revenue':
        return { actual: 'actualRevenue', proj: 'projRevenue' }
      case 'ROAS':
        return { actual: 'actualRoas', proj: 'projRoas' }
      case 'Spend':
        return { actual: 'actualSpend', proj: 'projSpend' }
      default:
        return { actual: 'actualRevenue', proj: 'projRevenue' }
    }
  }

  const keys = getLines()

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-lg font-bold text-[#0F172A]">Projected Performance — Next 30 Days</h3>
          <p className="text-[12px] text-gray-500 mt-1 max-w-xl">
            Based on your last 30 days of actual performance. Assumes similar market conditions.
          </p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {['Revenue', 'ROAS', 'Spend'].map(m => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                metric === m ? 'bg-white text-[#0F172A] shadow-sm' : 'text-gray-500 hover:text-[#0F172A]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80 w-full mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748B' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#64748B' }} tickLine={false} axisLine={false} tickFormatter={(val) => metric === 'ROAS' ? `${val}x` : `$${val}`} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#0F172A', fontSize: '13px' }}
              labelStyle={{ color: '#64748B', fontSize: '12px', marginBottom: '4px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />

            {/* Confidence Band (Projected) */}
            <Area type="monotone" dataKey="confidenceMax" fill="#fca5a5" stroke="none" fillOpacity={0.2} name="Confidence Range" />
            <Area type="monotone" dataKey="confidenceMin" fill="#fff" stroke="none" fillOpacity={1} />
            
            {/* Actual Line */}
            <Line type="monotone" dataKey={keys.actual} stroke="#FF2D20" strokeWidth={2} dot={false} name="Actual" />
            
            {/* Projected Line */}
            <Line type="monotone" dataKey={keys.proj} stroke="#FF2D20" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Projected" />

            <ReferenceLine x={data[14]?.date} stroke="#94A3B8" strokeDasharray="3 3" label={{ position: 'top', value: 'Today', fill: '#64748B', fontSize: 11 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
