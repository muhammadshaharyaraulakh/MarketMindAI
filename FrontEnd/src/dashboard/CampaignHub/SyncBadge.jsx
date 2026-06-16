export default function SyncBadge({ sync_status }) {
  const isSyncing = sync_status === 'PENDING'
  if (!sync_status) return null
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ml-2 ${isSyncing ? 'bg-slate-50 text-slate-500 border-slate-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
      {isSyncing ? 'Syncing...' : 'Synced'}
    </span>
  )
}
