export default function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl shadow-lg text-xs font-semibold font-mona">
        <p className="text-[#0F172A] mb-1 font-bold">{label}</p>
        {payload.map((item, idx) => (
          <p key={idx} style={{ color: item.color }} className="flex justify-between gap-6 py-0.5">
            <span className="text-[#475569]">{item.name}:</span>
            <span className="font-bold">
              {item.name === 'ROAS' ? `${item.value}x` : `$${item.value.toLocaleString()}`}
            </span>
          </p>
        ))}
      </div>
    )
  }
  return null
}
