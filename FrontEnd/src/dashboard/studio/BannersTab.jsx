import React from 'react'
import { ArrowPathIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'

export default function BannersTab({ state, dispatch }) {
  const brandColors = state.aiAnalysis?.colors || ['#1A1A2E', '#E94560', '#FFFFFF']
  const primaryColor = brandColors[0]
  const accentColor = brandColors[1] || '#FF2D20'
  const prodName = state.aiAnalysis?.productName || 'Product Name'

  const layouts = [
    { id: 'top_bar', name: 'Top Bar' },
    { id: 'bottom_bar', name: 'Bottom Bar' },
    { id: 'side_panel', name: 'Side Panel' }
  ]

  const handleSelect = (id) => {
    dispatch({ type: 'SET_BANNER_LAYOUT', payload: id })
  }

  // Generate mock sizes based on platform
  const getSizes = () => {
    switch(state.selectedPlatform) {
      case 'Meta': return ['1080×1080 — Feed Square', '1080×1350 — Portrait', '1080×1920 — Story/Reel']
      case 'Google': return ['300×250 — Medium Rectangle', '728×90 — Leaderboard', '336×280 — Large Rectangle', '160×600 — Wide Skyscraper', '320×50 — Mobile Leaderboard']
      case 'Snapchat': return ['1080×1920 — Story Ad']
      default: return ['1080×1080 — Square']
    }
  }

  return (
    <div className="py-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#0F172A]">Choose Your Layout</h3>
          <p className="text-sm text-gray-500">Pick a style or generate alternatives</p>
        </div>
        <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#0F172A] transition-colors">
          <ArrowPathIcon className="w-4 h-4" />
          Regenerate Layouts
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {layouts.map(layout => {
          const isSelected = state.selectedBannerLayout === layout.id
          
          return (
            <div key={layout.id} className="flex flex-col">
              <div 
                onClick={() => handleSelect(layout.id)}
                className={`relative h-40 rounded-xl mb-3 cursor-pointer overflow-hidden transition-all border-2 ${
                  isSelected ? 'border-[#FF2D20] ring-4 ring-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ backgroundColor: primaryColor }}
              >
                {/* Mock Banner Design based on layout */}
                {layout.id === 'top_bar' && (
                  <div className="absolute top-0 left-0 w-full h-1/3 flex items-center justify-center p-2" style={{ backgroundColor: accentColor }}>
                    <span className="text-white font-bold text-xs truncate">{prodName}</span>
                  </div>
                )}
                {layout.id === 'bottom_bar' && (
                  <div className="absolute bottom-0 left-0 w-full h-1/3 flex items-center justify-center p-2" style={{ backgroundColor: accentColor }}>
                    <span className="text-white font-bold text-xs truncate">Buy {prodName} Now</span>
                  </div>
                )}
                {layout.id === 'side_panel' && (
                  <div className="absolute top-0 right-0 w-1/3 h-full flex items-center justify-center p-2 text-center" style={{ backgroundColor: accentColor }}>
                    <span className="text-white font-bold text-[10px] break-words">{prodName} Sale</span>
                  </div>
                )}
              </div>
              <button 
                onClick={() => handleSelect(layout.id)}
                className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                  isSelected 
                    ? 'bg-[#FF2D20] text-white' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                Use This Layout
              </button>
            </div>
          )
        })}
      </div>

      {state.selectedBannerLayout && (
        <div className="pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h3 className="text-md font-bold text-[#0F172A] mb-4">Generated Sizes</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {getSizes().map((size, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col items-center group hover:border-gray-300 transition-colors">
                <div 
                  className="w-16 h-16 rounded mb-3 flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  <div className="w-full h-1/3" style={{ backgroundColor: accentColor }}></div>
                </div>
                <span className="text-xs text-center font-medium text-gray-700 mb-2 leading-tight">
                  {size}
                </span>
                <button className="mt-auto p-1.5 rounded-full bg-gray-50 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <ArrowDownTrayIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
