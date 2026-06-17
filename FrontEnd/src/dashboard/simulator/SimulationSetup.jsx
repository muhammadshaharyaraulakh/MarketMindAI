import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CurrencyDollarIcon, ArrowsRightLeftIcon, PauseCircleIcon } from '@heroicons/react/24/outline'
import ClickableCardGroup from '../CampaignHub/ClickableCardGroup'

export default function SimulationSetup({ state, dispatch, campaigns, adSets, onRun }) {
  const selectedCampaign = campaigns.find(c => c.id === parseInt(state.selectedCampaignId))
  
  const leverOptions = [
    { value: 'budget', label: 'Adjust Budget', description: 'Increase or decrease daily spend', icon: <CurrencyDollarIcon className="w-5 h-5" /> },
    { value: 'reallocate', label: 'Reallocate Platforms', description: 'Shift budget between platforms', icon: <ArrowsRightLeftIcon className="w-5 h-5" /> },
    { value: 'pause', label: 'Pause Underperformer', description: 'Simulate pausing a low-performing ad set', icon: <PauseCircleIcon className="w-5 h-5" /> }
  ]

  const isRunDisabled = !state.selectedCampaignId || !state.selectedLever || 
    (state.selectedLever === 'budget' && state.leverConfig.budgetPercent === undefined) ||
    (state.selectedLever === 'reallocate' && (!state.leverConfig.fromPlatform || !state.leverConfig.toPlatform || state.leverConfig.shiftPercent === undefined)) ||
    (state.selectedLever === 'pause' && !state.leverConfig.adSetId)

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-[#0F172A] mb-6">Configure Your What-If Scenario</h2>

        {/* Row 1 - Campaign Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Campaign</label>
          <select 
            className="w-full sm:w-1/2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 bg-white"
            value={state.selectedCampaignId || ''}
            onChange={(e) => dispatch({ type: 'SET_CAMPAIGN', payload: e.target.value })}
          >
            <option value="" disabled>Select a campaign...</option>
            {campaigns.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          
          <AnimatePresence>
            {selectedCampaign && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg overflow-hidden"
              >
                <span>{selectedCampaign.platform}</span>
                <span className="text-blue-300">•</span>
                <span>${selectedCampaign.budget.toLocaleString()}/day</span>
                <span className="text-blue-300">•</span>
                <span>7.68x ROAS</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Row 2 - Lever Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Simulation Action</label>
          <div className="opacity-100 transition-opacity" style={{ opacity: selectedCampaign ? 1 : 0.5, pointerEvents: selectedCampaign ? 'auto' : 'none' }}>
            <ClickableCardGroup 
              columns={3}
              options={leverOptions}
              selected={state.selectedLever}
              onChange={(val) => dispatch({ type: 'SET_LEVER', payload: val })}
            />
          </div>
        </div>

        {/* Row 3 - Lever Configuration */}
        <div className="min-h-[120px]">
          <AnimatePresence mode="wait">
            {state.selectedLever === 'budget' && (
              <motion.div key="budget" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="mb-4 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Budget Change</label>
                  <span className="text-sm font-bold text-[#FF2D20]">
                    New daily budget: ${Math.round(selectedCampaign.budget * (1 + (state.leverConfig.budgetPercent || 0) / 100)).toLocaleString()} 
                    ({(state.leverConfig.budgetPercent || 0) > 0 ? '+' : ''}{state.leverConfig.budgetPercent || 0}%)
                  </span>
                </div>
                <div className="relative pt-1">
                  <input
                    type="range"
                    min="-50" max="100" step="5"
                    value={state.leverConfig.budgetPercent || 0}
                    onChange={(e) => dispatch({ type: 'SET_LEVER_CONFIG', payload: { budgetPercent: parseInt(e.target.value) } })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF2D20]"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>-50%</span>
                    <span>0%</span>
                    <span>+100%</span>
                  </div>
                </div>
              </motion.div>
            )}

            {state.selectedLever === 'reallocate' && (
              <motion.div key="reallocate" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
                    <select 
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                      value={state.leverConfig.fromPlatform || ''}
                      onChange={e => dispatch({ type: 'SET_LEVER_CONFIG', payload: { fromPlatform: e.target.value } })}
                    >
                      <option value="" disabled>Select...</option>
                      <option>Meta</option><option>Google</option><option>Snapchat</option>
                    </select>
                  </div>
                  <div className="pt-5"><ArrowsRightLeftIcon className="w-5 h-5 text-gray-400" /></div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
                    <select 
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                      value={state.leverConfig.toPlatform || ''}
                      onChange={e => dispatch({ type: 'SET_LEVER_CONFIG', payload: { toPlatform: e.target.value } })}
                    >
                      <option value="" disabled>Select...</option>
                      <option>Meta</option><option>Google</option><option>Snapchat</option>
                    </select>
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Amount to Shift</label>
                    <span className="text-sm font-bold text-[#FF2D20]">
                      Moving ${Math.round(selectedCampaign.budget * ((state.leverConfig.shiftPercent || 0) / 100)).toLocaleString()}/day
                    </span>
                  </div>
                  <input
                    type="range" min="0" max="100" step="5"
                    value={state.leverConfig.shiftPercent || 0}
                    onChange={(e) => dispatch({ type: 'SET_LEVER_CONFIG', payload: { shiftPercent: parseInt(e.target.value) } })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF2D20]"
                  />
                </div>
              </motion.div>
            )}

            {state.selectedLever === 'pause' && (
              <motion.div key="pause" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Ad Set to Pause</label>
                <select 
                  className="w-full sm:w-1/2 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                  value={state.leverConfig.adSetId || ''}
                  onChange={e => dispatch({ type: 'SET_LEVER_CONFIG', payload: { adSetId: e.target.value } })}
                >
                  <option value="" disabled>Select Ad Set...</option>
                  {adSets.filter(a => a.campaignId === selectedCampaign.id).map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  Remaining ad sets will absorb this ad set's budget proportionally
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <button
          onClick={onRun}
          disabled={isRunDisabled}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
            isRunDisabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#FF2D20] hover:bg-red-600 text-white'
          }`}
        >
          Run Simulation
        </button>
      </div>
    </div>
  )
}
