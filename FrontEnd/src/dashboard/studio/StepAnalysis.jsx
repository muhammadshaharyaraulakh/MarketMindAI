import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import PillGroup from '../CampaignHub/PillGroup'
import TagInput from '../CampaignHub/TagInput'

const LOADING_TEXTS = [
  "Analyzing product...",
  "Detecting colors...",
  "Identifying audience...",
  "Almost done..."
]

export default function StepAnalysis({ state, dispatch, onNext }) {
  const [isLoading, setIsLoading] = useState(true)
  const [textIndex, setTextIndex] = useState(0)

  useEffect(() => {
    const textInterval = setInterval(() => {
      setTextIndex(prev => (prev + 1) % LOADING_TEXTS.length)
    }, 600)

    const timer = setTimeout(() => {
      setIsLoading(false)
      // Pre-fill mock data if not already set
      if (!state.aiAnalysis.productName) {
        dispatch({ type: 'SET_AI_ANALYSIS', payload: {
          productName: "Running Shoes",
          category: "Sports / Footwear",
          quality: "Mid-range",
          vibe: ["Sporty", "Energetic"],
          colors: ["#1A1A2E", "#E94560", "#FFFFFF"],
          audience: "Males, 18-34"
        }})
      }
    }, 2400) // 4 * 600

    return () => {
      clearInterval(textInterval)
      clearTimeout(timer)
    }
  }, [dispatch, state.aiAnalysis.productName])

  const handleChange = (key, value) => {
    dispatch({ type: 'SET_AI_ANALYSIS_FIELD', payload: { key, value } })
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto flex items-center justify-center min-h-[300px]">
        <div className="flex items-center gap-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm w-full">
          {state.uploadedImage && (
            <img 
              src={state.uploadedImage.url} 
              alt="Thumbnail" 
              className="w-20 h-20 rounded-lg object-cover border border-gray-100"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-[#FF2D20] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-[#FF2D20] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-[#FF2D20] rounded-full animate-bounce"></div>
              </div>
            </div>
            <div className="h-6 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={textIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute text-[#0F172A] font-medium"
                >
                  {LOADING_TEXTS[textIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg relative">
            <MagnifyingGlassIcon className="w-5 h-5" />
            <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse border border-white"></div>
          </div>
          <h2 className="text-lg font-bold text-[#0F172A]">AI Analysis Complete</h2>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Product Name</label>
              <input 
                type="text" 
                value={state.aiAnalysis.productName} 
                onChange={e => handleChange('productName', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Category</label>
              <select 
                value={state.aiAnalysis.category}
                onChange={e => handleChange('category', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 bg-white"
              >
                <option>Sports / Footwear</option>
                <option>Electronics</option>
                <option>Apparel</option>
                <option>Home & Garden</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Quality Level</label>
            <PillGroup 
              options={[
                { label: 'Budget', value: 'Budget' },
                { label: 'Mid-range', value: 'Mid-range' },
                { label: 'Premium', value: 'Premium' }
              ]}
              selected={state.aiAnalysis.quality}
              onChange={val => handleChange('quality', val)}
            />
          </div>

          <div>
            <TagInput 
              label="Vibe / Mood"
              tags={state.aiAnalysis.vibe}
              onChange={tags => handleChange('vibe', tags)}
              placeholder="Add a vibe..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Detected Colors</label>
            <div className="flex gap-4">
              {state.aiAnalysis.colors.map((color, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <div 
                    className="w-8 h-8 rounded-full border border-gray-200 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[10px] text-gray-500 font-medium uppercase">{color}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Likely Audience</label>
            <input 
              type="text" 
              value={state.aiAnalysis.audience} 
              onChange={e => handleChange('audience', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
            />
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-100 flex items-center gap-3">
          <button 
            onClick={onNext}
            className="bg-[#FF2D20] hover:bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Looks Good, Continue
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            Edit Manually
          </button>
        </div>
      </div>
    </div>
  )
}
