import React from 'react'
import { MagnifyingGlassIcon, ChatBubbleBottomCenterIcon, VideoCameraIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import ClickableCardGroup from '../CampaignHub/ClickableCardGroup'

export default function StepPlatform({ state, dispatch }) {
  const platformOptions = [
    { label: 'Google Ads', value: 'Google', description: 'Search & Display', icon: <MagnifyingGlassIcon className="w-5 h-5" /> },
    { label: 'Meta Ads', value: 'Meta', description: 'Facebook & Instagram', icon: <ChatBubbleBottomCenterIcon className="w-5 h-5" /> },
    { label: 'Snapchat Ads', value: 'Snapchat', description: 'Story & Video', icon: <VideoCameraIcon className="w-5 h-5" /> }
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#0F172A] mb-2">Select Target Platform</h2>
        <p className="text-gray-500 text-sm">Choose where you want to run these ads to tailor the content perfectly.</p>
      </div>

      {state.selectedPlatform && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-2 mb-6">
          <InformationCircleIcon className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            You've created 3 ads for similar products before — I'll keep your brand voice consistent.
          </p>
        </div>
      )}

      <ClickableCardGroup 
        options={platformOptions}
        selected={state.selectedPlatform}
        onChange={(val) => dispatch({ type: 'SET_PLATFORM', payload: val })}
      />
    </div>
  )
}
