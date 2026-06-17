export default function StatusBadge({ status }) {
  const styles = {
    Active: 'bg-green-50 text-green-700 border-green-200/80',
    Paused: 'bg-slate-50 text-slate-500 border-slate-200/80',
    Optimizing: 'bg-blue-50 text-blue-600 border-blue-200/80'
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border font-mona ${styles[status] || styles.Paused}`}>
      <span className={`w-1 h-1 rounded-full mr-1.5 ${status === 'Active' ? 'bg-green-500' : status === 'Optimizing' ? 'bg-blue-500' : 'bg-slate-400'}`} />
      {status}
    </span>
  )
}
