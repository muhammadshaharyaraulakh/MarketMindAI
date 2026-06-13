import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function AdSetPanel({ item, campaignId, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    audienceType: 'Broad',
    platform: 'Google',
    status: 'Active',
    budget: 500,
    goal: 'CONVERSIONS'
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
      campaignId: item?.campaignId || campaignId,
      budget: parseFloat(formData.budget) || 0,
      spendToday: item?.spendToday || 0
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
            <h2 className="text-xl font-bold text-[#0F172A]">{item ? 'Edit Ad Set' : 'Create Ad Set'}</h2>
            <p className="text-[11px] font-semibold text-[#94A3B8] mt-0.5">Define audiences and daily budgets.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#F8FAFC] rounded-xl text-[#94A3B8] hover:text-[#0F172A] transition-colors">
            <XMarkIcon className="w-5 h-5 stroke-2" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="adset-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Ad Set Name</label>
              <input 
                type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Audience Type</label>
                <select 
                  value={formData.audienceType} onChange={e => setFormData({...formData, audienceType: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none bg-white"
                >
                  <option>Broad</option>
                  <option>Interest</option>
                  <option>Custom</option>
                  <option>Lookalike</option>
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
                <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Optimization Goal</label>
                <select 
                  value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none bg-white"
                >
                  <option>CONVERSIONS</option>
                  <option>LINK_CLICKS</option>
                  <option>IMPRESSIONS</option>
                  <option>LEAD_GEN</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Daily Budget ($)</label>
              <input 
                type="number" required value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none"
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-[#E2E8F0] flex justify-end gap-3 bg-[#F8FAFC]">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-[13px] font-bold text-[#475569] hover:bg-white border border-transparent hover:border-[#E2E8F0] rounded-lg transition-colors cursor-pointer">
            Cancel
          </button>
          <button type="submit" form="adset-form" className="bg-[#FF2D20] hover:bg-[#E5261A] text-white text-[13px] font-bold px-6 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer">
            {item ? 'Save Changes' : 'Create Ad Set'}
          </button>
        </div>
      </motion.div>
    </>
  )
}
