import React from 'react'

export default function KeywordsTab({ state }) {
  const prodName = state.aiAnalysis?.productName || 'Running Shoes'

  const mockKeywords = [
    { keyword: `buy ${prodName.toLowerCase()}`, match: 'Exact', vol: '12K' },
    { keyword: `best ${prodName.toLowerCase()}`, match: 'Phrase', vol: '18K' },
    { keyword: prodName.toLowerCase(), match: 'Broad', vol: '45K' },
    { keyword: `${prodName.toLowerCase()} sale`, match: 'Phrase', vol: '8.5K' },
    { keyword: `cheap ${prodName.toLowerCase()}`, match: 'Phrase', vol: '6.2K' },
    { keyword: `premium ${prodName.toLowerCase()}`, match: 'Exact', vol: '3K' },
    { keyword: `${prodName.toLowerCase()} online`, match: 'Broad', vol: '22K' },
    { keyword: `where to buy ${prodName.toLowerCase()}`, match: 'Phrase', vol: '4.1K' }
  ]

  const getMatchColor = (match) => {
    switch(match) {
      case 'Broad': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Phrase': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'Exact': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="py-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Keyword</th>
              <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Match Type</th>
              <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Est. Search Vol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockKeywords.map((kw, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-sm font-semibold text-[#0F172A]">{kw.keyword}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getMatchColor(kw.match)}`}>
                    {kw.match}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 font-medium text-right">{kw.vol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
