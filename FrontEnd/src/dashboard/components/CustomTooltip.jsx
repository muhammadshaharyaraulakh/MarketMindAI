export default function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl shadow-lg text-xs font-semibold font-mona">
        <p className="text-[#0F172A] mb-1 font-bold">{label}</p>
        {payload.map((item, idx) => {
          const val = item.value || 0;
          const name = item.name || '';
          
          let displayValue = `$${val.toLocaleString()}`;
          if (name === 'ROAS' || name === 'Avg CPA' || name === 'CPA') {
            displayValue = name === 'ROAS' ? `${val}x` : `$${val}`;
          } else if (name.includes('Ads')) {
            displayValue = `${val}%`;
          }
          
          return (
            <p key={idx} className="flex justify-between items-center gap-6 py-0.5">
              <span className="text-[#475569] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full border border-slate-200" style={{ backgroundColor: item.color }}></span>
                {name}:
              </span>
              <span className="font-bold text-[#0F172A]">{displayValue}</span>
            </p>
          );
        })}
      </div>
    )
  }
  return null
}
