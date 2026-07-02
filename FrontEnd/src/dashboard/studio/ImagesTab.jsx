import React from 'react'
import { PhotoIcon, VideoCameraIcon, SparklesIcon, LockClosedIcon } from '@heroicons/react/24/outline'

export default function ImagesTab({ state }) {
  return (
    <div className="py-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
            AI Content Generation 
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide uppercase shadow-sm">
              PRO Only
            </span>
          </h3>
          <p className="text-sm text-gray-500">
            Generate custom AI imagery and UGC (User-Generated Content) video scripts.
          </p>
        </div>
        <button 
          disabled
          className="bg-gray-200 cursor-not-allowed text-gray-400 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 whitespace-nowrap"
        >
          <SparklesIcon className="w-4 h-4" />
          Generate Assets
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 bg-gray-50 rounded-xl p-5 border border-gray-200 flex items-center gap-4 opacity-75">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <PhotoIcon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">AI Image Generation</h4>
            <p className="text-xs text-gray-500 mt-1">High-quality lifestyle & studio photography.</p>
          </div>
        </div>
        
        <div className="flex-1 bg-gray-50 rounded-xl p-5 border border-gray-200 flex items-center gap-4 opacity-75">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <VideoCameraIcon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Generate UGC Video Ads</h4>
            <p className="text-xs text-gray-500 mt-1">AI-directed creator scripts and storyboards.</p>
          </div>
        </div>
      </div>

      {/* Pro Only Box */}
      <div className="mt-8 border-2 border-dashed border-yellow-300 bg-yellow-50/50 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
        <div className="bg-yellow-100 p-4 rounded-full mb-4">
          <LockClosedIcon className="w-8 h-8 text-yellow-600" />
        </div>
        <h4 className="text-xl font-bold text-gray-800 mb-2">Premium Feature Locked</h4>
        <p className="text-sm text-gray-600 max-w-lg leading-relaxed">
          This feature is only available under the <strong className="text-gray-800">custom pro mode</strong>. We are currently working on it and it will be available in the future.
        </p>
      </div>

    </div>
  )
}

