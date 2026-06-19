import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { TrashIcon, ExclamationTriangleIcon, CameraIcon, SparklesIcon } from '@heroicons/react/24/outline'

export default function HistoryTab({ onView }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Delete Modal State
  const [deleteId, setDeleteId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('/api/content-generation/library')
        if (res.data.success) {
          setHistory(res.data.data)
        }
      } catch (err) {
        setError('Failed to load history.')
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await axios.delete(`/api/content-generation/library/${deleteId}`)
      setHistory(prev => prev.filter(item => item.id !== deleteId))
      setDeleteId(null)
    } catch (err) {
      alert('Failed to delete item.')
    } finally {
      setIsDeleting(false);
    }
  }

  if (loading) return <div className="text-sm text-gray-500 py-4">Loading history...</div>
  if (error) return <div className="text-sm text-red-500 py-4">{error}</div>

  if (history.length === 0) {
    return (
      <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 mt-4">
        <p className="text-sm text-gray-500">No saved generations yet.</p>
        <p className="text-xs text-gray-400 mt-1">Items saved to library will appear here for 24 hours.</p>
      </div>
    )
  }

  return (
    <div className="py-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-[#0F172A]">Library</h3>
        <p className="text-sm text-gray-500">Auto-deletes after 24 hours</p>
      </div>

      <div className="space-y-3">
        {history.map(gen => (
          <div key={gen.id} className="bg-white border border-gray-100 rounded-xl p-3 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                {gen.image_path ? (
                   <img 
                     src={`/storage/${gen.image_path}`} 
                     alt="Thumbnail" 
                     className="w-full h-full object-cover"
                     onError={(e) => {
                       e.target.onerror = null;
                       e.target.style.display = 'none';
                       e.target.nextSibling.style.display = 'block';
                     }}
                   />
                ) : (
                   <SparklesIcon className="w-5 h-5 text-gray-400" />
                )}
                {/* Fallback icon if image fails to load */}
                <CameraIcon className="w-5 h-5 text-gray-400 hidden" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">
                  {gen.ai_analysis?.product_name || 'Generated Content'}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                    {gen.ai_analysis?.category || 'General'}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded">
                    {gen.platform}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(gen.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onView && (
                <button 
                  onClick={() => onView(gen)}
                  className="cursor-pointer px-3 py-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  View
                </button>
              )}
              <button 
                onClick={() => setDeleteId(gen.id)}
                className="cursor-pointer p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                title="Delete"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Generation?</h3>
              <p className="text-sm text-gray-500">
                This will permanently delete this generated ad package and remove any associated uploaded images. This action cannot be undone.
              </p>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3 justify-end">
              <button 
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="cursor-pointer px-4 py-2 text-sm font-bold text-white bg-[#FF2D20] hover:bg-red-600 rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:bg-red-400"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
