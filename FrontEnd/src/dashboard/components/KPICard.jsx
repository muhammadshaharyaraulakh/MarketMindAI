import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid'

export default function KPICard({ title, value, change, isPositive, suffix = '', prefix = '', icon: Icon, color = 'text-[#FF2D20]' }) {
  return (
    <div className="bg-[#F8FAFC] rounded-xl p-5 border border-[#E2E8F0] shadow-sm text-left flex flex-col justify-between hover:shadow-md transition-all duration-300">
      <div>
        <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1 font-mona">{title}</span>
        <span className="text-2xl font-extrabold text-[#0F172A] font-mona block mb-1" style={{ fontVariationSettings: "'wdth' 100, 'wght' 600" }}>
          {prefix}{(value || 0).toLocaleString(undefined, { minimumFractionDigits: typeof value === 'number' && !Number.isInteger(value) ? 2 : 0, maximumFractionDigits: 3 })}{suffix}
        </span>
      </div>
      <div className="flex items-center justify-between mt-2">
        {change !== null && change !== undefined ? (
          <span className={`inline-flex items-center text-xs font-bold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
            {isPositive ? <ArrowUpIcon className="w-3.5 h-3.5 mr-0.5 shrink-0" /> : <ArrowDownIcon className="w-3.5 h-3.5 mr-0.5 shrink-0" />}
            {Math.abs(change).toFixed(2)}% vs last period
          </span>
        ) : (
          <span className="inline-flex items-center text-xs font-medium text-slate-400">
            No prior data
          </span>
        )}
        <div className={`p-1.5 bg-white border border-[#E2E8F0] rounded-lg ${color}`}>
          <Icon className="w-4 h-4 stroke-[1.5]" />
        </div>
      </div>
    </div>
  )
}
