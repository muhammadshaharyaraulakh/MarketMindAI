export default function AdStatusBadge({ ad, isCompleted }) {
  if (isCompleted) return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border bg-purple-50 text-purple-700 border-purple-200">Completed</span>
  if (ad.review_status === 'REJECTED') return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border bg-red-50 text-red-700 border-red-200">Rejected</span>
  if (ad.review_status === 'IN_REVIEW') return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border bg-blue-50 text-blue-700 border-blue-200">Pending Review</span>
  if (ad.sync_status === 'PENDING') return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border bg-slate-50 text-slate-500 border-slate-200">Syncing...</span>
  if (ad.status === 'Active') return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border bg-green-50 text-green-700 border-green-200">Active</span>
  if (ad.status === 'Paused') return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border bg-yellow-50 text-yellow-700 border-yellow-200">Paused</span>
  if (ad.status === 'Draft') return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border bg-gray-50 text-gray-700 border-gray-200">Draft</span>
  return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border bg-slate-50 text-slate-500 border-slate-200">{ad.status}</span>
}
