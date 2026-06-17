import React, { useReducer, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BeakerIcon, BookmarkIcon, ScaleIcon, CheckCircleIcon, CheckIcon } from '@heroicons/react/24/outline'

import SimulationSetup from './SimulationSetup'
import ProjectionChart from './ProjectionChart'
import ComparisonStats from './ComparisonStats'
import AIExplanation from './AIExplanation'
import ScenarioComparePanel from './ScenarioComparePanel'
import ScenarioHistory from './ScenarioHistory'
import ConfirmDialog from '../CampaignHub/ConfirmDialog'

const INITIAL_STATE = {
  selectedCampaignId: null,
  selectedLever: null,
  leverConfig: {},
  isSimulating: false,
  hasResults: false,
  projectionData: [],
  comparisonStats: { spend: {}, roas: {}, revenue: {} },
  aiExplanationText: '',
  savedScenarios: [
    { id: 1, campaignName: 'Summer Performance Ads', lever: 'Budget +20%', roas: '7.1x', revenue: '$25,100', date: '2 days ago' },
    { id: 2, campaignName: 'Meta Retargeting Q2', lever: 'Pause AdSet 3', roas: '6.8x', revenue: '$18,500', date: '1 week ago' }
  ],
  compareScenarios: { a: null, b: null },
  isComparePanelOpen: false,
  toastMessage: null,
  confirmDialog: { isOpen: false, type: null, message: '' }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_CAMPAIGN':
      return { ...state, selectedCampaignId: action.payload, hasResults: false }
    case 'SET_LEVER':
      return { ...state, selectedLever: action.payload, leverConfig: {}, hasResults: false }
    case 'SET_LEVER_CONFIG':
      return { ...state, leverConfig: { ...state.leverConfig, ...action.payload }, hasResults: false }
    case 'START_SIMULATION':
      return { ...state, isSimulating: true, hasResults: false }
    case 'SIMULATION_COMPLETE':
      return {
        ...state,
        isSimulating: false,
        hasResults: true,
        projectionData: action.payload.projectionData,
        comparisonStats: action.payload.comparisonStats,
        aiExplanationText: action.payload.aiExplanationText,
        compareScenarios: { a: action.payload.scenarioSummary, b: state.compareScenarios.b }
      }
    case 'SHOW_TOAST':
      return { ...state, toastMessage: action.payload }
    case 'HIDE_TOAST':
      return { ...state, toastMessage: null }
    case 'OPEN_COMPARE':
      return { ...state, isComparePanelOpen: true }
    case 'CLOSE_COMPARE':
      return { ...state, isComparePanelOpen: false }
    case 'SET_COMPARE_B':
      return { ...state, compareScenarios: { ...state.compareScenarios, b: action.payload } }
    case 'OPEN_CONFIRM':
      return { ...state, confirmDialog: { isOpen: true, type: action.payload.type, message: action.payload.message } }
    case 'CLOSE_CONFIRM':
      return { ...state, confirmDialog: { ...state.confirmDialog, isOpen: false } }
    case 'LOAD_SCENARIO':
      return {
        ...state,
        selectedCampaignId: action.payload.campaignId,
        selectedLever: action.payload.lever,
        leverConfig: action.payload.config,
        hasResults: true,
        projectionData: action.payload.results.projectionData,
        comparisonStats: action.payload.results.comparisonStats,
        aiExplanationText: action.payload.results.aiExplanationText
      }
    case 'DELETE_SCENARIO':
      return { ...state, savedScenarios: state.savedScenarios.filter(s => s.id !== action.payload) }
    default:
      return state
  }
}

export default function CampaignSimulator({ state: appState, dispatch: appDispatch }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  // Use the active campaigns from global state
  const activeCampaigns = appState.campaigns.filter(c => !c.deletedAt)
  const activeAdSets = appState.adSets.filter(a => !a.deletedAt)

  const selectedCampaign = activeCampaigns.find(c => c.id === parseInt(state.selectedCampaignId))

  const handleRunSimulation = () => {
    dispatch({ type: 'START_SIMULATION' })

    // Simulate calculation logic
    setTimeout(() => {
      // Mock Data Generation
      const baseSpend = selectedCampaign?.budget || 3120
      let newSpend = baseSpend
      
      if (state.selectedLever === 'budget') {
        const percent = state.leverConfig.budgetPercent || 0
        newSpend = baseSpend * (1 + percent / 100)
      }

      // Generate Chart Data (14 days past, 30 days future)
      const data = []
      const today = new Date()
      for (let i = -14; i <= 30; i++) {
        const d = new Date(today)
        d.setDate(d.getDate() + i)
        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        
        if (i <= 0) {
          data.push({ date: dateStr, actualSpend: baseSpend + (Math.random() * 200 - 100), actualRoas: 7.6 + (Math.random() * 0.4 - 0.2), actualRevenue: baseSpend * 7.6 })
        } else {
          // projection diverges
          const variance = i * 2 // band gets wider
          const projRoas = 6.2 + (Math.random() * 0.2 - 0.1)
          data.push({
            date: dateStr,
            projSpend: newSpend + (Math.random() * 100 - 50),
            projRoas: projRoas,
            projRevenue: newSpend * projRoas,
            confidenceMin: newSpend * (projRoas - (variance / 100)),
            confidenceMax: newSpend * (projRoas + (variance / 100))
          })
        }
      }

      const results = {
        projectionData: data,
        comparisonStats: {
          spend: { current: baseSpend, projected: newSpend },
          roas: { current: 7.68, projected: 6.2, range: '5.4x - 7.1x' },
          revenue: { current: baseSpend * 7.68, projected: newSpend * 6.2, range: '$24,100 - $31,200' }
        },
        aiExplanationText: `Based on ${selectedCampaign?.name}'s last 30 days, a ${state.leverConfig.budgetPercent || 0}% budget increase would likely push daily spend to $${Math.round(newSpend).toLocaleString()}. However, this campaign's ROAS has historically declined as daily spend exceeds $4,000 — your audience pool at this budget level shows signs of saturation. Expect ROAS to settle around 6.0x-6.5x rather than holding at 7.68x. Net revenue would still likely increase due to higher volume, but at a less efficient rate. Consider testing a smaller increase first to confirm the saturation point before committing to the full increase.`,
        scenarioSummary: {
          name: `Scenario A: ${state.selectedLever}`,
          roas: '6.2x',
          revenue: `$${Math.round(newSpend * 6.2).toLocaleString()}`,
          spend: `$${Math.round(newSpend).toLocaleString()}`
        }
      }

      dispatch({ type: 'SIMULATION_COMPLETE', payload: results })
    }, 2000)
  }

  const showToast = (msg) => {
    dispatch({ type: 'SHOW_TOAST', payload: msg })
    setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000)
  }

  const handleApply = () => {
    dispatch({ type: 'OPEN_CONFIRM', payload: { type: 'apply', message: `This will update ${selectedCampaign?.name}'s budget to $${Math.round(state.comparisonStats.spend.projected).toLocaleString()}/day. Continue?` } })
  }

  const onConfirm = () => {
    dispatch({ type: 'CLOSE_CONFIRM' })
    if (state.confirmDialog.type === 'apply') {
      showToast('Campaign updated')
    }
  }

  return (
    <div className="flex flex-col h-full font-mona relative">
      {/* PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Campaign Simulator</h1>
        <p className="text-[#475569] text-sm">
          Test budget and strategy changes before you spend real money — projections based on your actual campaign history.
        </p>
      </div>

      <div className="space-y-6 max-w-5xl">
        <SimulationSetup 
          state={state} 
          dispatch={dispatch} 
          campaigns={activeCampaigns} 
          adSets={activeAdSets} 
          onRun={handleRunSimulation} 
        />

        {state.isSimulating && (
          <div className="flex flex-col items-center justify-center py-12">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="mb-4">
              <BeakerIcon className="w-12 h-12 text-[#FF2D20]" />
            </motion.div>
            <SimulationLoadingText />
          </div>
        )}

        {state.hasResults && !state.isSimulating && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <ProjectionChart data={state.projectionData} />
            <ComparisonStats stats={state.comparisonStats} />
            <AIExplanation text={state.aiExplanationText} />
            
            {/* Actions Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <button onClick={() => showToast('Scenario saved')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded-lg transition-colors">
                <BookmarkIcon className="w-4 h-4" /> Save Scenario
              </button>
              <button onClick={() => dispatch({ type: 'OPEN_COMPARE' })} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded-lg transition-colors">
                <ScaleIcon className="w-4 h-4" /> Compare to Another Scenario
              </button>
              <div className="flex-1" />
              <button onClick={handleApply} className="flex items-center gap-2 px-6 py-2 text-sm font-medium bg-[#FF2D20] hover:bg-red-600 text-white rounded-lg shadow-sm transition-colors">
                <CheckCircleIcon className="w-4 h-4" /> Apply This Change
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {state.savedScenarios.length > 0 && (
        <div className="mt-12 max-w-5xl">
          <ScenarioHistory scenarios={state.savedScenarios} dispatch={dispatch} />
        </div>
      )}

      {/* Compare Panel */}
      <AnimatePresence>
        {state.isComparePanelOpen && (
          <ScenarioComparePanel state={state} dispatch={dispatch} campaigns={activeCampaigns} />
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {state.toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-8 left-1/2 bg-gray-900 text-white px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 shadow-2xl z-50"
          >
            <CheckIcon className="w-4 h-4 text-green-400" />
            {state.toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog 
        isOpen={state.confirmDialog.isOpen}
        title="Confirm Application"
        message={state.confirmDialog.message}
        onConfirm={onConfirm}
        onCancel={() => dispatch({ type: 'CLOSE_CONFIRM' })}
      />
    </div>
  )
}

function SimulationLoadingText() {
  const texts = ["Analyzing historical trend...", "Calculating projection...", "Modeling confidence range...", "Preparing explanation..."]
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    const int = setInterval(() => setIndex(prev => (prev + 1) % texts.length), 600)
    return () => clearInterval(int)
  }, [])

  return (
    <div className="h-6 relative overflow-hidden w-64">
      <AnimatePresence mode="wait">
        <motion.div key={index} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.2 }} className="absolute w-full text-center text-[#0F172A] font-medium text-sm">
          {texts[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
