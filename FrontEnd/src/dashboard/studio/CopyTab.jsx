import React, { useState } from 'react'
import { ClipboardIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

function CharBadge({ text, limit }) {
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
        <button className="text-red-500 hover:text-red-700 transition-colors" title="Regenerate this">
          <ArrowPathIcon className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}

function CopyCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#0F172A]">{title}</h3>
        <button className="text-gray-400 hover:text-[#0F172A] transition-colors p-1" title="Copy All">
          <ClipboardIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}

export default function CopyTab({ platform, aiAnalysis }) {
  const prodName = aiAnalysis?.productName || 'Running Shoes'

  const renderGoogle = () => (
    <>
      <CopyCard title="RSA Headlines (Max 30 chars)">
        <div className="space-y-3">
          {[
            `Best ${prodName}`,
            `Shop ${prodName} Today`,
            `Top Quality ${prodName}`,
            `Buy ${prodName} Online`,
            `${prodName} on Sale Now`,
            `Upgrade Your Footwear`,
            `Premium ${prodName}`,
            `Affordable ${prodName}`,
            `Your New Favorite Shoes`,
            `Free Shipping on Shoes`,
            `Comfortable ${prodName}`,
            `Sporty ${prodName}`,
            `Energetic ${prodName}`,
            `Get ${prodName} Fast`,
            `The Ultimate ${prodName} - This is way too long for a headline` // testing overflow
          ].map((text, i) => (
            <div key={i} className="flex items-center justify-between pb-2 border-b border-gray-50 last:border-0 last:pb-0">
              <span className="text-sm text-gray-800">{text}</span>
              <CharBadge text={text} limit={30} />
            </div>
          ))}
        </div>
      </CopyCard>

      <CopyCard title="RSA Descriptions (Max 90 chars)">
        <div className="space-y-3">
          {[
            `Discover the best ${prodName} for your active lifestyle. Shop now for free shipping!`,
            `Upgrade your workout with our premium ${prodName}. Designed for comfort and durability.`,
            `Looking for ${prodName}? We have exactly what you need. Browse our massive selection today.`,
            `Get ready to perform at your best with these energetic ${prodName}. Limited time offer.`
          ].map((text, i) => (
            <div key={i} className="flex items-center justify-between pb-2 border-b border-gray-50 last:border-0 last:pb-0">
              <span className="text-sm text-gray-800">{text}</span>
              <CharBadge text={text} limit={90} />
            </div>
          ))}
        </div>
      </CopyCard>

      <CopyCard title="Sitelinks">
        <div className="space-y-2">
          {['Men\'s Collection', 'Women\'s Collection', 'Sale Items', 'New Arrivals'].map((text, i) => (
            <div key={i} className="text-sm text-blue-600 underline cursor-pointer">{text}</div>
          ))}
        </div>
      </CopyCard>

      <CopyCard title="Callouts">
        <div className="flex flex-wrap gap-2">
          {['Free Shipping', '24/7 Support', 'Price Match', 'Easy Returns', 'Secure Checkout', 'Premium Quality', 'Top Rated', 'Fast Delivery'].map((text, i) => (
            <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">{text}</span>
          ))}
        </div>
      </CopyCard>
    </>
  )

  const renderMeta = () => (
    <>
      <CopyCard title="Primary Text (3 Variants)">
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Emotional</span>
            <p className="text-sm text-gray-800">Tired of shoes that just don't keep up? We've engineered the perfect {prodName} to match your energetic lifestyle. Feel the difference from the first step.</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Offer-focused</span>
            <p className="text-sm text-gray-800">Get 20% off our best-selling {prodName} this week only! Don't miss out on the ultimate comfort and style upgrade. Click to claim your discount.</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Problem-Solution</span>
            <p className="text-sm text-gray-800">Foot pain ruining your run? Our new {prodName} features advanced cushioning technology designed to solve exactly that. Run longer, run better.</p>
          </div>
        </div>
      </CopyCard>

      <CopyCard title="Headlines">
        <ul className="list-disc pl-5 space-y-1">
          {[
            `Level Up Your Run with New ${prodName}`,
            `The ${prodName} Everyone Is Talking About`,
            `Say Goodbye to Foot Pain forever`,
            `Get 20% Off ${prodName} Today`,
            `Experience True Comfort with ${prodName}`
          ].map((h, i) => (
            <li key={i} className="text-sm text-gray-800 font-semibold">{h}</li>
          ))}
        </ul>
      </CopyCard>

      <CopyCard title="Carousel Copy">
        <div className="flex overflow-x-auto gap-4 pb-2 snap-x">
          {[1, 2, 3, 4, 5].map((cardNum) => (
            <div key={cardNum} className="shrink-0 w-48 border border-gray-200 rounded-lg p-3 snap-start bg-white">
              <div className="w-full h-24 bg-gray-100 rounded mb-2 flex items-center justify-center text-gray-400 text-xs">Image {cardNum}</div>
              <div className="text-sm font-bold text-gray-900 mb-1">Feature {cardNum}</div>
              <div className="text-xs text-gray-600">Discover why this makes our {prodName} better.</div>
            </div>
          ))}
        </div>
      </CopyCard>

      <CopyCard title="Video Scripts">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-bold text-[#0F172A] mb-2">15-second Script</h4>
            <div className="font-mono text-sm bg-gray-50 rounded-lg p-3 text-gray-700 whitespace-pre-wrap">
{`[0:00] Hook: Quick zoom on the ${prodName} in action. Text: "Need an upgrade?"
[0:05] Voiceover: "Meet the last pair you'll ever need."
[0:10] Action: Show someone running effortlessly.
[0:13] CTA: "Swipe up to shop the sale!"`}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#0F172A] mb-2">30-second Script</h4>
            <div className="font-mono text-sm bg-gray-50 rounded-lg p-3 text-gray-700 whitespace-pre-wrap">
{`[0:00] Hook: "Stop scrolling if your feet hurt after a run."
[0:05] Problem: Show a frustrated runner.
[0:10] Solution: Introduce the ${prodName} with a sleek product shot.
[0:15] Benefit 1: Highlight the premium cushioning.
[0:20] Benefit 2: Highlight the breathable material.
[0:25] Social Proof: "Join 10,000+ happy runners."
[0:28] CTA: "Click the link below to get yours today."`}
            </div>
          </div>
        </div>
      </CopyCard>
    </>
  )

  const renderSnapchat = () => (
    <>
      <CopyCard title="Single Ad Copy">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Headline</label>
              <CharBadge text={`New ${prodName} Out Now - Grab Yours!`} limit={25} />
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-800 font-semibold">
              New {prodName} Out Now - Grab Yours!
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Body</label>
              <CharBadge text={`Level up your fit with the latest ${prodName}. Unmatched comfort, sleek design. Don't sleep on this drop. 🔥`} limit={130} />
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-800">
              Level up your fit with the latest {prodName}. Unmatched comfort, sleek design. Don't sleep on this drop. 🔥
            </div>
          </div>
          <div>
             <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">CTA</label>
             <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-bold text-gray-800">SHOP NOW</span>
          </div>
        </div>
      </CopyCard>

      <CopyCard title="Story Sequence">
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
          {[
            { s: 1, copy: "Your old shoes are holding you back." },
            { s: 2, copy: `Meet the new ${prodName}.` },
            { s: 3, copy: "Built for speed. Styled for the streets." },
            { s: 4, copy: "Swipe up to upgrade your rotation. 🚀" }
          ].map((slide) => (
            <div key={slide.s} className="shrink-0 w-40 h-64 border border-gray-200 rounded-xl p-3 snap-start bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center text-center relative">
              <span className="absolute top-2 left-2 bg-black/10 text-black/60 px-2 py-0.5 rounded text-[10px] font-bold">Slide {slide.s}</span>
              <p className="text-sm font-bold text-gray-900 leading-snug">{slide.copy}</p>
            </div>
          ))}
        </div>
      </CopyCard>

      <CopyCard title="Video Scripts">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-bold text-[#0F172A] mb-2">3-second Hooks</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-2 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg border border-purple-100">" POV: You finally found the perfect shoes "</span>
              <span className="px-3 py-2 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg border border-purple-100">" Stop scrolling if you like running. "</span>
              <span className="px-3 py-2 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg border border-purple-100">" Unboxing the viral ${prodName} "</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#0F172A] mb-2">10-second Full Script</h4>
            <div className="font-mono text-sm bg-gray-50 rounded-lg p-3 text-gray-700 whitespace-pre-wrap">
{`[0:00] "POV: You finally found the perfect shoes" (Text on screen, unboxing shot)
[0:03] "These ${prodName} are literally insane." (Close up on texture)
[0:06] "Most comfortable thing I've ever worn." (Quick wear-test shot)
[0:08] "Swipe up before they sell out again!" (Point down, CTA arrow)`}
            </div>
          </div>
        </div>
      </CopyCard>
    </>
  )

  return (
    <div className="py-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {platform === 'Google' && renderGoogle()}
      {platform === 'Meta' && renderMeta()}
      {platform === 'Snapchat' && renderSnapchat()}
    </div>
  )
}
