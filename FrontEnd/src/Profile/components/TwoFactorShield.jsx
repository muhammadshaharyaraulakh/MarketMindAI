import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheckIcon, ArrowLeftIcon, QrCodeIcon, ArrowPathIcon,
  ArrowRightIcon, ArrowDownTrayIcon, LockClosedIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import { SectionLabel } from './SectionLabel';
import { profileService } from '../services/profileService';

export default function TwoFactorShield({ user, tabVariants, setErrorMsg, setSuccessMsg }) {
  const [is2FAEnabled, setIs2FAEnabled] = useState(!!user?.two_factor_confirmed_at);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showConfirmPasswordModal, setShowConfirmPasswordModal] = useState(false);
  const [passwordToConfirm, setPasswordToConfirm] = useState('');
  const [qrCodeSvg, setQrCodeSvg] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [is2FAVerified, setIs2FAVerified] = useState(false);
  const [twoFACode, setTwoFACode] = useState(['', '', '', '', '', '']);
  const twoFARefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const [loading, setLoading] = useState(false);

  const handle2FAChange = (element, index) => {
    const val = element.value.replace(/[^0-9]/g, '');
    if (!val) {
      const new2FA = [...twoFACode];
      new2FA[index] = '';
      setTwoFACode(new2FA);
      return;
    }
    const new2FA = [...twoFACode];
    new2FA[index] = val.slice(-1);
    setTwoFACode(new2FA);
    if (index < 5 && twoFARefs[index + 1].current) {
      twoFARefs[index + 1].current.focus();
    }
  };

  const handle2FAKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !twoFACode[index] && index > 0 && twoFARefs[index - 1].current) {
      twoFARefs[index - 1].current.focus();
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    const entered = twoFACode.join('');
    if (entered.length < 6) {
      setErrorMsg('Please input all 6 digits of verification code.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      await profileService.verify2FA(entered);
      const recoveryResp = await profileService.getRecoveryCodes();
      setRecoveryCodes(recoveryResp.data);
      setLoading(false);
      setIs2FAVerified(true);
      setIs2FAEnabled(true);
      setTwoFACode(['', '', '', '', '', '']);
      setSuccessMsg('Google Authenticator 2FA protection locked successfully.');
    } catch (err) {
      setLoading(false);
      const firstError = err.response?.data?.errors ? Object.values(err.response.data.errors)[0][0] : err.response?.data?.message;
      setErrorMsg(firstError || 'Invalid verification code.');
    }
  };

  const handleDisable2FA = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await profileService.disable2FA();
      setLoading(false);
      setIs2FAEnabled(false);
      setSuccessMsg('Google Authenticator 2FA dismantled.');
    } catch (err) {
      setLoading(false);
      if (err.response?.status === 423) {
        setErrorMsg('Session locked. Please confirm your password by trying to enable 2FA again, or refresh the page.');
      } else {
        const firstError = err.response?.data?.errors ? Object.values(err.response.data.errors)[0][0] : err.response?.data?.message;
        setErrorMsg(firstError || 'Error disabling 2FA.');
      }
    }
  };

  const handleEnable2FA = () => setShowConfirmPasswordModal(true);

  const handleConfirmPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await profileService.confirmPassword(passwordToConfirm);
      await profileService.enable2FA();
      const qrResp = await profileService.get2FAQR();
      setQrCodeSvg(qrResp.data.svg);
      setLoading(false);
      setShowConfirmPasswordModal(false);
      setPasswordToConfirm('');
      setShow2FAModal(true);
    } catch (err) {
      setLoading(false);
      const firstError = err.response?.data?.errors ? Object.values(err.response.data.errors)[0][0] : err.response?.data?.message;
      setErrorMsg(firstError || 'Error confirming password. Please verify your current password.');
    }
  };

  const downloadRecoveryCodes = () => {
    const element = document.createElement('a');
    const file = new Blob([recoveryCodes.join('\n')], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'marketmind-recovery-codes.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
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

        <div className={`p-6 border rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors ${is2FAEnabled
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
                Add Google Authenticator
              </button>
            )}
          </div>
        </div>

        <div className="border border-[#E2E8F0] rounded-2xl p-5 bg-[#F8FAFC] space-y-2.5">
          <h5 className="text-[13px] text-[#475569] mb-1">Double Shield Rules:</h5>
          <ul className="text-xs text-[#64748B] list-disc pl-4 space-y-1.5 font-medium">
            <li>Requires scanned key integration in standard mobile authenticator apps.</li>
            <li>Time tokens match server clock variables and refresh every 30 seconds.</li>
            <li>Supports fallback recovery phone endpoints if code is unavailable.</li>
          </ul>
        </div>
      </motion.div>

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

                    <div className="relative w-40 h-40 bg-white border border-[#E2E8F0] rounded-2xl p-3.5 mx-auto mb-5 shadow-sm flex items-center justify-center overflow-hidden">
                      <div className="absolute left-0 w-full h-[2px] bg-[#FF2D20] shadow-[0_0_8px_#FF2D20] animate-scan-laser z-10" />
                      <div dangerouslySetInnerHTML={{ __html: qrCodeSvg }} className="w-full h-full text-[#0F172A] z-0 [&>svg]:w-full [&>svg]:h-full" />
                    </div>

                    <form onSubmit={handleVerify2FA} className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-[13px] text-[#475569] block">Confirm Authenticator Code</label>
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
                  <motion.div
                    key="success-view"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="py-10 space-y-6 flex flex-col items-center justify-center"
                  >
                    <div className="relative">
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
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={downloadRecoveryCodes}
                            className="w-full flex items-center justify-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
                          >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            Download Keys
                          </button>
                          <button
                            type="button"
                            onClick={() => { setShow2FAModal(false); setIs2FAVerified(false); }}
                            className="w-full bg-slate-800 hover:bg-slate-900 text-white py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF2D20] focus:bg-white focus:outline-none rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] pl-10 pr-4 py-2.5 transition-all duration-150"
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
    </>
  );
}
