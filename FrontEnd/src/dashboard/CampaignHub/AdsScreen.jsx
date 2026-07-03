import { useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { PlusIcon, ArrowLeftIcon, PhotoIcon, TrashIcon } from '@heroicons/react/24/outline'
import AdStatusBadge from './AdStatusBadge'

export default function AdsScreen({ dispatch, navigate, selectedCampaign, selectedCampaignId, selectedAdSet, selectedAdSetId, activeAds, getPlatformIcon }) {
  const isCompleted = selectedCampaign?.status?.toLowerCase() === 'completed'
  
  useEffect(() => {
    if (selectedAdSetId) {
      axios.get(`/api/adsets/${selectedAdSetId}/ads`)
        .then(response => {
          if (response.data.status === 'success') {
            dispatch({ type: 'SET_ADS', payload: response.data.data })
          }
        })
        .catch(error => {
          console.error("Error fetching ads:", error)
        })
    }
  }, [selectedAdSetId, dispatch])

  const handleDeleteAd = async (adId) => {
    try {
      const response = await axios.delete(`/api/ads/${adId}`)
      if (response.data.status === 'success') {
        dispatch({ type: 'DELETE_AD', payload: adId })
      }
    } catch (err) {
      console.error('Failed to delete ad', err)
    }
  }

  const handleToggleAdStatus = async (adId) => {
    try {
      const response = await axios.patch(`/api/ads/${adId}/toggle-status`)
      if (response.data.status === 'success') {
        dispatch({ type: 'TOGGLE_AD_STATUS', payload: adId })
      }
    } catch (err) {
      // Inline error toast for 422 if not approved
      if (err.response && err.response.status === 422) {
        alert(err.response.data.message || 'Ad must be approved before it can be activated.')
      }
      console.error('Failed to toggle ad status', err)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/campaigns/${selectedCampaignId}`)}
            className="p-2 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-xl text-[#475569] shadow-sm cursor-pointer transition-all"
          >
            <ArrowLeftIcon className="w-4 h-4 stroke-2" />
          </button>
          <div>
            <h2 className="text-lg font-medium text-[#0F172A] font-mona leading-tight">
              <span className="text-[#94A3B8] font-semibold">Campaigns / {selectedCampaign?.name} / {selectedAdSet?.name} / </span> Ads
            </h2>
            <p className="text-[11px] font-semibold text-[#94A3B8] mt-0.5">Manage individual ads for this Ad Set.</p>
          </div>
        </div>
        {!isCompleted && (
          <button
            onClick={() => {
              if (selectedCampaign?.platform === 'Meta' || selectedCampaign?.platform === 'Snapchat') {
                alert('Creation of ads for Facebook/Meta and Snapchat is not available. You can only access Google Ads live.')
              } else {
                dispatch({ type: 'SET_ACTIVE_PANEL', payload: { type: 'ad' } })
              }
            }}
            className="bg-[#FF2D20] hover:bg-[#E5261A] text-white text-[11px] font-medium px-4 py-2 rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <PlusIcon className="w-4 h-4 shrink-0" />
            Create Ad
          </button>
        )}
      </div>

      {/* Ads Grid */}
      {activeAds.filter(a => a.adSetId === selectedAdSetId).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeAds.filter(a => a.adSetId === selectedAdSetId).map(ad => (
            <div key={ad.id} className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm flex flex-col justify-between overflow-hidden">
              {ad.review_status === 'REJECTED' && (
                <div className="bg-red-50 text-red-700 px-4 py-2.5 text-[10px] font-medium border-b border-red-100 flex justify-between items-center">
                  <span>Rejected — {ad.rejection_reason}</span>
                  <button 
                    onClick={() => {
                      dispatch({ type: 'SET_ACTIVE_PANEL', payload: { type: 'ad', item: ad } });
                    }}
                    className="underline hover:text-red-900"
                  >
                    Edit & Resubmit
                  </button>
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-center shrink-0">
                        <PhotoIcon className="w-5 h-5 text-[#94A3B8]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-[#0F172A]">{ad.name}</h3>
                        <span className="text-[10px] font-semibold text-[#94A3B8] flex items-center">
                          {getPlatformIcon(ad.platform)} {ad.format} · {ad.platform}
                        </span>
                      </div>
                    </div>
                  </div>
                    <div className="flex flex-col items-end gap-2">
                      <AdStatusBadge ad={ad} isCompleted={isCompleted} />
                      {!isCompleted && (ad.status === 'Active' || ad.status === 'Paused') && ad.review_status === 'APPROVED' && (
                        <button 
                          onClick={() => handleToggleAdStatus(ad.id)}
                          className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${ad.status === 'Active' ? 'bg-green-500' : 'bg-slate-300'}`}
                        >
                          <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${ad.status === 'Active' ? 'translate-x-3' : 'translate-x-0.5'}`} />
                        </button>
                      )}
                    </div>
                
                <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] mb-4 relative">
                  <p className="text-[11px] font-medium text-[#0F172A] mb-1 pr-16">Headline: <span className="font-semibold text-[#475569]">{ad.headline || ad.brandName || 'Untitled Ad'}</span></p>
                  <p className="text-[10px] text-[#475569] line-clamp-2 pr-16">{ad.description || ad.primaryText || ad.attachment_url || 'No copy provided.'}</p>
                  <span className="absolute top-3 right-3 bg-white border border-[#E2E8F0] text-[9px] font-medium text-[#0F172A] px-2 py-0.5 rounded shadow-sm">
                    {ad.cta_type || 'LEARN_MORE'}
                  </span>
                </div>
                
                <div className="grid grid-cols-4 gap-2 mb-4 text-center">
                  <div className="bg-[#FFF1F0] p-2 rounded-lg">
                    <span className="block text-[8px] font-medium text-[#FF2D20] uppercase">Spend</span>
                    <span className="block text-xs font-semibold text-[#0F172A]">${ad.metrics?.spend || 0}</span>
                  </div>
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-2 rounded-lg">
                    <span className="block text-[8px] font-medium text-[#94A3B8] uppercase">Impr.</span>
                    <span className="block text-xs font-semibold text-[#0F172A]">{ad.metrics?.impressions || 0}</span>
                  </div>
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-2 rounded-lg">
                    <span className="block text-[8px] font-medium text-[#94A3B8] uppercase">Clicks</span>
                    <span className="block text-xs font-semibold text-[#0F172A]">{ad.metrics?.clicks || 0}</span>
                  </div>
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-2 rounded-lg">
                    <span className="block text-[8px] font-medium text-[#94A3B8] uppercase">CTR</span>
                    <span className="block text-xs font-semibold text-[#0F172A]">
                      {(ad.metrics?.impressions > 0) ? ((ad.metrics.clicks / ad.metrics.impressions) * 100).toFixed(1) : '0.0'}%
                    </span>
                  </div>
                </div>
              </div>

              {!isCompleted && (
                <div className="flex gap-2">
                  {(ad.status === 'Draft' || ad.review_status === 'REJECTED') && (
                    <button
                      onClick={() => dispatch({ type: 'SET_ACTIVE_PANEL', payload: { type: 'ad', item: ad } })}
                      className="flex-1 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569] text-[11px] font-medium py-2 rounded-xl cursor-pointer transition-all shadow-sm"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => {
                      dispatch({
                        type: 'OPEN_CONFIRM',
                        payload: {
                          type: 'DELETE_AD',
                          id: ad.id,
                          title: 'Delete Ad',
                          message: 'Are you sure you want to delete this ad? This action cannot be undone.'
                        }
                      });
                    }}
                    className="bg-white border border-[#E2E8F0] hover:bg-red-50 text-[#94A3B8] hover:text-red-500 px-3 py-2 rounded-xl cursor-pointer transition-all shadow-sm"
                  >
                    <TrashIcon className="w-4 h-4 stroke-[1.5]" />
                  </button>
                </div>
              )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 flex flex-col items-center justify-center text-center bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
          <div className="w-16 h-16 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl flex items-center justify-center mb-4 text-[#94A3B8]">
            <PhotoIcon className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="text-sm font-medium text-[#0F172A] font-mona mb-1">No Ads Created</h3>
          <p className="text-xs font-semibold text-[#94A3B8] max-w-xs mb-6">Start building your creative variations for this ad set.</p>
          {!isCompleted && (
            <button
              onClick={() => {
                if (selectedCampaign?.platform === 'Meta' || selectedCampaign?.platform === 'Snapchat') {
                  alert('Creation of ads for Facebook/Meta and Snapchat is not available. You can only access Google Ads live.')
                } else {
                  dispatch({ type: 'SET_ACTIVE_PANEL', payload: { type: 'ad' } })
                }
              }}
              className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] text-[#0F172A] text-xs font-medium px-4 py-2.5 rounded-xl cursor-pointer transition-all shadow-sm"
            >
              Create First Ad
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}
