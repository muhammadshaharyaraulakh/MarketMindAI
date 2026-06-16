import React from 'react';

export const SectionLabel = ({ text, color = 'red' }) => {
  const styles = {
    red: 'bg-[#FFF1F0] text-[#FF2D20] border-[#FECACA]',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
  }
  return (
    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[1.5px] uppercase border ${styles[color] || styles.red} mb-6`}>
      {text}
    </span>
  )
};
