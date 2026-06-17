import React from 'react'
import { SparklesIcon } from '@heroicons/react/24/outline'

export default function AIExplanation({ text }) {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-purple-100 flex items-center gap-3">
        <SparklesIcon className="w-5 h-5 text-purple-600" />
        <h3 className="font-bold text-purple-900">AI Analysis</h3>
        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider rounded border border-purple-200">
          Powered by Gemini
        </span>
      </div>
      <div className="p-5">
        <p className="text-sm text-purple-900 leading-relaxed font-medium">
          {text}
        </p>
      </div>
      <div className="px-5 py-3 bg-white/50 border-t border-purple-100">
        <p className="text-xs text-purple-600/70">
          This projection is a statistical estimate based on historical trends, not a guarantee. Market conditions can change.
        </p>
      </div>
    </div>
  )
}
