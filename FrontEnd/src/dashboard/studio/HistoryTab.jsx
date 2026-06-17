import React from 'react'

export default function HistoryTab() {
  const pastGenerations = [
    { id: 1, name: 'Summer Running Shoes', category: 'Footwear', platform: 'Meta', date: '2 days ago', thumb: 'bg-blue-100' },
    { id: 2, name: 'Pro Fitness Watch', category: 'Electronics', platform: 'Google', date: '1 week ago', thumb: 'bg-green-100' },
    { id: 3, name: 'Yoga Mat Ultra', category: 'Sports', platform: 'Snapchat', date: '2 weeks ago', thumb: 'bg-purple-100' }
  ]

  return (
    <div className="py-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-[#0F172A]">Your Past Generations</h3>
        <p className="text-sm text-gray-500">Used as style reference for consistency</p>
      </div>

      <div className="space-y-3">
        {pastGenerations.map(gen => (
          <div key={gen.id} className="bg-white border border-gray-100 rounded-xl p-3 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg ${gen.thumb} flex items-center justify-center`}>
                <span className="text-xl">👟</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">{gen.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                    {gen.category}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded">
                    {gen.platform}
                  </span>
                  <span className="text-xs text-gray-400">{gen.date}</span>
                </div>
              </div>
            </div>
            <button className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-[#0F172A] hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200">
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
