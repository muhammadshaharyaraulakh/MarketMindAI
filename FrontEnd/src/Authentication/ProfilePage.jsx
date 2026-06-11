import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  UserIcon, 
  LockClosedIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ShieldCheckIcon,
  ClockIcon,
  CpuChipIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftOnRectangleIcon,
  DocumentDuplicateIcon,
  QrCodeIcon,
  PhotoIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathRoundedSquareIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid'
import axios from 'axios'

export default function ProfilePage({ onClose, user }) {
  const [activeTab, setActiveTab] = useState('profile') // 'profile', 'password', 'recovery', '2fa', 'activity'
  
  // Feedback alerts
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSyncingSessions, setIsSyncingSessions] = useState(false)

  // Profile data state
  const [fullName, setFullName] = useState(user && user.name ? user.name : 'Rashid Mahmood')
  const [email, setEmail] = useState(user && user.email ? user.email : 'rashid@company.com')
  // Password fields
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false })

  // Recovery fields
  const [recoveryEmail, setRecoveryEmail] = useState(user && user.recovery_email ? user.recovery_email : '')
  const [hasRecoveryEmail, setHasRecoveryEmail] = useState(!!(user && user.recovery_email))

  // 2FA status
  const [is2FAEnabled, setIs2FAEnabled] = useState(!!user?.two_factor_confirmed_at)
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [showConfirmPasswordModal, setShowConfirmPasswordModal] = useState(false)
  const [passwordToConfirm, setPasswordToConfirm] = useState('')
  const [qrCodeSvg, setQrCodeSvg] = useState('')
  const [setupCode, setSetupCode] = useState('')
  const [recoveryCodes, setRecoveryCodes] = useState([])
  
  const [is2FAVerified, setIs2FAVerified] = useState(false) // Dynamic success state within modal
  const [twoFACode, setTwoFACode] = useState(['', '', '', '', '', ''])
  const twoFARefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)]

  // Copied status
  const [copiedSecret, setCopiedSecret] = useState(false)

  // Mock timelines
  const [activities, setActivities] = useState([
    { id: 1, action: 'User Sign In Successful', ip: '182.185.122.9', device: 'Ubuntu Linux (Chrome)', time: 'Just now', type: 'success' },
    { id: 2, action: 'Workspace Profile Data Synchronized', ip: '182.185.122.9', device: 'Ubuntu Linux (Chrome)', time: '1 hour ago', type: 'success' },
    { id: 3, action: 'Password Rotation Completed', ip: '182.185.122.9', device: 'Ubuntu Linux (Chrome)', time: '3 hours ago', type: 'success' },
    { id: 4, action: '2FA Scan Authentication Requested', ip: '182.185.122.9', device: 'Ubuntu Linux (Chrome)', time: 'Yesterday', type: 'info' },
    { id: 5, action: 'Account Recovery Coordinate Set', ip: '182.185.122.9', device: 'Ubuntu Linux (Chrome)', time: '3 days ago', type: 'success' }
  ])

  // Mock logged devices
  const [devices, setDevices] = useState([
    { id: 'd1', os: 'Ubuntu Linux PC', browser: 'Google Chrome', location: 'Rawalpindi, PK', isCurrent: true, ip: '182.185.122.9', type: 'desktop' },
    { id: 'd2', os: 'Apple iPhone 15 Pro', browser: 'Safari Browser', location: 'Karachi, PK', isCurrent: false, ip: '182.190.45.12', type: 'mobile' },
    { id: 'd3', os: 'Microsoft Windows 11', browser: 'Microsoft Edge', location: 'Lahore, PK', isCurrent: false, ip: '39.40.231.8', type: 'desktop' }
  ])

  // Reset status alerts on tab switches
  useEffect(() => {
    setErrorMsg('')
    setSuccessMsg('')
  }, [activeTab])

  // Image upload removed

  // Profile save
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('auth_token')
      await axios.put('http://localhost:8000/api/user/profile-information', {
        name: fullName,
        email: email
      }, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      setLoading(false)
      setSuccessMsg('Profile updated successfully.')
      setActivities([
        { id: Date.now(), action: 'Workspace Profile Data Synchronized', ip: '182.185.122.9', device: 'Ubuntu Linux (Chrome)', time: 'Just now', type: 'success' },
        ...activities
      ])
    } catch (err) {
      setLoading(false)
      const firstError = err.response?.data?.errors ? Object.values(err.response.data.errors)[0][0] : err.response?.data?.message;
      setErrorMsg(firstError || 'Error saving profile.')
    }
  }

  // Password save
  const handleSavePassword = async (e) => {
    e.preventDefault()
    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMsg('Please specify all security password inputs.')
      return
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.')
      return
    }
    setLoading(true)
    try {
      const token = localStorage.getItem('auth_token')
      await axios.put('http://localhost:8000/api/user/password', {
        current_password: oldPassword,
        password: newPassword,
        password_confirmation: confirmPassword
      }, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      setLoading(false)
      setSuccessMsg('Your security password has been changed successfully.')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setActivities([
        { id: Date.now(), action: 'Password Rotation Completed', ip: '182.185.122.9', device: 'Ubuntu Linux (Chrome)', time: 'Just now', type: 'success' },
        ...activities
      ])
    } catch (err) {
      setLoading(false)
      const firstError = err.response?.data?.errors ? Object.values(err.response.data.errors)[0][0] : err.response?.data?.message;
      setErrorMsg(firstError || 'Error updating password.')
    }
  }

  // Recovery handlers
  const handleAddRecoveryEmail = async (e) => {
    e.preventDefault()
    if (!recoveryEmail) {
      setErrorMsg('Recovery email cannot be empty.')
      return
    }
    setLoading(true)
    try {
      const token = localStorage.getItem('auth_token')
      await axios.post('http://localhost:8000/api/add-recovery-email', { recovery_email: recoveryEmail }, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      setLoading(false)
      setHasRecoveryEmail(true)
      setSuccessMsg('Recovery email added successfully.')
    } catch(err) {
      setLoading(false)
      const firstError = err.response?.data?.errors ? Object.values(err.response.data.errors)[0][0] : err.response?.data?.message;
      setErrorMsg(firstError || 'Error adding recovery email')
    }
  }

  const handleUpdateRecoveryEmail = async (e) => {
    e.preventDefault()
    if (!recoveryEmail) {
      setErrorMsg('Recovery email cannot be empty.')
      return
    }
    setLoading(true)
    try {
      const token = localStorage.getItem('auth_token')
      await axios.post('http://localhost:8000/api/update-recovery-email', { recovery_email: recoveryEmail }, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      setLoading(false)
      setSuccessMsg('Recovery email updated successfully.')
    } catch(err) {
      setLoading(false)
      const firstError = err.response?.data?.errors ? Object.values(err.response.data.errors)[0][0] : err.response?.data?.message;
      setErrorMsg(firstError || 'Error updating recovery email')
    }
  }

  const handleRemoveRecoveryEmail = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('auth_token')
      await axios.post('http://localhost:8000/api/remove-recovery-email', {}, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      setLoading(false)
      setRecoveryEmail('')
      setHasRecoveryEmail(false)
      setSuccessMsg('Recovery email removed successfully.')
    } catch(err) {
      setLoading(false)
      const firstError = err.response?.data?.errors ? Object.values(err.response.data.errors)[0][0] : err.response?.data?.message;
      setErrorMsg(firstError || 'Error removing recovery email')
    }
  }

  // 2FA Digit handling
  const handle2FAChange = (element, index) => {
    const val = element.value.replace(/[^0-9]/g, '')
    if (!val) {
      const new2FA = [...twoFACode]
      new2FA[index] = ''
      setTwoFACode(new2FA)
      return
    }

    const new2FA = [...twoFACode]
    new2FA[index] = val.slice(-1)
    setTwoFACode(new2FA)

    if (index < 5 && twoFARefs[index + 1].current) {
      twoFARefs[index + 1].current.focus()
    }
  }

  const handle2FAKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!twoFACode[index] && index > 0 && twoFARefs[index - 1].current) {
        twoFARefs[index - 1].current.focus()
      }
    }
  }

  // Real Verification check inside 2FA modal
  const handleVerify2FA = async (e) => {
    e.preventDefault()
    const entered = twoFACode.join('')
    if (entered.length < 6) {
      setErrorMsg('Please input all 6 digits of verification code.')
      return
    }
    setLoading(true)
    setErrorMsg('')
    try {
      const token = localStorage.getItem('auth_token')
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }

      await axios.post('http://localhost:8000/api/user/confirmed-two-factor-authentication', {
        code: entered
      }, { headers })

      const recoveryResp = await axios.get('http://localhost:8000/api/user/two-factor-recovery-codes', { headers })
      setRecoveryCodes(recoveryResp.data)
      
      setLoading(false)
      setIs2FAVerified(true)
      setIs2FAEnabled(true)
      setTwoFACode(['', '', '', '', '', ''])
      
      setActivities([
        { id: Date.now(), action: 'Google Authenticator 2FA Activated', ip: '182.185.122.9', device: 'Ubuntu Linux (Chrome)', time: 'Just now', type: 'success' },
        ...activities
      ])
      
      setSuccessMsg('Google Authenticator 2FA protection locked successfully.')
    } catch (err) {
      setLoading(false)
      const firstError = err.response?.data?.errors ? Object.values(err.response.data.errors)[0][0] : err.response?.data?.message;
      setErrorMsg(firstError || 'Invalid verification code.')
    }
  }

  const handleDisable2FA = async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const token = localStorage.getItem('auth_token')
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
      
      await axios.delete('http://localhost:8000/api/user/two-factor-authentication', { headers })
      
      setLoading(false)
      setIs2FAEnabled(false)
      setSuccessMsg('Google Authenticator 2FA dismantled.')
      setActivities([
        { id: Date.now(), action: 'Google Authenticator 2FA Terminated', ip: '182.185.122.9', device: 'Ubuntu Linux (Chrome)', time: 'Just now', type: 'warning' },
        ...activities
      ])
    } catch(err) {
      setLoading(false)
      if (err.response?.status === 423) {
         setErrorMsg('Session locked. Please confirm your password by trying to enable 2FA again, or refresh the page.')
      } else {
         const firstError = err.response?.data?.errors ? Object.values(err.response.data.errors)[0][0] : err.response?.data?.message;
         setErrorMsg(firstError || 'Error disabling 2FA.')
      }
    }
  }

  const handleEnable2FA = () => {
    setShowConfirmPasswordModal(true)
  }

  const handleConfirmPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      const token = localStorage.getItem('auth_token')
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
      
      await axios.post('http://localhost:8000/api/user/confirm-password', {
        password: passwordToConfirm
      }, { headers })

      await axios.post('http://localhost:8000/api/user/two-factor-authentication', {}, { headers })

      const qrResp = await axios.get('http://localhost:8000/api/user/two-factor-qr-code', { headers })
      setQrCodeSvg(qrResp.data.svg)
      
      setLoading(false)
      setShowConfirmPasswordModal(false)
      setPasswordToConfirm('')
      setShow2FAModal(true)
    } catch (err) {
      setLoading(false)
      const firstError = err.response?.data?.errors ? Object.values(err.response.data.errors)[0][0] : err.response?.data?.message;
      setErrorMsg(firstError || 'Error confirming password. Please verify your current password.')
    }
  }

  // Sync active connections simulation
  const handleRefreshSessions = () => {
    setIsSyncingSessions(true)
    setTimeout(() => {
      setIsSyncingSessions(false)
      setSuccessMsg('Live terminal connection networks synchronized successfully.')
      setActivities([
        { id: Date.now(), action: 'Active Terminal Sessions Polled', ip: '182.185.122.9', device: 'Ubuntu Linux (Chrome)', time: 'Just now', type: 'info' },
        ...activities
      ])
    }, 1100)
  }

  const handleLogoutOtherDevices = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setDevices(devices.filter(d => d.isCurrent))
      setSuccessMsg('Logged out of all secondary devices.')
      setActivities([
        { id: Date.now(), action: 'Revoked Secondary Device Access', ip: '182.185.122.9', device: 'Ubuntu Linux (Chrome)', time: 'Just now', type: 'warning' },
        ...activities
      ])
    }, 1000)
  }

  const handleCopySecret = () => {
    navigator.clipboard.writeText('MM-392F-K893-XP02')
    setCopiedSecret(true)
    setTimeout(() => setCopiedSecret(false), 2000)
  }

  const SectionLabel = ({ text, color = 'red' }) => {
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
  }

  // Animation variants
  const tabVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.25, ease: 'easeIn' } }
  }

  const tabList = [
    { id: 'profile', label: 'Profile' },
    { id: 'password', label: 'Password' },
    { id: 'recovery', label: 'Recovery Paths' },
    { id: '2fa', label: '2FA Shield' },
    { id: 'activity', label: 'Active Sessions' }
  ]

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col font-mona select-none overflow-y-auto">
      
      {/* Laser scan lines style tags */}
      <style>{`
        @keyframes scanLaser {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .animate-scan-laser {
          animation: scanLaser 2.4s infinite linear;
        }
      `}</style>

      {/* Spacious Navigation Header */}
      <header className="max-w-7xl w-full mx-auto px-6 sm:px-12 py-8 flex items-center justify-between shrink-0">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white px-4 py-2.5 rounded-full text-[#475569] hover:text-[#0F172A] cursor-pointer shadow-sm transition-all duration-150 text-sm font-bold tracking-tight"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Return to Dashboard
        </button>

        <span className="font-mona">
          <span className="font-bold text-[#0F172A] text-2xl tracking-tight">MarketMind</span>
          <span className="text-[#FF2D20] font-extrabold text-2xl ml-0.5">AI</span>
        </span>
      </header>

      {/* Spacious Main Centered Visual Frame */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-6 pb-24 text-center">
        
        {/* Crystal Clear Section Labels */}
        <div className="flex justify-center mt-6">
          <SectionLabel text="USER SYSTEM COMMAND" color="red" />
        </div>

        <h1 className="text-3xl md:text-5xl font-semibold text-[#0F172A] tracking-tight leading-tight mb-4 font-mona">
          Your Digital <span className="text-[#FF2D20]">Workspace Identity</span>
        </h1>
        <p className="text-[#475569] text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-12 font-medium">
          Manage system coordinates, rotate password credentials, configure secondary recovery paths, and activate Google Authenticator protection.
        </p>

        {/* Gorgeous Pill Tab Switcher */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12 max-w-3xl mx-auto">
          {tabList.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#FF2D20] text-white border-[#FF2D20] shadow-[0_4px_12px_rgba(255,45,32,0.15)]'
                  : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0F172A] shadow-sm'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Alert Banner */}
        <div className="max-w-2xl mx-auto mb-8 text-left">
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl p-4 flex items-start gap-2.5"
              >
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </motion.div>
            )}
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-xl p-4 flex items-start gap-2.5"
              >
                <CheckCircleIcon className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <p>{successMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Spacious Crystal Clear Form Box */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-8 sm:p-12 max-w-2xl mx-auto overflow-hidden relative text-left">
          
          <AnimatePresence mode="wait">

            {/* TAB PANEL 1: PROFILE DETAILS */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8 animate-fadeIn"
              >
                <div>
                  <SectionLabel text="MEMBER COORDINATES" color="red" />
                  <h3 className="text-xl font-semibold text-[#0F172A] tracking-tight">Basic Workspace Profile</h3>
                  <p className="text-xs text-[#64748B] font-semibold mt-1">Configure your display name, corporate email address, and roles.</p>
                </div>


                {/* Form fields */}
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-[#475569] uppercase tracking-wider block mb-1.5">Your Full Name</label>
                      <div className="relative">
                        <UserIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="text" 
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Rashid Mahmood"
                          className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] pl-10 pr-4 py-3 font-normal transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-[#475569] uppercase tracking-wider block mb-1.5">Business Email</label>
                      <div className="relative">
                        <EnvelopeIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="email" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="rashid@company.com"
                          className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] pl-10 pr-4 py-3 font-normal transition-all"
                        />
                      </div>
                    </div>
                  </div>



                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#FF2D20] hover:bg-[#E5261A] text-white py-3.5 rounded-xl font-bold text-sm tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    {loading ? <ArrowPathIcon className="w-5 h-5 animate-spin text-white" /> : 'Synchronize Profile Coordinates'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* TAB PANEL 2: PASSWORD CREDENTIALS */}
            {activeTab === 'password' && (
              <motion.div
                key="password"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                <div>
                  <SectionLabel text="PASSWORD ROTATION" color="purple" />
                  <h3 className="text-xl font-semibold text-[#0F172A] tracking-tight">Rotate Security Credentials</h3>
                  <p className="text-xs text-[#64748B] font-semibold mt-1">Make sure to establish a complex configuration containing alphanumeric parameters.</p>
                </div>

                <form onSubmit={handleSavePassword} className="space-y-5">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-[#475569] uppercase tracking-wider block mb-1.5">Current Password</label>
                      <div className="relative">
                        <LockClosedIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type={showPass.old ? 'text' : 'password'}
                          required
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] pl-10 pr-10 py-3 font-normal transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass({ ...showPass, old: !showPass.old })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                        >
                          {showPass.old ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-[#475569] uppercase tracking-wider block mb-1.5">New Password</label>
                      <div className="relative">
                        <LockClosedIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type={showPass.new ? 'text' : 'password'}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimum 8 symbols"
                          className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] pl-10 pr-10 py-3 font-normal transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass({ ...showPass, new: !showPass.new })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                        >
                          {showPass.new ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-[#475569] uppercase tracking-wider block mb-1.5">Confirm New Password</label>
                      <div className="relative">
                        <LockClosedIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type={showPass.confirm ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re enter password"
                          className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] pl-10 pr-10 py-3 font-normal transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                        >
                          {showPass.confirm ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#FF2D20] hover:bg-[#E5261A] text-white py-3.5 rounded-xl font-bold text-sm tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    {loading ? <ArrowPathIcon className="w-5 h-5 animate-spin text-white" /> : 'Confirm New Password Rotation'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* TAB PANEL 3: RECOVERY PATHS */}
            {activeTab === 'recovery' && (
              <motion.div
                key="recovery"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                <div>
                  <SectionLabel text="RECOVERY COORDINATES" color="blue" />
                  <h3 className="text-xl font-semibold text-[#0F172A] tracking-tight">Recovery Backup Paths</h3>
                  <p className="text-xs text-[#64748B] font-semibold mt-1">Supply recovery coordinates. Security tokens will be dispatched to these endpoints during access failure.</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-medium text-[#475569] uppercase tracking-wider block mb-1.5">Backup Recovery Email</label>
                    <div className="relative">
                      <EnvelopeIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="email" 
                        required
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        placeholder="recovery@company.com"
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] pl-10 pr-4 py-3 font-normal transition-all"
                      />
                    </div>
                  </div>

                  {hasRecoveryEmail ? (
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={handleUpdateRecoveryEmail}
                        disabled={loading}
                        className="w-full bg-[#FF2D20] hover:bg-[#E5261A] text-white py-3.5 rounded-xl font-bold text-sm tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                      >
                        {loading ? <ArrowPathIcon className="w-5 h-5 animate-spin text-white" /> : 'Update Email'}
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveRecoveryEmail}
                        disabled={loading}
                        className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 py-3.5 rounded-xl font-bold text-sm tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                      >
                        {loading ? <ArrowPathIcon className="w-5 h-5 animate-spin text-red-500" /> : 'Delete Email'}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAddRecoveryEmail}
                      disabled={loading}
                      className="w-full bg-[#FF2D20] hover:bg-[#E5261A] text-white py-3.5 rounded-xl font-bold text-sm tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                    >
                      {loading ? <ArrowPathIcon className="w-5 h-5 animate-spin text-white" /> : 'Add Recovery Email'}
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB PANEL 4: 2FA PROTECTION SHIELD */}
            {activeTab === '2fa' && (
              <motion.div
                key="2fa"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                <div>
                  <SectionLabel text="TWO FACTOR ENROLLMENT" color="green" />
                  <h3 className="text-xl font-semibold text-[#0F172A] tracking-tight">Active Authenticator Shield</h3>
                  <p className="text-xs text-[#64748B] font-semibold mt-1">Synchronize double-shield confirmation keys to insulate marketing databases.</p>
                </div>

                {/* Premium status indicator */}
                <div className={`p-6 border rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors ${
                  is2FAEnabled 
                    ? 'bg-green-50/50 border-green-200' 
                    : 'bg-red-50/50 border-red-100'
                }`}>
                  <div className="flex items-center gap-3 text-center sm:text-left">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${is2FAEnabled ? 'bg-green-100' : 'bg-red-100'}`}>
                      <ShieldCheckIcon className={`w-5 h-5 ${is2FAEnabled ? 'text-green-600' : 'text-red-500'}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0F172A]">
                        Protection status:{' '}
                        <span className={is2FAEnabled ? 'text-green-600' : 'text-red-500'}>
                          {is2FAEnabled ? 'Active (Highly Secured)' : 'Inactive (Vulnerable)'}
                        </span>
                      </h4>
                      <p className="text-[11px] text-[#64748B] font-semibold mt-0.5">
                        {is2FAEnabled 
                          ? '2FA shield successfully locked onto this member ID.' 
                          : 'Configure Authenticator to protect campaigns from phishing.'}
                      </p>
                    </div>
                  </div>

                  <div>
                    {is2FAEnabled ? (
                      <button
                        type="button"
                        onClick={handleDisable2FA}
                        className="px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 rounded-lg text-xs font-bold transition-all cursor-pointer bg-white shadow-sm"
                      >
                        Deactivate 2FA Shield
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleEnable2FA}
                        className="px-5 py-2.5 bg-[#FF2D20] hover:bg-[#E5261A] text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
                      >
                        Enroll Mobile Key
                      </button>
                    )}
                  </div>
                </div>

                <div className="border border-[#E2E8F0] rounded-2xl p-5 bg-[#F8FAFC] space-y-2.5">
                  <h5 className="text-xs font-bold text-[#475569] uppercase tracking-wider">Double Shield Rules:</h5>
                  <ul className="text-xs text-[#64748B] list-disc pl-4 space-y-1.5 font-medium">
                    <li>Requires scanned key integration in standard mobile authenticator apps.</li>
                    <li>Time tokens match server clock variables and refresh every 30 seconds.</li>
                    <li>Supports fallback recovery phone endpoints if code is unavailable.</li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* TAB PANEL 5: ACTIVE SESSION DEVICES & LOGS */}
            {activeTab === 'activity' && (
              <motion.div
                key="activity"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <SectionLabel text="LOGS & SESSION CONTROLS" color="amber" />
                    <h3 className="text-xl font-semibold text-[#0F172A] tracking-tight">Active Devices & Security Logs</h3>
                    <p className="text-xs text-[#64748B] font-semibold mt-1">Review authenticated terminals. Revoke old coordinates to seal access.</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRefreshSessions}
                    disabled={isSyncingSessions}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white rounded-lg text-xs font-bold text-[#475569] hover:text-[#0F172A] cursor-pointer transition-all self-start sm:self-center shadow-sm"
                  >
                    <ArrowPathRoundedSquareIcon className={`w-4 h-4 text-[#FF2D20] ${isSyncingSessions ? 'animate-spin' : ''}`} />
                    Sync Connections
                  </button>
                </div>

                {/* Devices lists */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-[#475569] uppercase tracking-wider">Authorized Workspace Terminals:</h4>
                  
                  {isSyncingSessions ? (
                    <div className="p-8 border border-[#E2E8F0] rounded-2xl bg-[#F8FAFC] flex flex-col items-center justify-center gap-2">
                      <ArrowPathRoundedSquareIcon className="w-8 h-8 animate-spin text-[#FF2D20]" />
                      <span className="text-xs text-[#64748B] font-bold uppercase tracking-wider">Polling Remote Session States...</span>
                    </div>
                  ) : (
                    <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden divide-y divide-[#E2E8F0] shadow-sm">
                      {devices.map(dev => (
                        <div key={dev.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-[#E2E8F0]">
                              {dev.type === 'mobile' ? (
                                <DevicePhoneMobileIcon className="w-5 h-5 text-[#FF2D20]" />
                              ) : (
                                <ComputerDesktopIcon className="w-5 h-5 text-[#475569]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-[#0F172A]">{dev.os}</span>
                                {dev.isCurrent && (
                                  <span className="bg-green-100 text-green-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide">This Terminal</span>
                                )}
                              </div>
                              <p className="text-[10px] text-[#64748B] font-semibold truncate mt-0.5">
                                {dev.browser} • {dev.location} • IP: {dev.ip}
                              </p>
                            </div>
                          </div>

                          <div>
                            {dev.isCurrent ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setLoading(true)
                                  setTimeout(() => {
                                    setLoading(false)
                                    onClose()
                                  }, 800)
                                }}
                                className="text-xs font-bold text-[#E5261A] hover:underline cursor-pointer"
                              >
                                Logout
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setDevices(devices.filter(d => d.id !== dev.id))
                                  setSuccessMsg(`Session for ${dev.os} successfully terminated.`)
                                }}
                                className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                              >
                                Revoke
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {devices.length > 1 && !isSyncingSessions && (
                  <button
                    type="button"
                    onClick={handleLogoutOtherDevices}
                    className="w-full py-2.5 border border-red-200 hover:bg-red-50 text-red-600 hover:text-[#E5261A] rounded-xl text-xs font-bold transition-all cursor-pointer bg-white"
                  >
                    Revoke All Other Device Sessions
                  </button>
                )}

                {/* Vertical Security Trace Timeline */}
                <div className="space-y-4 pt-4 border-t border-[#E2E8F0]">
                  <h4 className="text-xs font-semibold text-[#475569] uppercase tracking-wider">Realtime Diagnostic Logs:</h4>
                  
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E2E8F0]">
                    {activities.slice(0, 4).map(act => (
                      <div key={act.id} className="relative flex items-start justify-between text-xs group">
                        
                        {/* Circle dot marker */}
                        <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm shrink-0 z-10 ${
                          act.type === 'success' 
                            ? 'bg-green-500' 
                            : act.type === 'warning' 
                            ? 'bg-amber-500' 
                            : 'bg-blue-500'
                        }`} />

                        <div className="min-w-0 pr-4">
                          <p className="font-bold text-[#0F172A] leading-tight">{act.action}</p>
                          <p className="text-[10px] text-[#64748B] font-semibold mt-1">IP: {act.ip} • Device: {act.device}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[9px] font-bold text-[#94A3B8]">{act.time}</span>
                          <span className={`block mt-1 text-[8px] font-extrabold px-1 rounded uppercase tracking-wide text-center ${
                            act.type === 'success' 
                              ? 'bg-green-50 text-green-700' 
                              : act.type === 'warning' 
                              ? 'bg-amber-50 text-amber-700' 
                              : 'bg-blue-50 text-blue-700'
                          }`}>
                            {act.type}
                          </span>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>

      {/* TWO FACTOR AUTH SCAN QR MODAL POPUP */}
      <AnimatePresence>
        {show2FAModal && (
          <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {!is2FAVerified ? (
                  <motion.div
                    key="scanner-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    {/* Back out button */}
                    <button
                      onClick={() => { setShow2FAModal(false); setTwoFACode(['', '', '', '', '', '']); }}
                      className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-[#64748B] hover:text-[#0F172A] cursor-pointer transition-colors"
                    >
                      <ArrowLeftIcon className="w-5 h-5 rotate-180" />
                    </button>

                    <div className="w-12 h-12 rounded-full bg-[#FF2D20]/10 flex items-center justify-center mx-auto mb-2">
                      <QrCodeIcon className="w-6 h-6 text-[#FF2D20]" />
                    </div>

                    <h3 className="text-lg font-semibold text-[#0F172A] tracking-tight font-mona">Enable Google 2FA</h3>
                    <p className="text-xs text-[#64748B] font-semibold mb-6 max-w-sm mx-auto">
                      Scan this custom matrix QR code inside your mobile Authenticator app to secure the login sequence.
                    </p>

                    {/* Realistic QR code with vertical Sweeping Laser line */}
                    <div className="relative w-40 h-40 bg-white border border-[#E2E8F0] rounded-2xl p-3.5 mx-auto mb-5 shadow-sm flex items-center justify-center overflow-hidden">
                      {/* Sweeping Laser Indicator */}
                      <div className="absolute left-0 w-full h-[2px] bg-[#FF2D20] shadow-[0_0_8px_#FF2D20] animate-scan-laser z-10" />

                      <div dangerouslySetInnerHTML={{ __html: qrCodeSvg }} className="w-full h-full text-[#0F172A] z-0 [&>svg]:w-full [&>svg]:h-full" />
                    </div>

                    {/* 6 Digit Input boxes */}
                    <form onSubmit={handleVerify2FA} className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[#475569] uppercase tracking-wider block">Confirm Authenticator Code</label>
                        <div className="flex justify-between gap-1.5 max-w-[240px] mx-auto">
                          {twoFACode.map((num, idx) => (
                            <input
                              key={idx}
                              type="text"
                              maxLength={1}
                              required
                              value={num}
                              ref={twoFARefs[idx]}
                              onChange={(e) => handle2FAChange(e.target, idx)}
                              onKeyDown={(e) => handle2FAKeyDown(e, idx)}
                              className="w-8 h-10 bg-[#F8FAFC] border-2 border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-center text-base font-extrabold text-[#0F172A] transition-all"
                            />
                          ))}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#FF2D20] hover:bg-[#E5261A] text-white py-3 rounded-xl font-bold text-sm tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                      >
                        {loading ? (
                          <ArrowPathIcon className="w-5 h-5 animate-spin text-white" />
                        ) : (
                          <>
                            Verify & Activate Shield
                            <ArrowRightIcon className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  // Gorgeous Pulse success screen inside 2FA modal
                  <motion.div
                    key="success-view"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="py-10 space-y-6 flex flex-col items-center justify-center"
                  >
                    <div className="relative">
                      {/* Pulse check rings */}
                      <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center relative">
                        <CheckCircleIconSolid className="w-10 h-10 text-green-600" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-[#0F172A] font-mona">Authenticator Sync Secure</h3>
                      <p className="text-xs text-[#64748B] font-semibold max-w-[240px]">
                        Google 2FA token security has been mapped to your user ID.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-green-700 bg-green-50 border border-green-100 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                      <ShieldCheckIcon className="w-4 h-4 text-green-600" />
                      Active Protection Enabled
                    </div>

                    {recoveryCodes.length > 0 && (
                      <div className="w-full mt-4 text-left border border-slate-200 rounded-xl p-4 bg-slate-50">
                        <h4 className="text-xs font-bold text-slate-700 mb-2">Save These Recovery Codes</h4>
                        <p className="text-[10px] text-slate-500 mb-3 leading-tight">
                          If you lose your device, use these codes to recover your account. Store them securely.
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {recoveryCodes.map((code, idx) => (
                            <div key={idx} className="bg-white border border-slate-200 px-2 py-1 rounded text-[11px] font-mono text-slate-800 text-center">
                              {code}
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => { setShow2FAModal(false); setIs2FAVerified(false); }}
                          className="mt-4 w-full bg-slate-800 hover:bg-slate-900 text-white py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          I have saved my codes
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRM PASSWORD MODAL */}
      <AnimatePresence>
        {showConfirmPasswordModal && (
          <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl p-6 sm:p-8 max-w-sm w-full relative overflow-hidden"
            >
              <button
                onClick={() => { setShowConfirmPasswordModal(false); setPasswordToConfirm(''); }}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-[#64748B] hover:text-[#0F172A] cursor-pointer transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 rotate-180" />
              </button>

              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <LockClosedIcon className="w-6 h-6 text-slate-600" />
              </div>

              <h3 className="text-lg font-semibold text-[#0F172A] tracking-tight mb-2">Confirm Password</h3>
              <p className="text-xs text-[#64748B] font-semibold mb-6">
                For your security, please confirm your password to continue.
              </p>

              <form onSubmit={handleConfirmPassword} className="space-y-4">
                <div className="relative">
                  <LockClosedIcon className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={passwordToConfirm}
                    onChange={(e) => setPasswordToConfirm(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] pl-10 pr-4 py-3 font-normal transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FF2D20] hover:bg-[#E5261A] text-white py-3 rounded-lg font-bold text-sm tracking-tight transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  {loading ? <ArrowPathIcon className="w-5 h-5 animate-spin text-white" /> : 'Confirm Password'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
