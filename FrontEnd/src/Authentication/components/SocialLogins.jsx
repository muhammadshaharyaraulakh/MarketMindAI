import React, { useState } from 'react';
import axios from 'axios';

export default function SocialLogins({ onSuccess, mode = 'login' }) {
  const [loading, setLoading] = useState(false)

  const handleProviderClick = async (providerName) => {
    setLoading(true)
    try {
      const response = await axios.get(`http://localhost:8000/auth/${providerName.toLowerCase()}/redirect`);
      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      setLoading(false)
      console.error(`${providerName} login failed:`, error)
    }
  }

  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E2E8F0]"></div></div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-[#94A3B8] font-bold tracking-wider font-poppins">
            {mode === 'login' ? 'Or login instantly with' : 'Or register with'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          disabled={loading}
          onClick={() => handleProviderClick('Google')}
          className="flex justify-center items-center py-2.5 border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg bg-white shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
          title="Login with Google"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
        </button>

        <button
          disabled={loading}
          onClick={() => handleProviderClick('GitHub')}
          className="flex justify-center items-center py-2.5 border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg bg-white shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
          title="Login with GitHub"
        >
          <svg className="w-5 h-5 text-[#0F172A]" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
        </button>
      </div>
    </>
  )
}
