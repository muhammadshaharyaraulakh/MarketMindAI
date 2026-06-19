import React, { useState } from 'react'
import { ClipboardIcon, DocumentCheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

function CharBadge({ text, limit }) {
  if (!text) return null;
  const count = text.length
  const nearLimit = count >= limit - 2 && count <= limit
  const overLimit = count > limit
  
  let colorClass = 'bg-green-100 text-green-700'
  if (nearLimit) colorClass = 'bg-yellow-100 text-yellow-700'
  if (overLimit) colorClass = 'bg-red-100 text-red-700'

  return (
    <div className="flex items-center gap-2">
      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${colorClass}`}>
        {count}/{limit}
      </span>
      {overLimit && (
        <button className="cursor-pointer text-red-500 hover:text-red-700 transition-colors" title="Regenerate this">
          <ArrowPathIcon className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}

function StoryboardList({ title, scripts }) {
  if (!scripts || !Array.isArray(scripts) || scripts.length === 0) return null;
  return (
    <div className="mb-6 last:mb-0">
      <h4 className="text-sm font-bold text-[#0F172A] mb-3">{title}</h4>
      <div className="space-y-3">
        {scripts.map((s, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex gap-3">
            <div className="bg-purple-100 text-purple-700 font-mono text-xs px-2 py-1 rounded h-fit shrink-0">
              {s.timestamp || `Scene ${i+1}`}
            </div>
            <div className="space-y-1.5 text-sm">
              <p><strong className="text-gray-800">Visual:</strong> <span className="text-gray-600">{s.visual_cue || s}</span></p>
              {s.voiceover && <p><strong className="text-gray-800">Voiceover:</strong> <span className="text-gray-600">"{s.voiceover}"</span></p>}
              {s.other_details && <p><strong className="text-gray-800">Details:</strong> <span className="text-gray-500 text-xs">{s.other_details}</span></p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CopyCard({ title, copyText, children }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!copyText) return
    navigator.clipboard.writeText(copyText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#0F172A]">{title}</h3>
        {copyText && (
          <button 
            onClick={handleCopy}
            className={`cursor-pointer ${copied ? 'text-green-500' : 'text-gray-400 hover:text-[#0F172A]'} transition-colors p-1`} 
            title={copied ? "Copied!" : "Copy All"}
          >
            {copied ? <DocumentCheckIcon className="w-4 h-4" /> : <ClipboardIcon className="w-4 h-4" />}
          </button>
        )}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}

export default function CopyTab({ platform, aiAnalysis, generatedContent }) {
  const prodName = aiAnalysis?.productName || 'Product'
  const copy = generatedContent || {}

  const renderGoogle = () => (
    <>
      <CopyCard title="RSA Headlines (Max 30 chars)" copyText={(copy.headlines || []).join('\n')}>
        <div className="space-y-3">
          {(copy.headlines || []).map((text, i) => (
            <div key={i} className="flex items-center justify-between pb-2 border-b border-gray-50 last:border-0 last:pb-0">
              <span className="text-sm text-gray-800">{text}</span>
              <CharBadge text={text} limit={30} />
            </div>
          ))}
        </div>
      </CopyCard>

      <CopyCard title="RSA Descriptions (Max 90 chars)" copyText={(copy.descriptions || []).join('\n')}>
        <div className="space-y-3">
          {(copy.descriptions || []).map((text, i) => (
            <div key={i} className="flex items-center justify-between pb-2 border-b border-gray-50 last:border-0 last:pb-0">
              <span className="text-sm text-gray-800">{text}</span>
              <CharBadge text={text} limit={90} />
            </div>
          ))}
        </div>
      </CopyCard>

      <CopyCard title="Sitelinks" copyText={(copy.sitelinks || []).join('\n')}>
        <div className="space-y-2">
          {(copy.sitelinks || []).map((text, i) => (
            <div key={i} className="text-sm text-blue-600 underline cursor-pointer">{text}</div>
          ))}
        </div>
      </CopyCard>

      <CopyCard title="Callouts" copyText={(copy.callouts || []).join(', ')}>
        <div className="flex flex-wrap gap-2">
          {(copy.callouts || []).map((text, i) => (
            <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">{text}</span>
          ))}
        </div>
      </CopyCard>
    </>
  )

  const renderMeta = () => (
    <>
      <CopyCard title="Primary Text (3 Variants)" copyText={(copy.primary_texts || []).map(pt => pt.type.toUpperCase() + ':\n' + pt.text).join('\n\n')}>
        <div className="space-y-4">
          {(copy.primary_texts || []).map((pt, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">{pt.type}</span>
              <p className="text-sm text-gray-800">{pt.text}</p>
            </div>
          ))}
        </div>
      </CopyCard>

      <CopyCard title="Headlines" copyText={(copy.headlines || []).join('\n')}>
        <ul className="list-disc pl-5 space-y-1">
          {(copy.headlines || []).map((h, i) => (
            <li key={i} className="text-sm text-gray-800 font-semibold">{h}</li>
          ))}
        </ul>
      </CopyCard>

      <CopyCard title="Carousel Copy" copyText={(copy.carousel_cards || []).map((c, i) => 'Card ' + (i+1) + ':\n' + c.headline + '\n' + c.description).join('\n\n')}>
        <div className="flex overflow-x-auto gap-4 pb-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {(copy.carousel_cards || []).map((card, i) => (
            <div key={i} className="shrink-0 w-48 border border-gray-200 rounded-lg p-3 snap-start bg-white">
              <div className="w-full h-24 bg-gray-100 rounded mb-2 flex items-center justify-center text-gray-400 text-xs">Image {i + 1}</div>
              <div className="text-sm font-bold text-gray-900 mb-1">{card.headline}</div>
              <div className="text-xs text-gray-600">{card.description}</div>
            </div>
          ))}
        </div>
      </CopyCard>

      <CopyCard title="Video Storyboard Scripts" copyText={JSON.stringify(copy.video_scripts, null, 2)}>
        <StoryboardList title="15-second Script" scripts={copy.video_scripts?.fifteen_second} />
        <StoryboardList title="30-second Script" scripts={copy.video_scripts?.thirty_second} />
        {(!copy.video_scripts?.fifteen_second && !copy.video_scripts?.thirty_second) && (
          <p className="text-sm text-gray-500">No storyboard generated.</p>
        )}
      </CopyCard>


    </>
  )

  const renderSnapchat = () => (
    <>
      <CopyCard title="Single Ad Copy" copyText={`Brand: ${copy.single_ad?.brand_name || ''}\nHeadline: ${copy.single_ad?.headline || ''}\nBody: ${copy.single_ad?.body || ''}\nCTA: ${copy.single_ad?.cta || ''}`}>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Brand Name</label>
              <CharBadge text={copy.single_ad?.brand_name || ''} limit={25} />
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-800 font-semibold">
              {copy.single_ad?.brand_name}
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Headline</label>
              <CharBadge text={copy.single_ad?.headline || ''} limit={34} />
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-800 font-semibold">
              {copy.single_ad?.headline}
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Body</label>
              <CharBadge text={copy.single_ad?.body || ''} limit={130} />
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-800">
              {copy.single_ad?.body}
            </div>
          </div>
          <div>
             <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">CTA</label>
             <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-bold text-gray-800">{copy.single_ad?.cta || 'Swipe Up'}</span>
          </div>
        </div>
      </CopyCard>

      <CopyCard title="Story Sequence" copyText={(copy.story_sequence || []).map((s, i) => 'Slide ' + (s.slide || (i+1)) + ':\n' + s.text).join('\n\n')}>
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {(copy.story_sequence || []).map((slide, i) => (
            <div key={i} className="shrink-0 w-40 h-64 border border-gray-200 rounded-xl p-3 snap-start bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center text-center relative">
              <span className="absolute top-2 left-2 bg-black/10 text-black/60 px-2 py-0.5 rounded text-[10px] font-bold">Slide {slide.slide || (i + 1)}</span>
              <p className="text-sm font-bold text-gray-900 leading-snug">{slide.text}</p>
            </div>
          ))}
        </div>
      </CopyCard>

      <CopyCard title="Video Storyboard Scripts" copyText={JSON.stringify(copy.video_scripts, null, 2)}>
        <StoryboardList title="3-second Hooks" scripts={copy.video_scripts?.three_second_hooks} />
        <StoryboardList title="10-second Full Script" scripts={copy.video_scripts?.ten_second_script} />
        {(!copy.video_scripts?.three_second_hooks && !copy.video_scripts?.ten_second_script) && (
          <p className="text-sm text-gray-500">No storyboard generated.</p>
        )}
      </CopyCard>


    </>
  )

  const normalizedPlatform = platform?.toLowerCase();

  return (
    <div className="py-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {normalizedPlatform === 'google' && renderGoogle()}
      {normalizedPlatform === 'meta' && renderMeta()}
      {normalizedPlatform === 'snapchat' && renderSnapchat()}
    </div>
  )
}
