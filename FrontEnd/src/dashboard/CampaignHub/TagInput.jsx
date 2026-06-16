import React, { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function TagInput({ tags, onChange, placeholder = 'Add tag...', label = 'Tags' }) {
  const [inputValue, setInputValue] = useState('')
  const [tagType, setTagType] = useState('Location')

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      const newTag = inputValue.trim()
      if (!tags.includes(newTag)) {
        onChange([...(tags || []), newTag])
      }
      setInputValue('')
    }
  }

  const removeTag = (tagToRemove) => {
    onChange((tags || []).filter(tag => tag !== tagToRemove))
  }

  return (
    <div>
      <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">{label}</label>
      <div className="flex flex-col gap-2 p-2 border border-[#E2E8F0] rounded-xl bg-white focus-within:border-[#FF2D20] transition-colors">
        <div className="flex flex-wrap gap-2 min-h-[28px]">
          {(tags || []).map((tag, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] font-semibold text-[#0F172A]">
              {tag}
              <button 
                type="button" 
                onClick={() => removeTag(tag)}
                className="ml-0.5 text-[#94A3B8] hover:text-red-500 transition-colors"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-[#E2E8F0] pt-2 mt-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm font-semibold text-[#0F172A] border-none focus:ring-0 outline-none placeholder-[#94A3B8]"
          />
        </div>
      </div>
      <p className="text-[10px] text-[#94A3B8] mt-1.5 font-medium">Press Enter to add.</p>
    </div>
  )
}
