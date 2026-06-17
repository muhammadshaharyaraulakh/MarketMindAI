import React from 'react'

export default function ScenarioHistory({ scenarios, dispatch }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-[#0F172A] mb-4">Saved Scenarios</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map(s => (
          <div key={s.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-sm font-bold text-[#0F172A] truncate">{s.campaignName}</h4>
                <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded font-bold uppercase mt-1 inline-block">
                  {s.lever}
                </span>
              </div>
              <span className="text-xs text-gray-400">{s.date}</span>
            </div>
            
            <div className="text-xs text-gray-500 mb-4">
              Projected ROAS: <span className="font-bold text-gray-700">{s.roas}</span> • Rev: <span className="font-bold text-gray-700">{s.revenue}</span>
            </div>

            <div className="flex gap-2">
              <button 
                // in a real app this would reconstruct the state exactly
                onClick={() => {}}
                className="flex-1 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              >
                Load
              </button>
              <button 
                onClick={() => dispatch({ type: 'DELETE_SCENARIO', payload: s.id })}
                className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
