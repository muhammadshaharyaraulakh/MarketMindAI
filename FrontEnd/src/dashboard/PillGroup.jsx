import React from 'react'

export default function PillGroup({ options, selected, onChange, multiSelect = false }) {
  const isSelected = (value) => {
    if (multiSelect) {
      return Array.isArray(selected) && selected.includes(value)
    }
    return selected === value
  }

  const handleClick = (value) => {
    if (multiSelect) {
      const current = Array.isArray(selected) ? selected : []
      if (current.includes(value)) {
        onChange(current.filter(v => v !== value))
      } else {
        onChange([...current, value])
      }
    } else {
      onChange(value)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = isSelected(opt.value)
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleClick(opt.value)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors border ${
              active 
                ? 'bg-[#0F172A] text-white border-[#0F172A]' 
                : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#94A3B8] hover:bg-[#F8FAFC]'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
