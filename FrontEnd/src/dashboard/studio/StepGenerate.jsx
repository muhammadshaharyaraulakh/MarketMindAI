import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SparklesIcon, BookmarkIcon, LinkIcon, ArrowPathIcon, CheckIcon } from '@heroicons/react/24/outline'

import CopyTab from './CopyTab'
import BannersTab from './BannersTab'
import KeywordsTab from './KeywordsTab'
import HistoryTab from './HistoryTab'

const LOADING_TEXTS = [
  "Combining image + context...",
  "Writing platform copy...",
  "Validating character limits...",
  "Composing banner layouts...",
  "Almost ready..."
]

export default function StepGenerate({ state, dispatch, appState }) {
  const [isLoading, setIsLoading] = useState(true)
  const [textIndex, setTextIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  // Toast state
  const [toastMessage, setToastMessage] = useState(null)
  
  // Attach to campaign dropdown state
  const [showCampaignDropdown, setShowCampaignDropdown] = useState(false)

  useEffect(() => {
    const textInterval = setInterval(() => {
      setTextIndex(prev => (prev + 1) % LOADING_TEXTS.length)
    }, 700)

    const duration = 3000
    const intervalTime = 50
    const steps = duration / intervalTime
    let currentStep = 0

    const progressInterval = setInterval(() => {
      currentStep++
      setProgress((currentStep / steps) * 100)
    }, intervalTime)

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, duration)

    return () => {
      clearInterval(textInterval)
      clearInterval(progressInterval)
      clearTimeout(timer)
    }
  }, [])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleSave = () => {
    showToast("Package saved to Library")
  }

  const handleAttach = (campaignName) => {
    setShowCampaignDropdown(false)
    showToast(`Attached to ${campaignName}`)
  }

  const handleReset = () => {
    dispatch({ type: 'RESET' })
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center w-full">
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="inline-block mb-6"
          >
            <SparklesIcon className="w-16 h-16 text-[#FF2D20]" />
          </motion.div>
          
          <div className="h-6 relative overflow-hidden mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={textIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute w-full text-center text-[#0F172A] font-semibold"
              >
                {LOADING_TEXTS[textIndex]}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-[#FF2D20] h-full transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'copy', label: 'Copy' },
    { id: 'banners', label: 'Banners' }
  ]
  if (state.selectedPlatform === 'Google') tabs.push({ id: 'keywords', label: 'Keywords' })
  tabs.push({ id: 'history', label: 'History' })

  // Ensure active tab is valid (e.g., if switching from Google to Meta, keywords tab shouldn't be active)
  const activeTabId = tabs.find(t => t.id === state.activeResultTab) ? state.activeResultTab : 'copy'

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tabs Header */}
      <div className="flex space-x-8 border-b border-gray-200 mb-6 px-2">
        {tabs.map((tab) => {
          const isActive = activeTabId === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.id })}
              className={`pb-3 text-sm font-semibold transition-colors relative ${
                isActive ? 'text-[#FF2D20]' : 'text-gray-500 hover:text-[#0F172A]'
              }`}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeResultTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF2D20]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTabId === 'copy' && <CopyTab platform={state.selectedPlatform} aiAnalysis={state.aiAnalysis} />}
        {activeTabId === 'banners' && <BannersTab state={state} dispatch={dispatch} />}
        {activeTabId === 'keywords' && <KeywordsTab state={state} />}
        {activeTabId === 'history' && <HistoryTab />}
      </div>

      {/* Final Actions Footer */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between relative">
          <div className="flex gap-3">
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors"
            >
              <BookmarkIcon className="w-4 h-4" />
              Save to Library
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowCampaignDropdown(!showCampaignDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors"
              >
                <LinkIcon className="w-4 h-4" />
                Attach to Campaign
              </button>
              {showCampaignDropdown && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg border border-gray-200 shadow-xl z-20 py-2">
                  <div className="px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Active Campaigns</div>
                  {(appState?.campaigns || [{id:1, name:'Summer Performance Ads'},{id:2, name:'Meta Retargeting Q2'}]).map(camp => (
                    <button 
                      key={camp.id}
                      onClick={() => handleAttach(camp.name)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0F172A]"
                    >
                      {camp.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 bg-[#FF2D20] hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Start New Generation
          </button>

          {/* Toast Notification */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg"
              >
                <CheckIcon className="w-4 h-4 text-green-400" />
                {toastMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
