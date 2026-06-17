import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { XMarkIcon, UserGroupIcon, GlobeAltIcon, SparklesIcon, EyeIcon } from '@heroicons/react/24/outline'
import ClickableCardGroup from './ClickableCardGroup'
import PillGroup from './PillGroup'
import TagInput from './TagInput'

export default function AdSetPanel({ item, campaignId, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    audienceType: 'Broad',
    platform: 'Google',
    status: 'Active',
    budget: 500,
    budget_type: 'Daily',
    start_time: new Date().toISOString().slice(0, 16),
    end_time: '',
    frequency_cap: 'None',
    billing_event: 'IMPRESSIONS',
    goal: 'CONVERSIONS',
    targeting: {
      age_min: 18,
      age_max: 65,
      genders: ['All'],
      locations: [],
      interests: [],
      placements: []
    }
  })

  useEffect(() => {
    if (item) {
      setFormData({
        ...formData,
        ...item,
        targeting: {
          ...formData.targeting,
          ...(item.targeting || {})
        }
      })
    }
  }, [item])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      id: item?.id || Date.now(),
      campaignId: item?.campaignId || campaignId,
      budget: parseFloat(formData.budget) || 0,
      spendToday: item?.spendToday || 0
    })
  }

  const audienceOptions = [
    { value: 'Broad', label: 'Broad Match', description: 'Reach the widest possible audience', icon: <GlobeAltIcon className="w-5 h-5" /> },
    { value: 'Custom', label: 'Custom', description: 'Target specific behaviors and demographics', icon: <UserGroupIcon className="w-5 h-5" /> },
    { value: 'Retargeting', label: 'Retargeting', description: 'Show ads to previous site visitors', icon: <EyeIcon className="w-5 h-5" /> },
    { value: 'Lookalike', label: 'Lookalike', description: 'Find users similar to your best customers', icon: <SparklesIcon className="w-5 h-5" /> }
  ]

  const goalOptions = [
    { value: 'CONVERSIONS', label: 'Conversions' },
    { value: 'CLICKS', label: 'Link Clicks' },
    { value: 'IMPRESSIONS', label: 'Impressions' }
  ]

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        className="fixed inset-0 bg-[#0F172A]/20 backdrop-blur-sm z-50" 
        onClick={onClose} 
      />
      <motion.div 
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white border-l border-[#E2E8F0] shadow-2xl z-50 flex flex-col font-mona"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-medium text-[#0F172A]">{item ? 'Edit Ad Set' : 'Create Ad Set'}</h2>
              {item && item.sync_status && (
                <span className={`px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider rounded border ${
                  item.sync_status === 'SYNCED' ? 'bg-[#F0FDF4] text-green-700 border-green-200' : 
                  item.sync_status === 'PENDING' ? 'bg-[#FFFBEB] text-amber-700 border-amber-200' :
                  'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0]'
                }`}>
                  {item.sync_status}
                </span>
              )}
            </div>
            <p className="text-[11px] font-semibold text-[#94A3B8] mt-0.5">Define audiences, targeting, and budgets.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#F8FAFC] rounded-xl text-[#94A3B8] hover:text-[#0F172A] transition-colors">
            <XMarkIcon className="w-5 h-5 stroke-2" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="adset-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-medium text-[#94A3B8] uppercase mb-1.5">Ad Set Name</label>
                <input 
                  type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-[#94A3B8] uppercase mb-1.5">Status</label>
                <select 
                  value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none bg-white"
                >
                  <option>Active</option>
                  <option>Paused</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-[#94A3B8] uppercase mb-2">Audience Type</label>
              <ClickableCardGroup 
                options={audienceOptions}
                selected={formData.audienceType}
                onChange={(val) => setFormData({...formData, audienceType: val})}
                columns={2}
              />
            </div>

            <hr className="border-[#E2E8F0]" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-medium text-[#94A3B8] uppercase mb-2">Optimization Goal</label>
                <PillGroup 
                  options={goalOptions}
                  selected={formData.goal}
                  onChange={(val) => setFormData({...formData, goal: val})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-[#94A3B8] uppercase mb-1.5">Billing Event</label>
                <select 
                  value={formData.billing_event} onChange={e => setFormData({...formData, billing_event: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none bg-white"
                >
                  <option value="IMPRESSIONS">Impressions</option>
                  <option value="CLICKS">Link Clicks</option>
                  <option value="CONVERSIONS">Conversions</option>
                </select>
              </div>
            </div>

            <hr className="border-[#E2E8F0]" />

            <div>
              <h3 className="text-[13px] font-medium text-[#0F172A] mb-4">Detailed Targeting</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[10px] font-medium text-[#94A3B8] uppercase mb-1.5">Age Range</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" min="13" max="65" value={formData.targeting.age_min} onChange={e => setFormData({...formData, targeting: {...formData.targeting, age_min: parseInt(e.target.value)}})}
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none"
                    />
                    <span className="text-[#94A3B8] font-medium">-</span>
                    <input 
                      type="number" min="13" max="65" value={formData.targeting.age_max} onChange={e => setFormData({...formData, targeting: {...formData.targeting, age_max: parseInt(e.target.value)}})}
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-[#94A3B8] uppercase mb-1.5">Genders</label>
                  <div className="flex bg-[#F8FAFC] p-1 rounded-lg border border-[#E2E8F0]">
                    {['All', 'Men', 'Women'].map(opt => {
                      const isSelected = formData.targeting.genders.includes(opt)
                      return (
                        <button
                          key={opt} type="button"
                          onClick={() => {
                            if (opt === 'All') setFormData({...formData, targeting: {...formData.targeting, genders: ['All']}})
                            else setFormData({...formData, targeting: {...formData.targeting, genders: [opt]}})
                          }}
                          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${isSelected ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#475569] hover:text-[#0F172A]'}`}
                        >
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <TagInput 
                  tags={formData.targeting.locations} 
                  onChange={(newTags) => setFormData({
                    ...formData, 
                    targeting: { ...formData.targeting, locations: newTags }
                  })}
                  label="Locations"
                  placeholder="e.g. United States, New York"
                />

                <TagInput 
                  tags={formData.targeting.interests} 
                  onChange={(newTags) => setFormData({
                    ...formData, 
                    targeting: { ...formData.targeting, interests: newTags }
                  })}
                  label="Interests"
                  placeholder="e.g. SaaS, Marketing"
                />
              </div>
            </div>

            <hr className="border-[#E2E8F0]" />

            <div>
              <label className="block text-[10px] font-medium text-[#94A3B8] uppercase mb-2">Placements</label>
              <PillGroup 
                options={[
                  { value: 'Feed', label: 'Feeds' },
                  { value: 'Stories', label: 'Stories' },
                  { value: 'Reels', label: 'Reels' },
                  { value: 'Search', label: 'Search Results' },
                  { value: 'Network', label: 'Audience Network' }
                ]}
                selected={formData.targeting.placements || []}
                onChange={(val) => setFormData({...formData, targeting: {...formData.targeting, placements: val}})}
                multiSelect={true}
              />
            </div>

            <hr className="border-[#E2E8F0]" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-medium text-[#94A3B8] uppercase mb-1.5">Budget Type</label>
                <select 
                  value={formData.budget_type} onChange={e => setFormData({...formData, budget_type: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none bg-white"
                >
                  <option>Daily</option>
                  <option>Lifetime</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-[#94A3B8] uppercase mb-1.5">Budget Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-[#94A3B8] font-medium">$</span>
                  <input 
                    type="number" min="0" required value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})}
                    className="w-full pl-6 pr-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-medium text-[#94A3B8] uppercase mb-1.5">Start Time</label>
                <input 
                  type="datetime-local" required value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-[#94A3B8] uppercase mb-1.5">End Time</label>
                <input 
                  type="datetime-local" value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-[#94A3B8] uppercase mb-1.5">Frequency Cap</label>
              <select 
                value={formData.frequency_cap} onChange={e => setFormData({...formData, frequency_cap: e.target.value})}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none bg-white"
              >
                <option value="None">No Limit</option>
                <option value="1 per day">1 impression per 24 hours</option>
                <option value="3 per day">3 impressions per 24 hours</option>
                <option value="5 per week">5 impressions per 7 days</option>
              </select>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-[#E2E8F0] flex justify-end gap-3 bg-[#F8FAFC]">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-[13px] font-medium text-[#475569] hover:bg-white border border-transparent hover:border-[#E2E8F0] rounded-lg transition-colors cursor-pointer">
            Cancel
          </button>
          <button type="submit" form="adset-form" className="bg-[#FF2D20] hover:bg-[#E5261A] text-white text-[13px] font-medium px-6 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer">
            {item ? 'Save Changes' : 'Create Ad Set'}
          </button>
        </div>
      </motion.div>
    </>
  )
}
