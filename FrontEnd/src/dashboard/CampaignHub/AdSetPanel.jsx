import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { XMarkIcon, UserGroupIcon, GlobeAltIcon, SparklesIcon, EyeIcon } from '@heroicons/react/24/outline'
import ClickableCardGroup from './ClickableCardGroup'
import PillGroup from './PillGroup'
import TagInput from './TagInput'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function AdSetPanel({ item, campaignId, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    audienceType: 'Broad',
    platform: 'Google',
    status: 'Active',
    budget: 500,
    budget_type: 'Daily',
    start_time: new Date(),
    end_time: '',
    frequency_cap: 'None',
    billing_event: 'cpm',
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
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const formatMySQLDate = (d) => d ? new Date(d).toISOString().slice(0, 19).replace('T', ' ') : null;
      
      await onSave({
        ...formData,
        ...formData.targeting,
        start_time: formatMySQLDate(formData.start_time),
        end_time: formatMySQLDate(formData.end_time),
        id: item?.id || Date.now(),
        campaignId: item?.campaignId || campaignId,
        budget: parseFloat(formData.budget) || 0,
        spendToday: item?.spendToday || 0
      })
    } catch (err) {
      if (err.response?.status === 422) {
        setError(err.response.data.message || 'Validation failed. Please check your inputs.')
      } else {
        setError(err.response?.data?.message || 'An unexpected error occurred while saving.')
      }
    } finally {
      setIsSubmitting(false)
    }
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
          <button onClick={onClose} className="p-2 hover:bg-[#F8FAFC] rounded-xl text-[#94A3B8] hover:text-[#0F172A] transition-colors cursor-pointer">
            <XMarkIcon className="w-5 h-5 stroke-2" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl flex flex-col gap-1">
              <span className="text-xs font-semibold text-red-800">Unable to save ad set</span>
              <span className="text-xs font-medium text-red-600">{error}</span>
            </div>
          )}
          <form id="adset-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-medium text-[#94A3B8] uppercase mb-1.5">Ad Set Name</label>
                <input 
                  type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold placeholder:font-light focus:border-[#FF2D20] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-light text-[#94A3B8] uppercase mb-1.5">Status</label>
                <select 
                  value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-light focus:border-[#FF2D20] focus:outline-none bg-white cursor-pointer"
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
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-light focus:border-[#FF2D20] focus:outline-none bg-white cursor-pointer"
                >
                  <option value="cpm">Impressions</option>
                  <option value="cpc">Link Clicks</option>
                  <option value="cpa">Conversions</option>
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
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold placeholder:font-light focus:border-[#FF2D20] focus:outline-none"
                    />
                    <span className="text-[#94A3B8] font-medium">-</span>
                    <input 
                      type="number" min="13" max="65" value={formData.targeting.age_max} onChange={e => setFormData({...formData, targeting: {...formData.targeting, age_max: parseInt(e.target.value)}})}
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold placeholder:font-light focus:border-[#FF2D20] focus:outline-none"
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
                          className={`flex-1 py-1.5 text-xs font-medium rounded-md cursor-pointer transition-colors ${isSelected ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#475569] hover:text-[#0F172A]'}`}
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
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-light focus:border-[#FF2D20] focus:outline-none bg-white cursor-pointer"
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
                    className="w-full pl-6 pr-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold placeholder:font-light focus:border-[#FF2D20] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-medium text-[#94A3B8] uppercase mb-1.5">Start Time</label>
                <div className="relative">
                  <DatePicker 
                    selected={formData.start_time ? new Date(formData.start_time) : null} 
                    onChange={date => setFormData({...formData, start_time: date ? date.toISOString().slice(0, 16) : ''})}
                    showTimeSelect
                    dateFormat="MMM d, yyyy h:mm aa"
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold placeholder:font-light focus:border-[#FF2D20] focus:outline-none cursor-pointer"
                    placeholderText="Select start time"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-[#94A3B8] uppercase mb-1.5">End Time</label>
                <div className="relative">
                  <DatePicker 
                    selected={formData.end_time ? new Date(formData.end_time) : null} 
                    onChange={date => setFormData({...formData, end_time: date ? date.toISOString().slice(0, 16) : ''})}
                    showTimeSelect
                    dateFormat="MMM d, yyyy h:mm aa"
                    minDate={formData.start_time ? new Date(formData.start_time) : null}
                    isClearable
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold placeholder:font-light focus:border-[#FF2D20] focus:outline-none cursor-pointer"
                    placeholderText="No end time"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-[#94A3B8] uppercase mb-1.5">Frequency Cap</label>
              <select 
                value={formData.frequency_cap} onChange={e => setFormData({...formData, frequency_cap: e.target.value})}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-light focus:border-[#FF2D20] focus:outline-none bg-white cursor-pointer"
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
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 text-[13px] font-medium text-[#475569] hover:bg-white border border-transparent hover:border-[#E2E8F0] rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            Cancel
          </button>
          <button type="submit" form="adset-form" disabled={isSubmitting} className="bg-[#FF2D20] hover:bg-[#E5261A] text-white text-[13px] font-medium px-6 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            {isSubmitting && (
              <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {item ? 'Save Changes' : 'Create Ad Set'}
          </button>
        </div>
      </motion.div>
    </>
  )
}
