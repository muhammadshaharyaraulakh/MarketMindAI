import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
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

  const analyzedRef = React.useRef(false);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setTextIndex(prev => (prev + 1) % LOADING_TEXTS.length)
    }, 600)

    const analyzeImage = async () => {
      if (!state.uploadedImage || !state.uploadedImage.file) {
        setIsLoading(false);
        return;
      }
      
      const formData = new FormData();
      formData.append('image', state.uploadedImage.file);

      try {
        const res = await axios.post('/api/content-generation/analyze-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const data = res.data;

        if (data.success) {
          const analysisPayload = {
            productName: data.analysis.product_name || '',
            category: data.analysis.category || 'General',
            quality: data.analysis.quality_level || 'Mid-range',
            vibe: data.analysis.vibe || [],
            colors: (data.analysis.colors || []).map(c => typeof c === 'string' ? c : (c.hex || '#000000')),
            audience: data.analysis.likely_audience || ''
          };

          dispatch({
            type: 'SET_AI_ANALYSIS',
            payload: analysisPayload,
          });
          dispatch({
            type: 'SET_UPLOADED_IMAGE',
            payload: { ...state.uploadedImage, path: data.image_path }
          });
        }
      } catch (err) {
        console.error('Image analysis failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoading && !state.aiAnalysis.productName && state.uploadedImage?.file && !analyzedRef.current) {
      analyzedRef.current = true;
      analyzeImage();
    } else if (!state.uploadedImage?.file) {
      setIsLoading(false);
    }

    return () => {
      clearInterval(textInterval)
    }
  }, [])

  const handleChange = (key, value) => {
    dispatch({ type: 'SET_AI_ANALYSIS_FIELD', payload: { key, value } })
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[300px]">
        <div className="flex items-center gap-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm w-full mb-4">
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
        <div className="text-sm text-amber-700 bg-amber-50 px-4 py-2.5 rounded-lg border border-amber-200 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Please don't refresh or close this tab, or your progress will be lost.
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
              <input 
                type="text" 
                value={state.aiAnalysis.category} 
                onChange={e => handleChange('category', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
              />
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
      </div>
    </div>
  )
}
