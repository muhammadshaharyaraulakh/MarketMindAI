import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { XMarkIcon, MagnifyingGlassIcon, ChatBubbleBottomCenterIcon, VideoCameraIcon, CalendarIcon } from '@heroicons/react/24/outline'
import ClickableCardGroup from './ClickableCardGroup'
import PillGroup from './PillGroup'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function CampaignPanel({ item, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    platform: 'Google',
    status: 'Active',
    objective: 'CONVERSION',
    budget_type: 'Daily',
    budget: 1000,
    bid_strategy: 'Auto',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: ''
  })
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (item) {
      setFormData({
        ...formData,
        ...item
      })
    }
  }, [item])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await onSave({
        ...formData,
        id: item?.id || Date.now(),
        budget: parseFloat(formData.budget) || 0
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

  const platformOptions = [
    { value: 'Google', label: 'Google Ads', description: 'Search & Display', icon: <MagnifyingGlassIcon className="w-5 h-5" /> },
    { value: 'Meta', label: 'Meta Ads', description: 'Facebook & Instagram', icon: <ChatBubbleBottomCenterIcon className="w-5 h-5" /> },
    { value: 'Snapchat', label: 'Snapchat', description: 'Gen Z Audiences', icon: <VideoCameraIcon className="w-5 h-5" /> }
  ]

  const objectiveOptions = [
    { value: 'AWARENESS', label: 'Awareness' },
    { value: 'CONSIDERATION', label: 'Consideration' },
    { value: 'CONVERSION', label: 'Conversion' }
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
              <h2 className="text-xl font-medium text-[#0F172A]">{item ? 'Edit Campaign' : 'Create Campaign'}</h2>
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
            <p className="text-[11px] font-semibold text-[#94A3B8] mt-0.5">Configure high-level campaign settings.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#F8FAFC] rounded-xl text-[#94A3B8] hover:text-[#0F172A] transition-colors cursor-pointer">
            <XMarkIcon className="w-5 h-5 stroke-2" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl flex flex-col gap-1">
              <span className="text-xs font-semibold text-red-800">Unable to save campaign</span>
              <span className="text-xs font-medium text-red-600">{error}</span>
            </div>
          )}
          <form id="campaign-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-medium text-[#94A3B8] uppercase mb-1.5">Campaign Name</label>
                <input 
                  type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold placeholder:font-light focus:border-[#FF2D20] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-[#94A3B8] uppercase mb-1.5">Status</label>
                <div className="flex bg-[#F8FAFC] p-1 rounded-lg border border-[#E2E8F0]">
                  {['Active', 'Paused'].map(opt => (
                    <button
                      key={opt} type="button"
                      onClick={() => setFormData({...formData, status: opt})}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md cursor-pointer transition-colors ${formData.status === opt ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#475569] hover:text-[#0F172A]'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-[#94A3B8] uppercase mb-2">Advertising Platform</label>
              <ClickableCardGroup 
                options={platformOptions}
                selected={formData.platform}
                onChange={(val) => setFormData({...formData, platform: val})}
                columns={3}
              />
            </div>

            <hr className="border-[#E2E8F0]" />

            <div>
              <label className="block text-[10px] font-medium text-[#94A3B8] uppercase mb-2">Campaign Objective</label>
              <PillGroup 
                options={objectiveOptions}
                selected={formData.objective}
                onChange={(val) => setFormData({...formData, objective: val})}
              />
            </div>

            <hr className="border-[#E2E8F0]" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-medium text-[#94A3B8] uppercase mb-1.5">Budget Type</label>
                <div className="flex bg-[#F8FAFC] p-1 rounded-lg border border-[#E2E8F0]">
                  {['Daily', 'Lifetime'].map(opt => (
                    <button
                      key={opt} type="button"
                      onClick={() => setFormData({...formData, budget_type: opt})}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md cursor-pointer transition-colors ${formData.budget_type === opt ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#475569] hover:text-[#0F172A]'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
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
                <label className="block text-[10px] font-medium text-[#94A3B8] uppercase mb-1.5">Bid Strategy</label>
                <select 
                  value={formData.bid_strategy} onChange={e => setFormData({...formData, bid_strategy: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-light focus:border-[#FF2D20] focus:outline-none bg-white cursor-pointer"
                >
                  <option>Auto</option>
                  <option>Max Clicks</option>
                  <option>Target CPA</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-medium text-[#94A3B8] uppercase mb-1.5">Start Date</label>
                <div className="relative">
                  <DatePicker 
                    selected={formData.startDate ? new Date(formData.startDate) : null} 
                    onChange={date => setFormData({...formData, startDate: date ? date.toISOString().split('T')[0] : ''})}
                    dateFormat="MMM d, yyyy"
                    className="w-full pl-10 pr-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold placeholder:font-light focus:border-[#FF2D20] focus:outline-none cursor-pointer"
                    placeholderText="Select start date"
                  />
                  <CalendarIcon className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-[#94A3B8] uppercase mb-1.5">End Date</label>
                <div className="relative">
                  <DatePicker 
                    selected={formData.endDate ? new Date(formData.endDate) : null} 
                    onChange={date => setFormData({...formData, endDate: date ? date.toISOString().split('T')[0] : ''})}
                    dateFormat="MMM d, yyyy"
                    minDate={formData.startDate ? new Date(formData.startDate) : null}
                    isClearable
                    className="w-full pl-10 pr-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold placeholder:font-light focus:border-[#FF2D20] focus:outline-none cursor-pointer"
                    placeholderText="No end date"
                  />
                  <CalendarIcon className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            
            <hr className="border-[#E2E8F0]" />
            
            <div>
              <label className="block text-[10px] font-medium text-[#94A3B8] uppercase mb-1.5">Internal Notes</label>
              <textarea 
                value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
                rows={3}
                placeholder="Add optional notes about this campaign strategy"
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold placeholder:font-light focus:border-[#FF2D20] focus:outline-none resize-none"
              />
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-[#E2E8F0] flex justify-end gap-3 bg-[#F8FAFC]">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 text-[13px] font-medium text-[#475569] hover:bg-white border border-transparent hover:border-[#E2E8F0] rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            Cancel
          </button>
          <button type="submit" form="campaign-form" disabled={isSubmitting} className="bg-[#FF2D20] hover:bg-[#E5261A] text-white text-[13px] font-medium px-6 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            {isSubmitting && (
              <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {item ? 'Save Changes' : 'Create Campaign'}
          </button>
        </div>
      </motion.div>
    </>
  )
}
