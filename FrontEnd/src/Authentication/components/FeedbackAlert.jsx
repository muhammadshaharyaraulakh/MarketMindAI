import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExclamationCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

export default function FeedbackAlert({ errorMsg, successMsg }) {
  return (
    <AnimatePresence mode="wait">
      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl p-4 mb-6 flex items-start gap-2.5"
        >
          <ExclamationCircleIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p>{errorMsg}</p>
        </motion.div>
      )}
      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-xl p-4 mb-6 flex items-start gap-2.5"
        >
          <ShieldCheckIcon className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <p>{successMsg}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
