import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SparklesIcon, BookmarkIcon, ArrowPathIcon, CheckIcon } from '@heroicons/react/24/outline'
import axios from 'axios'

import CopyTab from './CopyTab'
import ImagesTab from './ImagesTab'
import KeywordsTab from './KeywordsTab'
import HistoryTab from './HistoryTab'

const LOADING_TEXTS = [
  "Combining image + context",
  "Writing platform copy",
  "Validating character limits",
  "Composing banner layouts",
  "Almost ready"
]

export default function StepGenerate({ state, dispatch, appState }) {
  const [isLoading, setIsLoading] = useState(true)
  const [textIndex, setTextIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  // Toast state
  const [toastMessage, setToastMessage] = useState(null)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const textInterval = setInterval(() => {
      setTextIndex(prev => (prev + 1) % LOADING_TEXTS.length)
    }, 700)

    const duration = 15000 // Fake progress bar length, but API call will stop it
    const intervalTime = 50
    const steps = duration / intervalTime
    let currentStep = 0

    const progressInterval = setInterval(() => {
      currentStep++
      setProgress(Math.min((currentStep / steps) * 100, 95)) // max 95% until done
    }, intervalTime)

    const generateContent = async () => {
      const payload = {
        image_path:       state.uploadedImage?.path || null,
        ai_analysis:      {
          product_name:    state.aiAnalysis.productName,
          category:        state.aiAnalysis.category,
          quality_level:   state.aiAnalysis.quality,
          vibe:            state.aiAnalysis.vibe,
          colors:          state.aiAnalysis.colors,
          likely_audience: state.aiAnalysis.audience,
        },
        platform:         state.selectedPlatform.toLowerCase(),
        question_answers: state.questionAnswers,
      };

      try {
        const res = await axios.post('/api/content-generation/generate', payload);
        const data = res.data;

        if (data.success || data.is_fallback) {
          dispatch({
            type: 'SET_GENERATED_CONTENT',
            payload: data.copy,
          });
          if (!data.success) {
             showToast(data.message || 'Generation failed. Using fallback.', 'error');
          }
        } else {
          setError(data.message ?? 'Generation failed.');
        }
      } catch (err) {
        setError('Request failed. Please retry.');
      } finally {
        clearInterval(progressInterval)
        setProgress(100)
        setTimeout(() => setIsLoading(false), 300)
      }
    };

    generateContent();

    return () => {
      clearInterval(textInterval)
      clearInterval(progressInterval)
    }
  }, [])

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type })
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleSave = async () => {
    if (isSaved) {
      showToast('Already saved to library!', 'success');
      return;
    }

    const payload = {
      image_path:       state.uploadedImage?.path || null,
      ai_analysis:      {
          product_name:    state.aiAnalysis.productName,
          category:        state.aiAnalysis.category,
          quality_level:   state.aiAnalysis.quality,
          vibe:            state.aiAnalysis.vibe,
          colors:          state.aiAnalysis.colors,
          likely_audience: state.aiAnalysis.audience,
      },
      platform:         state.selectedPlatform.toLowerCase(),
      question_answers: state.questionAnswers,
      generated_copy:   state.generatedContent,
    };

    try {
      const res = await axios.post('/api/content-generation/save', payload);
      if (res.data.success) {
        setIsSaved(true);
        showToast('Saved to library. Available for 24 hours.', 'success');
      } else {
        showToast('Save failed. Please try again.', 'error');
      }
    } catch (err) {
      showToast('Save failed. Please try again.', 'error');
    }
  }

  const handleReset = () => {
    dispatch({ type: 'RESET' })
  }

  if (isLoading || error) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center w-full">
          {error ? (
             <div>
               <div className="text-red-500 mb-4">{error}</div>
               <button onClick={handleReset} className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Start Over</button>
             </div>
          ) : (
            <>
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
            </>
          )}
        </div>
        {!error && (
          <div className="text-sm text-amber-700 bg-amber-50 px-4 py-2.5 rounded-lg border border-amber-200 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500 mt-4">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Please don't refresh or close this tab, or your progress will be lost.
          </div>
        )}
      </div>
    )
  }

  const tabs = [
    { id: 'copy', label: 'Copy' }
  ]
  if (state.selectedPlatform !== 'Google') {
    tabs.push({ id: 'images', label: 'AI Content' })
  }
  if (state.selectedPlatform === 'Google') {
    tabs.push({ id: 'keywords', label: 'Keywords' })
  }
  tabs.push({ id: 'history', label: 'History' })

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
              className={`cursor-pointer pb-3 text-sm font-semibold transition-colors relative ${
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
        {activeTabId === 'copy' && <CopyTab platform={state.selectedPlatform} aiAnalysis={state.aiAnalysis} generatedContent={state.generatedContent} />}
        {activeTabId === 'images' && <ImagesTab state={state} />}
        {activeTabId === 'keywords' && <KeywordsTab state={state} />}
        {activeTabId === 'history' && (
          <HistoryTab 
            onView={(gen) => {
              dispatch({ type: 'SET_PLATFORM', payload: gen.platform })
              dispatch({ type: 'SET_AI_ANALYSIS', payload: gen.ai_analysis })
              dispatch({ type: 'SET_GENERATED_CONTENT', payload: gen.generated_copy })
              if (gen.image_path) {
                dispatch({ type: 'SET_UPLOADED_IMAGE', payload: { path: gen.image_path, url: `/storage/${gen.image_path}`, file: null } })
              }
              dispatch({ type: 'SET_ACTIVE_TAB', payload: 'copy' })
            }} 
          />
        )}
      </div>

      {/* Final Actions Footer */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between relative">
          <div className="flex gap-3">
            <button 
              onClick={handleSave}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors"
            >
              <BookmarkIcon className="w-4 h-4" />
              Save to Library
            </button>
          </div>
          
          <button 
            onClick={handleReset}
            className="cursor-pointer flex items-center gap-2 bg-[#FF2D20] hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
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
                className={`absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg text-white ${toastMessage.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}
              >
                <CheckIcon className="w-4 h-4 text-white" />
                {toastMessage.msg}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

