import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, ChevronDownIcon, ChevronUpIcon, PlusIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline'
import PillGroup from './PillGroup'

export default function AdPanel({ item, adSetId, platform, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    format: 'Image',
    platform: platform || 'Google',
    status: 'Draft',
    review_status: 'NOT_REVIEWED',
    
    // Google specific
    headlines: [''],
    descriptions: [''],
    
    // Meta specific
    primaryText: '',
    headline: '',
    linkDescription: '',
    page_id: '',
    instagram: true,
    
    // Snapchat specific
    brandName: '',
    attachment_url: '',
    
    // General
    destinationUrl: '',
    ctaType: 'LEARN_MORE',
    abTestGroup: 'A',
    
    // UTM
    utmSource: '',
    utmMedium: '',
    utmCampaign: ''
  })

  const [isUtmExpanded, setIsUtmExpanded] = useState(false)

  useEffect(() => {
    if (item) {
      setFormData({
        ...formData, // ensure all fields exist
        ...item,
        platform: item.platform || platform || 'Google'
      })
    }
  }, [item, platform])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      id: item?.id || Date.now(),
      adSetId: item?.adSetId || adSetId,
      metrics: item?.metrics || { spend: 0, impressions: 0, clicks: 0, conversions: 0 }
    })
  }

  const generatedUrl = formData.destinationUrl 
    ? `${formData.destinationUrl}?utm_source=${formData.utmSource}&utm_medium=${formData.utmMedium}&utm_campaign=${formData.utmCampaign}`
    : ''

  // Array handlers for Google RSA
  const handleArrayChange = (field, index, value) => {
    const newArr = [...formData[field]]
    newArr[index] = value
    setFormData({ ...formData, [field]: newArr })
  }
  const addArrayItem = (field, max) => {
    if (formData[field].length < max) {
      setFormData({ ...formData, [field]: [...formData[field], ''] })
    }
  }

  const renderPlatformFields = () => {
    if (formData.platform === 'Google') {
      return (
        <div className="space-y-5">
          {/* Headlines */}
          <div>
            <div className="flex justify-between items-end mb-1.5">
              <label className="block text-[10px] font-bold text-[#94A3B8] uppercase">Headlines ({formData.headlines.length}/5)</label>
              {formData.headlines.length < 5 && (
                <button type="button" onClick={() => addArrayItem('headlines', 5)} className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
                  <PlusIcon className="w-3 h-3 stroke-2" /> Add
                </button>
              )}
            </div>
            <div className="space-y-2">
              {formData.headlines.map((hl, i) => (
                <input 
                  key={`hl-${i}`} type="text" value={hl} onChange={e => handleArrayChange('headlines', i, e.target.value)}
                  placeholder={`Headline ${i + 1}`} maxLength={30}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none"
                />
              ))}
            </div>
          </div>
          {/* Descriptions */}
          <div>
            <div className="flex justify-between items-end mb-1.5">
              <label className="block text-[10px] font-bold text-[#94A3B8] uppercase">Descriptions ({formData.descriptions.length}/3)</label>
              {formData.descriptions.length < 3 && (
                <button type="button" onClick={() => addArrayItem('descriptions', 3)} className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
                  <PlusIcon className="w-3 h-3 stroke-2" /> Add
                </button>
              )}
            </div>
            <div className="space-y-2">
              {formData.descriptions.map((desc, i) => (
                <input 
                  key={`desc-${i}`} type="text" value={desc} onChange={e => handleArrayChange('descriptions', i, e.target.value)}
                  placeholder={`Description ${i + 1}`} maxLength={90}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none"
                />
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (formData.platform === 'Meta') {
      return (
        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Primary Text</label>
            <textarea 
              value={formData.primaryText} onChange={e => setFormData({...formData, primaryText: e.target.value})} rows={3}
              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Headline</label>
            <input 
              type="text" value={formData.headline} onChange={e => setFormData({...formData, headline: e.target.value})} maxLength={255}
              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Link Description</label>
            <input 
              type="text" value={formData.linkDescription} onChange={e => setFormData({...formData, linkDescription: e.target.value})}
              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Facebook Page ID</label>
              <input 
                type="text" value={formData.page_id} onChange={e => setFormData({...formData, page_id: e.target.value})}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Instagram Placement</label>
              <div className="flex bg-[#F8FAFC] p-1 rounded-lg border border-[#E2E8F0] h-[38px]">
                <button type="button" onClick={() => setFormData({...formData, instagram: true})} className={`flex-1 text-xs font-bold rounded-md transition-colors ${formData.instagram ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#475569] hover:text-[#0F172A]'}`}>Enabled</button>
                <button type="button" onClick={() => setFormData({...formData, instagram: false})} className={`flex-1 text-xs font-bold rounded-md transition-colors ${!formData.instagram ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#475569] hover:text-[#0F172A]'}`}>Disabled</button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (formData.platform === 'Snapchat') {
      return (
        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Brand Name</label>
            <div className="relative">
              <input 
                type="text" value={formData.brandName} onChange={e => setFormData({...formData, brandName: e.target.value})} maxLength={25}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none"
              />
              <span className="absolute right-3 top-2.5 text-[10px] font-bold text-[#94A3B8]">{formData.brandName.length}/25</span>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Headline</label>
            <div className="relative">
              <input 
                type="text" value={formData.headline} onChange={e => setFormData({...formData, headline: e.target.value})} maxLength={34}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none"
              />
              <span className="absolute right-3 top-2.5 text-[10px] font-bold text-[#94A3B8]">{formData.headline.length}/34</span>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Attachment URL (Deep Link / Web)</label>
            <input 
              type="url" value={formData.attachment_url} onChange={e => setFormData({...formData, attachment_url: e.target.value})}
              placeholder="https://"
              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none"
            />
          </div>
        </div>
      )
    }

    return null
  }

  const formatOptions = [
    { label: 'Image', value: 'Image' },
    { label: 'Video', value: 'Video' },
    { label: 'Carousel', value: 'Carousel' },
    { label: 'Responsive', value: 'Responsive' }
  ].filter(opt => {
    if (formData.platform === 'Snapchat' && opt.value === 'Carousel') return false;
    return true;
  })

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
              <h2 className="text-xl font-bold text-[#0F172A]">{item ? 'Edit Ad' : 'Create Ad'}</h2>
              {item && item.sync_status && (
                <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${
                  item.sync_status === 'SYNCED' ? 'bg-[#F0FDF4] text-green-700 border-green-200' : 
                  item.sync_status === 'PENDING' ? 'bg-[#FFFBEB] text-amber-700 border-amber-200' :
                  'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0]'
                }`}>
                  {item.sync_status}
                </span>
              )}
              {item && item.review_status && (
                <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${
                  item.review_status === 'APPROVED' ? 'bg-[#F0FDF4] text-green-700 border-green-200' : 
                  item.review_status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                  item.review_status === 'IN_REVIEW' ? 'bg-[#EFF6FF] text-blue-700 border-blue-200' :
                  'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0]'
                }`}>
                  {item.review_status.replace('_', ' ')}
                </span>
              )}
            </div>
            <p className="text-[11px] font-semibold text-[#94A3B8] mt-0.5">Define ad creatives and copy.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#F8FAFC] rounded-xl text-[#94A3B8] hover:text-[#0F172A] transition-colors">
            <XMarkIcon className="w-5 h-5 stroke-2" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="ad-form" onSubmit={handleSubmit} className="space-y-6">
            
            {item && item.review_status === 'REJECTED' && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-semibold border border-red-100 flex items-start gap-2">
                <div className="mt-0.5 w-4 h-4 shrink-0 bg-red-200 rounded-full flex items-center justify-center text-[10px] text-red-700 font-bold">!</div>
                <div>
                  <span className="block font-bold">Ad Rejected</span>
                  <span className="text-xs font-medium opacity-90">{item.rejection_reason}</span>
                </div>
              </div>
            )}

            {/* Platform & Format */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Platform</label>
                <div className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold bg-[#F8FAFC] text-[#94A3B8]">
                  {formData.platform} (Inherited)
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Ad Name</label>
                <input 
                  type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-2">Ad Format</label>
              <PillGroup 
                options={formatOptions}
                selected={formData.format}
                onChange={(val) => setFormData({...formData, format: val})}
              />
            </div>

            <hr className="border-[#E2E8F0]" />

            {/* Media Upload */}
            <div>
              <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Creative Media</label>
              <div className="border-2 border-dashed border-[#E2E8F0] rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-[#F8FAFC] transition-colors cursor-pointer group">
                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <DocumentArrowUpIcon className="w-5 h-5 stroke-2" />
                </div>
                <p className="text-sm font-bold text-[#0F172A]">Click to upload or drag & drop</p>
                <p className="text-[11px] font-semibold text-[#94A3B8] mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                <input type="file" className="hidden" />
              </div>
            </div>

            {/* Copy Fields */}
            {renderPlatformFields()}

            <hr className="border-[#E2E8F0]" />

            {/* Destination & CTA */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Destination URL</label>
                <input 
                  type="url" required value={formData.destinationUrl} onChange={e => setFormData({...formData, destinationUrl: e.target.value})}
                  placeholder="https://"
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Call to Action</label>
                <select 
                  value={formData.ctaType} onChange={e => setFormData({...formData, ctaType: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none bg-white cursor-pointer"
                >
                  <option value="LEARN_MORE">Learn More</option>
                  <option value="SIGN_UP">Sign Up</option>
                  <option value="SHOP_NOW">Shop Now</option>
                  <option value="DOWNLOAD">Download</option>
                </select>
              </div>
            </div>

            {/* UTM Accordion */}
            <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
              <button 
                type="button"
                onClick={() => setIsUtmExpanded(!isUtmExpanded)}
                className="w-full px-4 py-3 bg-[#F8FAFC] flex justify-between items-center text-sm font-bold text-[#0F172A]"
              >
                URL Parameters (UTM)
                {isUtmExpanded ? <ChevronUpIcon className="w-4 h-4 stroke-2 text-[#94A3B8]" /> : <ChevronDownIcon className="w-4 h-4 stroke-2 text-[#94A3B8]" />}
              </button>
              
              <AnimatePresence>
                {isUtmExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 py-4 border-t border-[#E2E8F0] space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Source (utm_source)</label>
                        <input 
                          type="text" value={formData.utmSource} onChange={e => setFormData({...formData, utmSource: e.target.value})} placeholder="google"
                          className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Medium (utm_medium)</label>
                        <input 
                          type="text" value={formData.utmMedium} onChange={e => setFormData({...formData, utmMedium: e.target.value})} placeholder="cpc"
                          className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Campaign (utm_campaign)</label>
                      <input 
                        type="text" value={formData.utmCampaign} onChange={e => setFormData({...formData, utmCampaign: e.target.value})} placeholder="summer_sale"
                        className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-semibold focus:border-[#FF2D20] focus:outline-none"
                      />
                    </div>
                    {generatedUrl && (
                      <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                        <p className="text-[9px] font-bold text-[#94A3B8] uppercase mb-1">Generated URL Preview</p>
                        <p className="text-[10px] font-mona text-[#0F172A] break-all">{generatedUrl}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* A/B Test Group */}
            <div>
              <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-2">A/B Test Variant</label>
              <PillGroup 
                options={[{label: 'Control (A)', value: 'A'}, {label: 'Variant B', value: 'B'}, {label: 'Variant C', value: 'C'}]}
                selected={formData.abTestGroup}
                onChange={(val) => setFormData({...formData, abTestGroup: val})}
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-[#E2E8F0] flex justify-end gap-3 bg-[#F8FAFC]">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-[13px] font-bold text-[#475569] hover:bg-white border border-transparent hover:border-[#E2E8F0] rounded-lg transition-colors cursor-pointer">
            Cancel
          </button>
          <button type="submit" form="ad-form" className="bg-[#FF2D20] hover:bg-[#E5261A] text-white text-[13px] font-bold px-6 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer">
            {item ? 'Save Changes' : 'Create Ad'}
          </button>
        </div>
      </motion.div>
    </>
  )
}
