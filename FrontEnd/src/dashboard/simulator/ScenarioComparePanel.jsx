import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'
import SimulationSetup from './SimulationSetup'

export default function ScenarioComparePanel({ state, dispatch, campaigns }) {
  const [isConfiguringB, setIsConfiguringB] = useState(false)
  const [localState, setLocalState] = useState({
    selectedCampaignId: state.selectedCampaignId,
    selectedLever: null,
    leverConfig: {}
  })

  // We need adSets for SimulationSetup if 'pause' is selected
  // Just mock an empty array or pass adSets if we passed them down
  const mockAdSets = [] 

  const handleRunB = () => {
    // Mock run for B
    const bSpend = Math.random() * 2000 + 2000
    const bRoas = 5.5 + Math.random()
    const bRev = bSpend * bRoas
    dispatch({ 
      type: 'SET_COMPARE_B', 
      payload: {
        name: `Scenario B: ${localState.selectedLever}`,
        roas: bRoas.toFixed(1) + 'x',
        revenue: `$${Math.round(bRev).toLocaleString()}`,
        spend: `$${Math.round(bSpend).toLocaleString()}`,
        rawSpend: bSpend,
        rawRoas: bRoas,
        rawRev: bRev
      } 
    })
    setIsConfiguringB(false)
  }

  const { a, b } = state.compareScenarios

  // For the chart, we need numeric values.
  const aSpendNum = a ? parseInt(a.spend.replace(/[^0-9]/g, '')) : 0
  const aRevNum = a ? parseInt(a.revenue.replace(/[^0-9]/g, '')) : 0
  const aRoasNum = a ? parseFloat(a.roas) : 0

  const chartData = []
  if (a) {
    chartData.push({
      name: 'Scenario A',
      Spend: aSpendNum,
      Revenue: aRevNum,
      ROAS: aRoasNum
    })
  }
  if (b) {
    chartData.push({
      name: 'Scenario B',
      Spend: b.rawSpend,
      Revenue: b.rawRev,
      ROAS: b.rawRoas
    })
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        className="fixed inset-0 bg-[#0F172A]/20 backdrop-blur-sm z-50" 
        onClick={() => dispatch({ type: 'CLOSE_COMPARE' })} 
      />
      <motion.div 
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full sm:w-[600px] bg-white border-l border-[#E2E8F0] shadow-2xl z-50 flex flex-col font-mona"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A]">Compare Scenarios</h2>
            <p className="text-[11px] font-semibold text-[#94A3B8] mt-0.5">Evaluate two different strategies side by side.</p>
          </div>
          <button onClick={() => dispatch({ type: 'CLOSE_COMPARE' })} className="p-2 hover:bg-[#F8FAFC] rounded-xl text-[#94A3B8] hover:text-[#0F172A] transition-colors">
            <XMarkIcon className="w-5 h-5 stroke-2" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/50">
          
          <div className="flex gap-4">
            {/* Column A */}
            <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-bold text-[#0F172A] mb-4 border-b border-gray-100 pb-2">Scenario A (Current)</h3>
              {a ? (
                <div className="space-y-3">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-400">Strategy</div>
                    <div className="text-sm font-medium text-gray-800">{a.name}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-400">Daily Spend</div>
                    <div className="text-sm font-bold text-[#FF2D20]">{a.spend}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-400">Projected ROAS</div>
                    <div className="text-sm font-bold text-green-600">{a.roas}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-400">Projected Revenue</div>
                    <div className="text-sm font-bold text-green-600">{a.revenue}</div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500">Run a simulation first.</p>
              )}
            </div>

            {/* Column B */}
            <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col">
              <h3 className="text-sm font-bold text-[#0F172A] mb-4 border-b border-gray-100 pb-2">Scenario B (Alternative)</h3>
              {b ? (
                <div className="space-y-3">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-400">Strategy</div>
                    <div className="text-sm font-medium text-gray-800">{b.name}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-400">Daily Spend</div>
                    <div className="text-sm font-bold text-[#FF2D20]">{b.spend}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-400">Projected ROAS</div>
                    <div className="text-sm font-bold text-green-600">{b.roas}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-400">Projected Revenue</div>
                    <div className="text-sm font-bold text-green-600">{b.revenue}</div>
                  </div>
                  <button onClick={() => setIsConfiguringB(true)} className="mt-2 text-xs text-blue-600 hover:underline">Change Scenario B</button>
                </div>
              ) : isConfiguringB ? (
                <div className="scale-90 origin-top-left -ml-2 -mt-2">
                  <SimulationSetup 
                    state={localState} 
                    dispatch={(action) => setLocalState(prev => {
                      if (action.type === 'SET_CAMPAIGN') return { ...prev, selectedCampaignId: action.payload }
                      if (action.type === 'SET_LEVER') return { ...prev, selectedLever: action.payload, leverConfig: {} }
                      if (action.type === 'SET_LEVER_CONFIG') return { ...prev, leverConfig: { ...prev.leverConfig, ...action.payload } }
                      return prev
                    })}
                    campaigns={campaigns}
                    adSets={mockAdSets}
                    onRun={handleRunB}
                  />
                </div>
              ) : (
                <button 
                  onClick={() => setIsConfiguringB(true)}
                  className="flex-1 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-[#FF2D20] hover:border-[#FF2D20] transition-colors p-6"
                >
                  <span className="text-2xl mb-1">+</span>
                  <span className="text-xs font-semibold">Add Scenario to Compare</span>
                </button>
              )}
            </div>
          </div>

          {/* Bar Chart */}
          {(a || b) && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mt-8">
              <h4 className="text-sm font-bold text-gray-700 mb-4">Comparison (Revenue)</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748B' }} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="Revenue" fill="#FF2D20" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        </div>

        <div className="p-6 border-t border-[#E2E8F0] flex justify-end bg-white">
          <button onClick={() => dispatch({ type: 'CLOSE_COMPARE' })} className="px-5 py-2.5 text-[13px] font-medium text-[#475569] hover:bg-gray-50 border border-transparent hover:border-[#E2E8F0] rounded-lg transition-colors cursor-pointer">
            Close
          </button>
        </div>
      </motion.div>
    </>
  )
}
