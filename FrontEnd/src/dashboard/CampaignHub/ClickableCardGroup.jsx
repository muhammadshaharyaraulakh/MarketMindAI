import React from 'react'

export default function ClickableCardGroup({ options, selected, onChange, columns = 3 }) {
  const gridClass = columns === 2 ? 'grid-cols-2' : columns === 3 ? 'grid-cols-3' : 'grid-cols-1'

  return (
    <div className={`grid ${gridClass} gap-3`}>
      {options.map((opt) => {
        const isSelected = selected === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`p-3 rounded-xl border text-left transition-all ${
              isSelected 
                ? 'border-[#FF2D20] bg-red-50 shadow-[0_0_0_1px_rgba(255,45,32,0.1)]' 
                : 'border-[#E2E8F0] bg-white hover:border-[#94A3B8] hover:bg-[#F8FAFC]'
            }`}
          >
            <div className="flex items-start gap-3">
              {opt.icon && (
                <div className={`mt-0.5 shrink-0 ${isSelected ? 'text-[#FF2D20]' : 'text-[#94A3B8]'}`}>
                  {opt.icon}
                </div>
              )}
              <div>
                <div className={`text-xs font-medium ${isSelected ? 'text-[#0F172A]' : 'text-[#475569]'}`}>
                  {opt.label}
                </div>
                {opt.description && (
                  <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#FF2D20]/80' : 'text-[#94A3B8]'}`}>
                    {opt.description}
                  </div>
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
