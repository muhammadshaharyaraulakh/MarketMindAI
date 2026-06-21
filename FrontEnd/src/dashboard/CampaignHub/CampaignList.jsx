
import { motion, AnimatePresence } from 'framer-motion'
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import StatusBadge from './StatusBadge'
import SyncBadge from './SyncBadge'

export default function CampaignList({ state, dispatch, navigate, filteredCampaigns, getPlatformIcon }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key="hub_master" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
        {/* Title & trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-medium text-[#0F172A] tracking-tight font-mona">Campaign Management Console</h2>
            <p className="text-xs font-semibold text-[#94A3B8] mt-0.5">Control individual campaign budgets, platforms, and specific analytics relationships.</p>
          </div>
          <button
            onClick={() => dispatch({ type: 'SET_ACTIVE_PANEL', payload: { type: 'campaign' } })}
            className="bg-[#FF2D20] hover:bg-[#E5261A] text-white text-xs font-medium px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <PlusIcon className="w-4 h-4 shrink-0" />
            Configure Campaign
          </button>
        </div>

        {/* Filters and Inputs */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-4.5 h-4.5 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search campaign label"
              value={state.searchQuery}
              onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#FF2D20]"
            />
          </div>
          
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {['All', 'Google', 'Meta', 'Snapchat'].map((p, idx) => (
              <button
                key={idx}
                onClick={() => dispatch({ type: 'SET_PLATFORM_FILTER', payload: p })}
                className={`px-3 py-2 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                  state.platformFilter === p 
                    ? 'bg-[#FFF1F0] border-[#FF2D20]/20 text-[#FF2D20] font-medium' 
                    : 'bg-white border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Relational tabular listing */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="p-4 text-[10px] font-light text-[#0F172A] uppercase tracking-wider pl-6 font-mona">Campaign Title</th>
                  <th className="p-4 text-[10px] font-light text-[#0F172A] uppercase tracking-wider font-mona">Status</th>
                  <th className="p-4 text-[10px] font-light text-[#0F172A] uppercase tracking-wider font-mona">Daily Spend</th>
                  <th className="p-4 text-[10px] font-light text-[#0F172A] uppercase tracking-wider font-mona">Revenue</th>
                  <th className="p-4 text-[10px] font-light text-[#0F172A] uppercase tracking-wider font-mona">Calculated ROAS</th>
                  <th className="p-4 text-[10px] font-light text-[#0F172A] uppercase tracking-wider font-mona">CTR Ratio</th>
                  <th className="p-4 text-[10px] font-light text-[#0F172A] uppercase tracking-wider pr-6 text-right font-mona">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredCampaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-[#F8FAFC]/50 transition-colors cursor-pointer group">
                    <td onClick={() => dispatch({ type: 'ZOOM_CAMPAIGN', payload: camp.id })} className="p-4 pl-6">
                      <span className="block text-xs font-light text-[#0F172A] group-hover:text-[#FF2D20] transition-colors">{camp.name}</span>
                      <span className="flex items-center text-[9px] font-light text-[#94A3B8] uppercase tracking-widest mt-0.5 font-mona">
                        {getPlatformIcon(camp.platform)} {camp.platform} Network
                      </span>
                    </td>
                    <td onClick={() => dispatch({ type: 'ZOOM_CAMPAIGN', payload: camp.id })} className="p-4">
                      <StatusBadge status={camp.status} />
                      <SyncBadge sync_status={camp.sync_status} />
                    </td>
                    <td onClick={() => dispatch({ type: 'ZOOM_CAMPAIGN', payload: camp.id })} className="p-4 text-xs font-light text-[#0F172A]">
                      ${Number(camp.totalSpend).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                    <td onClick={() => dispatch({ type: 'ZOOM_CAMPAIGN', payload: camp.id })} className="p-4 text-xs font-light text-[#0F172A]">
                      ${Number(camp.totalRevenue).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                    <td onClick={() => dispatch({ type: 'ZOOM_CAMPAIGN', payload: camp.id })} className="p-4">
                      <span className="text-xs font-light text-[#0F172A]">{Number(camp.roas).toFixed(2)}x</span>
                    </td>
                    <td onClick={() => navigate(`/campaigns/${camp.id}`)} className="p-4">
                      <span className="text-xs font-light text-[#FF2D20]">{Number(camp.ctr).toFixed(2)}%</span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="inline-flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => dispatch({ type: 'SET_ACTIVE_PANEL', payload: { type: 'campaign', item: camp } })}
                          className="p-1.5 hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] rounded-lg text-[#94A3B8] hover:text-blue-500 cursor-pointer transition-all"
                        >
                          <PencilIcon className="w-3.5 h-3.5 stroke-[1.5]" />
                        </button>
                        <button
                          onClick={() => dispatch({ type: 'OPEN_CONFIRM', payload: { type: 'DELETE_CAMPAIGN', id: camp.id, title: 'Delete Campaign', message: 'Are you sure you want to delete this campaign? This action cannot be undone.' } })}
                          className="p-1.5 hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] rounded-lg text-[#94A3B8] hover:text-red-500 cursor-pointer transition-all"
                        >
                          <TrashIcon className="w-3.5 h-3.5 stroke-[1.5]" />
                        </button>
                        <button
                          onClick={() => navigate(`/campaigns/${camp.id}`)}
                          className="p-1.5 hover:bg-[#FFF1F0] border border-transparent hover:border-[#FF2D20]/20 rounded-lg text-[#94A3B8] hover:text-[#FF2D20] cursor-pointer transition-all ml-1"
                        >
                          <ChevronRightIcon className="w-3.5 h-3.5 stroke-2" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
