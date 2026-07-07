import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  Line,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import {
  ChartBarIcon,
  BoltIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon,
  CursorArrowRaysIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  BellAlertIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  PlayCircleIcon,
  LockClosedIcon,
  KeyIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  PresentationChartLineIcon,
  MagnifyingGlassIcon,
  LightBulbIcon,
  FunnelIcon,
  CircleStackIcon,
  BuildingOffice2Icon,
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  DocumentTextIcon,
  CameraIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid,
  StarIcon,
  ShieldCheckIcon as ShieldCheckIconSolid,
  BoltIcon as BoltIconSolid,
  EyeSlashIcon
} from '@heroicons/react/24/solid';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CheckIcon,
  PlusIcon
} from '@heroicons/react/20/solid';

import {
  revenueData, trendData, trafficData, campaigns, heroStats, plans, testimonials, faqs, fadeUp, fadeIn, scaleIn, staggerContainer, float, useScrollAnimation, useCounter, CustomTooltip, SectionLabel, IconBox, FeatureCheck
} from './shared';

export default function FAQSection() {
  const [ref, inView] = useScrollAnimation()
  const [openIndex, setOpenIndex] = useState(null)
  
  const [isContactModalOpen, setContactModalOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await axios.post('/api/contact', {
        email,
        subject,
        body
      });
      setSuccessMessage('Your message has been sent successfully. We will get back to you shortly.');
      setEmail('');
      setSubject('');
      setBody('');
      setTimeout(() => {
        setContactModalOpen(false);
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section id="faq" ref={ref} className="bg-[#F8FAFC] py-24 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
          {/* Left Column - Heading Info */}
          <div className="lg:col-span-1 text-left flex flex-col items-start sticky top-24">
            <SectionLabel text="FAQ" color="blue" />
            <motion.h2 
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="text-[26px] md:text-[34px] font-semibold text-[#0F172A] tracking-tight leading-tight mb-4 font-mona"
              style={{ fontVariationSettings: "'wdth' 100, 'wght' 550" }}
            >
              Everything You <span className="text-[#FF2D20]">Need to Know</span>
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="text-[#475569] text-[15px] leading-relaxed mb-6 font-semibold"
            >
              Can't find the exact technical answer? Get in touch with our operations desk; we respond within 2 hours.
            </motion.p>
            <motion.button 
              onClick={() => setContactModalOpen(true)}
              variants={fadeUp}
              className="border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white text-[#0F172A] px-6 py-2.5 rounded-lg font-bold text-sm inline-flex items-center gap-2 cursor-pointer shadow-sm transition-all duration-150"
            >
              <EnvelopeIcon className="w-4 h-4 text-[#475569]" />
              Contact Support Desk
            </motion.button>
          </div>

          {/* Right Column - Accordion Lists */}
          <div className="lg:col-span-2 text-left bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx
              return (
                <div 
                  key={idx}
                  className="border-b border-[#E2E8F0] last:border-0"
                >
                  {/* Header Row */}
                  <div 
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="flex justify-between items-start cursor-pointer py-5 select-none hover:text-[#FF2D20] transition-colors"
                  >
                    <span className="font-bold text-[#0F172A] text-[15px] flex-1 pr-4 font-mona">
                      {faq.q}
                    </span>
                    <ChevronDownIcon 
                      className={`w-4 h-4 text-[#94A3B8] flex-shrink-0 mt-1 transform transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#FF2D20]' : ''
                      }`} 
                    />
                  </div>

                  {/* Answer Content - AnimatePresence */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="text-[#475569] text-[14px] leading-relaxed pb-5 font-semibold">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      <AnimatePresence>
        {isContactModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative"
            >
              <button 
                onClick={() => setContactModalOpen(false)}
                className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#0F172A] transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <h3 className="text-2xl font-bold text-[#0F172A] mb-2 font-mona">Contact Support</h3>
              <p className="text-[#475569] text-sm mb-6">Send us a message and we'll get back to you shortly.</p>

              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm font-medium">
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm font-medium">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold cursor-pointer text-[#0F172A] mb-1">Email Address</label>
                  <input 
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF2D20]/20 focus:border-[#FF2D20] transition-all"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold cursor-pointer text-[#0F172A] mb-1">Subject</label>
                  <input 
                    id="subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF2D20]/20 focus:border-[#FF2D20] transition-all"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label htmlFor="body" className="block text-sm font-semibold cursor-pointer text-[#0F172A] mb-1">Message</label>
                  <textarea 
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                    rows="4"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF2D20]/20 focus:border-[#FF2D20] transition-all resize-none"
                    placeholder="Provide details here..."
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FF2D20] hover:bg-[#E5261A] disabled:bg-[#FF2D20]/70 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold text-sm tracking-tight shadow-sm transition-colors duration-150 mt-2"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
