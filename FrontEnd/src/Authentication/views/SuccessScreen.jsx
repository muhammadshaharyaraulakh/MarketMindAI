import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid'

export default function SuccessScreen({ context, onClose, onSwitchView, pageVariants }) {
  return (
    <motion.div
      key="success"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="text-center py-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-200"
      >
        <CheckCircleIconSolid className="w-10 h-10 text-green-500" />
      </motion.div>

      <h3 className="text-2xl font-bold text-[#0F172A] tracking-tight mb-3 font-mona">{context.title}</h3>
      <p className="text-[#475569] text-sm leading-relaxed mb-8 max-w-sm mx-auto font-medium">
        {context.subtitle}
      </p>

      <button
        onClick={() => {
          if (context.actionView === 'dashboard') {
            onClose({ loggedIn: true })
          } else if (context.actionView === 'close') {
            onClose()
          } else {
            onSwitchView(context.actionView)
          }
        }}
        className="w-full bg-[#FF2D20] hover:bg-[#E5261A] text-white py-3 rounded-lg font-bold text-sm tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
      >
        {context.actionText}
        <ArrowRightIcon className="w-4 h-4" />
      </button>
    </motion.div>
  )
}
