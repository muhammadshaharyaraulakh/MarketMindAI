import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PillGroup from '../CampaignHub/PillGroup'
import TagInput from '../CampaignHub/TagInput'
import ClickableCardGroup from '../CampaignHub/ClickableCardGroup'

function ToggleSwitch({ value, onChange }) {
  return (
    <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200 w-fit">
      {['No', 'Yes'].map(opt => {
        const isSelected = (opt === 'Yes' && value) || (opt === 'No' && !value)
        return (
          <button
            key={opt} 
            type="button"
            onClick={() => onChange(opt === 'Yes')}
            className={`cursor-pointer px-4 py-1 text-xs font-medium rounded-md transition-colors ${isSelected ? 'bg-white text-[#0F172A] shadow-sm' : 'text-gray-500 hover:text-[#0F172A]'}`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

export default function StepQuestions({ state, dispatch }) {
  const { selectedPlatform, questionAnswers } = state

  const handleChange = (key, value) => {
    dispatch({ type: 'SET_QUESTION_ANSWER', payload: { key, value } })
  }

  const renderGoogleQuestions = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Type</label>
        <PillGroup 
          options={[{label:'Search',value:'Search'}, {label:'Display',value:'Display'}, {label:'Performance Max',value:'Performance Max'}, {label:'YouTube',value:'YouTube'}]}
          selected={questionAnswers.googleCampaignType}
          onChange={val => handleChange('googleCampaignType', val)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Main Keyword to Target <span className="text-gray-400 font-normal text-xs ml-1">(optional)</span></label>
        <input 
          type="text" 
          value={questionAnswers.googleKeyword || ''} 
          onChange={e => handleChange('googleKeyword', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 capitalize"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Landing Page URL</label>
        <input 
          type="url" 
          value={questionAnswers.googleUrl || ''} 
          onChange={e => handleChange('googleUrl', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 capitalize"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Main Conversion Goal</label>
        <PillGroup 
          options={[{label:'Purchase',value:'Purchase'}, {label:'Call',value:'Call'}, {label:'Form',value:'Form'}, {label:'Store Visit',value:'Store Visit'}]}
          selected={questionAnswers.googleGoal}
          onChange={val => handleChange('googleGoal', val)}
        />
      </div>
      <div>
        <TagInput 
          label="Geographic Targeting"
          tags={questionAnswers.googleGeo || []}
          onChange={tags => handleChange('googleGeo', tags)}
          placeholder="Add city or country"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Competitors <span className="text-gray-400 font-normal text-xs ml-1">(optional)</span></label>
        <input 
          type="text" 
          value={questionAnswers.googleCompetitors || ''} 
          onChange={e => handleChange('googleCompetitors', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 capitalize"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Trust Signal</label>
        <PillGroup 
          multiSelect
          options={[{label:'Free Shipping',value:'Free Shipping'}, {label:'Returns',value:'Returns'}, {label:'Warranty',value:'Warranty'}, {label:'None',value:'None'}]}
          selected={questionAnswers.googleTrust || []}
          onChange={val => handleChange('googleTrust', val)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Add Phone Number for Call Extension?</label>
        <ToggleSwitch 
          value={questionAnswers.googleCallExt || false}
          onChange={val => handleChange('googleCallExt', val)}
        />
        <AnimatePresence>
          {questionAnswers.googleCallExt && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <input 
                type="tel" 
                placeholder="+1 (555) 000-0000"
                value={questionAnswers.googlePhone || ''} 
                onChange={e => handleChange('googlePhone', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 capitalize"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )

  const renderMetaQuestions = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Goal</label>
        <PillGroup 
          options={[{label:'Sales',value:'Sales'}, {label:'Traffic',value:'Traffic'}, {label:'Leads',value:'Leads'}, {label:'Awareness',value:'Awareness'}]}
          selected={questionAnswers.metaGoal}
          onChange={val => handleChange('metaGoal', val)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Offer / Discount?</label>
        <ToggleSwitch 
          value={questionAnswers.metaHasOffer || false}
          onChange={val => handleChange('metaHasOffer', val)}
        />
        <AnimatePresence>
          {questionAnswers.metaHasOffer && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <input 
                type="text" 
                placeholder="What's the offer? e.g. 20% Off"
                value={questionAnswers.metaOfferDetails || ''} 
                onChange={e => handleChange('metaOfferDetails', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 capitalize"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div>
        <TagInput 
          label="Target Location"
          tags={questionAnswers.metaLocation || []}
          onChange={tags => handleChange('metaLocation', tags)}
          placeholder="Add location"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
        <input 
          type="text" 
          placeholder="e.g. $50 - $150"
          value={questionAnswers.metaPriceRange || ''} 
          onChange={e => handleChange('metaPriceRange', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 capitalize"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">User Action After Seeing Ad</label>
        <PillGroup 
          options={[{label:'WhatsApp',value:'WhatsApp'}, {label:'Website',value:'Website'}, {label:'App',value:'App'}, {label:'Direct Purchase',value:'Direct Purchase'}]}
          selected={questionAnswers.metaAction}
          onChange={val => handleChange('metaAction', val)}
        />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <label className="block text-sm font-medium text-gray-700">Brand Tone</label>
          <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded text-[10px] font-semibold">AI suggested this — change if needed</span>
        </div>
        <PillGroup 
          options={[{label:'Casual',value:'Casual'}, {label:'Professional',value:'Professional'}, {label:'Playful',value:'Playful'}, {label:'Luxury',value:'Luxury'}]}
          selected={questionAnswers.metaTone || 'Casual'}
          onChange={val => handleChange('metaTone', val)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Top 3 USPs</label>
        <div className="space-y-2">
          <input type="text" placeholder="USP 1" value={questionAnswers.metaUsp1 || ''} onChange={e => handleChange('metaUsp1', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 capitalize" />
          <input type="text" placeholder="USP 2" value={questionAnswers.metaUsp2 || ''} onChange={e => handleChange('metaUsp2', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 capitalize" />
          <input type="text" placeholder="USP 3" value={questionAnswers.metaUsp3 || ''} onChange={e => handleChange('metaUsp3', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 capitalize" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Customer Problem Solved</label>
        <textarea 
          rows={2}
          value={questionAnswers.metaProblem || ''} 
          onChange={e => handleChange('metaProblem', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 resize-none capitalize"
        />
      </div>
    </div>
  )

  const renderSnapchatQuestions = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Target Age Group</label>
        <PillGroup 
          options={[{label:'13-17',value:'13-17'}, {label:'18-24',value:'18-24'}, {label:'25-34',value:'25-34'}]}
          selected={questionAnswers.snapAge}
          onChange={val => handleChange('snapAge', val)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Goal</label>
        <PillGroup 
          options={[{label:'App Install',value:'App Install'}, {label:'Sales',value:'Sales'}, {label:'Awareness',value:'Awareness'}, {label:'Traffic',value:'Traffic'}]}
          selected={questionAnswers.snapGoal}
          onChange={val => handleChange('snapGoal', val)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ad Format</label>
        <ClickableCardGroup 
          columns={2}
          options={[
            {label:'Single Image', value:'Single Image'},
            {label:'Video', value:'Video'},
            {label:'Story', value:'Story'},
            {label:'Collection', value:'Collection'}
          ]}
          selected={questionAnswers.snapFormat}
          onChange={val => handleChange('snapFormat', val)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Offer?</label>
        <ToggleSwitch 
          value={questionAnswers.snapHasOffer || false}
          onChange={val => handleChange('snapHasOffer', val)}
        />
        <AnimatePresence>
          {questionAnswers.snapHasOffer && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <input 
                type="text" 
                placeholder="Detail the offer"
                value={questionAnswers.snapOfferDetails || ''} 
                onChange={e => handleChange('snapOfferDetails', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 capitalize"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">User Action</label>
        <PillGroup 
          options={[{label:'Swipe Up',value:'Swipe Up'}, {label:'Download',value:'Download'}, {label:'Shop',value:'Shop'}, {label:'WhatsApp',value:'WhatsApp'}]}
          selected={questionAnswers.snapAction}
          onChange={val => handleChange('snapAction', val)}
        />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <label className="block text-sm font-medium text-gray-700">Trend / Meme Style?</label>
          <span className="text-gray-400 font-normal text-xs ml-1">(Gen Z tone level)</span>
        </div>
        <ToggleSwitch 
          value={questionAnswers.snapTrend || false}
          onChange={val => handleChange('snapTrend', val)}
        />
      </div>
      <div>
        <TagInput 
          label="Brand in 3 Words (max 3)"
          tags={questionAnswers.snapBrandWords || []}
          onChange={tags => {
            if (tags.length <= 3) handleChange('snapBrandWords', tags)
          }}
          placeholder="Add word"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Video or Image Only?</label>
        <PillGroup 
          options={[{label:'Video',value:'Video'}, {label:'Image',value:'Image'}]}
          selected={questionAnswers.snapMediaType}
          onChange={val => handleChange('snapMediaType', val)}
        />
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#0F172A] mb-2">Smart Context Questions</h2>
        <p className="text-gray-500 text-sm italic">
          Image analysis already told us the product, colors, and vibe — just need your business context.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        {selectedPlatform === 'Google' && renderGoogleQuestions()}
        {selectedPlatform === 'Meta' && renderMetaQuestions()}
        {selectedPlatform === 'Snapchat' && renderSnapchatQuestions()}
      </div>
    </div>
  )
}
