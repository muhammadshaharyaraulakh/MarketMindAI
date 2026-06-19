import { useEffect, useReducer } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { SparklesIcon } from '@heroicons/react/24/outline'

import StepUpload from './StepUpload'
import StepAnalysis from './StepAnalysis'
import StepPlatform from './StepPlatform'
import StepQuestions from './StepQuestions'
import StepGenerate from './StepGenerate'

const STEPS = [
  { id: 1, label: 'Upload' },
  { id: 2, label: 'Analysis' },
  { id: 3, label: 'Platform' },
  { id: 4, label: 'Questions' },
  { id: 5, label: 'Generate' }
]

const INITIAL_STATE = {
  currentStep: 1,
  uploadedImage: null,
  aiAnalysis: { 
    productName: '', 
    category: '', 
    quality: '', 
    vibe: [], 
    colors: [], 
    audience: '' 
  },
  selectedPlatform: null,
  questionAnswers: {},
  isGenerating: false,
  generatedContent: { copy: {}, banners: [], keywords: [] },
  activeResultTab: 'copy',
  selectedBannerLayout: null,
  preSelectedCampaignName: null
}

function reducer(state, action) {
  switch(action.type) {
    case 'SET_STEP': 
      return { ...state, currentStep: action.payload }
    case 'SET_UPLOADED_IMAGE': 
      return { ...state, uploadedImage: action.payload }
    case 'SET_AI_ANALYSIS_FIELD':
      return { ...state, aiAnalysis: { ...state.aiAnalysis, [action.payload.key]: action.payload.value } }
    case 'SET_AI_ANALYSIS': 
      return { ...state, aiAnalysis: action.payload }
    case 'SET_PLATFORM': 
      return { ...state, selectedPlatform: action.payload }
    case 'SET_QUESTION_ANSWER': 
      return { ...state, questionAnswers: { ...state.questionAnswers, [action.payload.key]: action.payload.value } }
    case 'SET_GENERATING': 
      return { ...state, isGenerating: action.payload }
    case 'SET_GENERATED_CONTENT': 
      return { ...state, generatedContent: action.payload }
    case 'SET_ACTIVE_TAB': 
      return { ...state, activeResultTab: action.payload }
    case 'SET_BANNER_LAYOUT': 
      return { ...state, selectedBannerLayout: action.payload }
    case 'SET_PRE_SELECTED_CAMPAIGN':
      return { ...state, preSelectedCampaignName: action.payload }
    case 'RESET': 
      return INITIAL_STATE
    default: 
      return state
  }
}

export default function ContentStudio({ state: appState, dispatch: appDispatch }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.state && location.state.preSelectedPlatform) {
      dispatch({ type: 'SET_PLATFORM', payload: location.state.preSelectedPlatform })
      dispatch({ type: 'SET_PRE_SELECTED_CAMPAIGN', payload: location.state.campaignName })
      dispatch({ type: 'SET_STEP', payload: 4 })
      
      // Clean up the location state so refresh doesn't trigger it again
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const handleNext = () => {
    if (state.currentStep === 1 && !state.uploadedImage) return
    if (state.currentStep === 3 && !state.selectedPlatform) return
    if (state.currentStep < 5) dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 })
  }

  const handleBack = () => {
    if (state.currentStep > 1) {
      // If we jumped from campaign detail, maybe don't allow going back to platform/upload?
      // For now, let them go back normally.
      dispatch({ type: 'SET_STEP', payload: state.currentStep - 1 })
    }
  }

  const handleGenerate = () => {
    dispatch({ type: 'SET_STEP', payload: 5 })
  }

  const isNextDisabled = () => {
    if (state.currentStep === 1 && !state.uploadedImage) return true
    if (state.currentStep === 3 && !state.selectedPlatform) return true
    return false
  }

  return (
    <div className="flex flex-col h-full">
      {/* PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A] mb-2 flex items-center gap-2">
          <SparklesIcon className="w-6 h-6 text-[#FF2D20]" />
          Content Generation Studio
        </h1>
        <p className="text-[#475569] text-sm mb-6">
          Upload a product photo, answer a few questions, get a complete platform-ready ad package.
        </p>
        
        {state.preSelectedCampaignName && state.currentStep >= 4 && (
          <div className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-4 border border-blue-100">
            Generating for: {state.preSelectedCampaignName}
          </div>
        )}

        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          {STEPS.map((step, index) => {
            const isActive = state.currentStep === step.id
            const isCompleted = state.currentStep > step.id
            const isFuture = state.currentStep < step.id

            return (
              <div key={step.id} className="flex items-center">
                <div className="relative flex items-center justify-center">
                  {isActive && (
                    <motion.div
                      layoutId="activeStep"
                      className="absolute inset-0 bg-[#FF2D20] rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className={`relative z-10 flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isActive ? 'text-white' 
                    : isCompleted ? 'bg-green-50 text-green-700' 
                    : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isCompleted && <CheckCircleIcon className="w-4 h-4 mr-1.5" />}
                    {step.label}
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`w-8 h-[2px] mx-2 ${isCompleted ? 'bg-green-200' : 'bg-gray-100'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* STEP CONTENT AREA */}
      <div className="flex-1 relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {state.currentStep === 1 && <StepUpload state={state} dispatch={dispatch} />}
            {state.currentStep === 2 && <StepAnalysis state={state} dispatch={dispatch} onNext={handleNext} />}
            {state.currentStep === 3 && <StepPlatform state={state} dispatch={dispatch} />}
            {state.currentStep === 4 && <StepQuestions state={state} dispatch={dispatch} />}
            {state.currentStep === 5 && <StepGenerate state={state} dispatch={dispatch} appState={appState} appDispatch={appDispatch} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* STICKY FOOTER */}
      {state.currentStep < 5 && (
        <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between sticky bottom-0 bg-[#F8FAFC] pb-4 z-10">
          <div>
          </div>
          
          <div className="text-xs text-gray-400 font-medium">
            Step {state.currentStep} of 5
          </div>

          <div>
            {state.currentStep === 4 ? (
              <button
                onClick={handleGenerate}
                className="cursor-pointer bg-[#FF2D20] hover:bg-red-600 text-white rounded-lg px-6 py-2 text-sm font-medium transition-colors shadow-sm"
              >
                Generate Package
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={isNextDisabled()}
                className={`cursor-pointer rounded-lg px-6 py-2 text-sm font-medium transition-colors shadow-sm ${
                  isNextDisabled() 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#FF2D20] hover:bg-red-600 text-white'
                }`}
              >
                Continue
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
