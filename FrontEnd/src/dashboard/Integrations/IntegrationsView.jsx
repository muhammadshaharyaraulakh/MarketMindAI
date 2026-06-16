
import { motion } from 'framer-motion'

export default function IntegrationsView({ state, dispatch }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
      <div>
        <h2 className="text-xl font-bold text-[#0F172A] font-mona leading-tight">Platform Integrations</h2>
        <p className="text-xs font-semibold text-[#94A3B8] mt-0.5">Manage connected ad accounts and OAuth tokens.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.integrations.map((integration, idx) => (
          <div key={idx} className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm text-left flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#0F172A] font-mona mb-1">{integration.platform}</h3>
              {integration.accounts.length > 0 ? (
                <div className="space-y-3 mt-4">
                  {integration.accounts.map((acc, aIdx) => (
                    <div key={aIdx} className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-[#0F172A]">{acc.name}</p>
                        <p className="text-[10px] font-semibold text-[#94A3B8]">ID: {acc.id}</p>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-semibold text-[#94A3B8] mt-4">No accounts connected.</p>
              )}
            </div>
            <button 
              onClick={() => {
                dispatch({ type: 'SET_OAUTH_STEP', payload: 1 })
                // Local state modal logic can be wired here or inside a specialized panel
              }}
              className={`mt-6 w-full text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors shadow-sm ${
                integration.accounts.length > 0 
                  ? 'bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#FFF1F0] hover:text-[#FF2D20]' 
                  : 'bg-[#FF2D20] text-white hover:bg-[#E5261A]'
              }`}
            >
              {integration.accounts.length > 0 ? 'Manage Settings' : 'Connect Account'}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
