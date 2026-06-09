import React, { useState, useRef } from 'react'

export default function OtpCodeInput({ onChange }) {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)]

  const handleCodeChange = (element, index) => {
    const val = element.value.replace(/[^0-9]/g, '')
    if (!val) {
      const newCode = [...code]
      newCode[index] = ''
      setCode(newCode)
      onChange && onChange(newCode.join(''))
      return
    }

    const newCode = [...code]
    newCode[index] = val.slice(-1) // Take only the last entered digit
    setCode(newCode)
    
    const codeString = newCode.join('')
    onChange && onChange(codeString)

    // Focus next box if filled
    if (index < 5 && inputRefs[index + 1].current) {
      inputRefs[index + 1].current.focus()
    }
  }

  const handleCodeKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0 && inputRefs[index - 1].current) {
        inputRefs[index - 1].current.focus()
      }
    }
  }

  return (
    <div className="flex justify-between gap-2.5 py-2">
      {code.map((num, idx) => (
        <input
          key={idx}
          type="text"
          maxLength={1}
          required
          value={num}
          ref={inputRefs[idx]}
          onChange={(e) => handleCodeChange(e.target, idx)}
          onKeyDown={(e) => handleCodeKeyDown(e, idx)}
          className="w-12 h-14 bg-[#F8FAFC] border-2 border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-xl text-center text-xl font-extrabold text-[#0F172A] transition-all"
        />
      ))}
    </div>
  )
}
