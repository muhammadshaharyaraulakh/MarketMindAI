import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function CampaignPanel({ item, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    platform: 'Google',
    status: 'Active',
    budget: 1000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  })

  useEffect(() => {
    if (item) {
      setFormData(item)
    }
  }, [item])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      id: item?.id || Date.now(),
      budget: parseFloat(formData.budget) || 0
    })
  }

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
            <h2 className="text-xl font-bold text-[#0F172A]">{item ? 'Edit Campaign' : 'Create Campaign'}</h2>
            <p className="text-[11px] font-semibold text-[#94A3B8] mt-0.5">Configure campaign details and budgets.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#F8FAFC] rounded-xl text-[#94A3B8] hover:text-[#0F172A] transition-colors">
            <XMarkIcon className="w-5 h-5 stroke-2" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="campaign-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Campaign Name</label>
              <input 
                type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Platform</label>
                <select 
                  value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none bg-white"
                >
                  <option>Google</option>
                  <option>Meta</option>
                  <option>TikTok</option>
                  <option>Email</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Status</label>
                <select 
                  value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none bg-white"
                >
                  <option>Active</option>
                  <option>Paused</option>
                  <option>Optimizing</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Total Budget ($)</label>
              <input 
                type="number" required value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Start Date</label>
                <input 
                  type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">End Date</label>
                <input 
                  type="date" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-[#E2E8F0] flex justify-end gap-3 bg-[#F8FAFC]">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-[13px] font-bold text-[#475569] hover:bg-white border border-transparent hover:border-[#E2E8F0] rounded-lg transition-colors cursor-pointer">
            Cancel
          </button>
          <button type="submit" form="campaign-form" className="bg-[#FF2D20] hover:bg-[#E5261A] text-white text-[13px] font-bold px-6 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer">
            {item ? 'Save Changes' : 'Create Campaign'}
          </button>
        </div>
      </motion.div>
    </>
  )
}
