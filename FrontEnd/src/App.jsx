import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigate, useLocation } from 'react-router-dom'
import AuthSystem from './Authentication/AuthSystem'
import ProfilePage from './Profile/ProfilePage'
import Dashboard from './dashboard/Dashboard'
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LogoStrip from './components/LogoStrip';
import ProblemSection from './components/ProblemSection';
import FeaturesSection from './components/FeaturesSection';
import DashboardSection from './components/DashboardSection';
import SecuritySection from './components/SecuritySection';
import PricingSection from './components/PricingSection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

axios.defaults.withCredentials = true;

export default function App() {
  const [authView, setAuthView] = useState(null)
  const [viewProfile, setViewProfile] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [verifyingEmail, setVerifyingEmail] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (isLoggedIn) {
      const fetchUser = async () => {
        try {
          const token = localStorage.getItem('auth_token');
          if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
          const backendUrl = 'http://localhost:8000';
          const response = await axios.get(`${backendUrl}/api/user`, {
            headers: {
              'Accept': 'application/json'
            }
          });
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          if (error.response && error.response.status === 401) {
            setIsLoggedIn(false);
            localStorage.removeItem('auth_token');
            delete axios.defaults.headers.common['Authorization'];
          }
        }
      };
      fetchUser();
    } else {
      setUser(null);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const checkEmailVerification = async () => {
      const path = window.location.pathname;
      if (path.startsWith('/verify-email')) {
        setVerifyingEmail(true);
        try {
          const params = new URLSearchParams(window.location.search);
          const backendUrl = params.get('verify_url');
          
          if (!backendUrl) {
            throw new Error('Verification URL missing');
          }
          
          const response = await axios.get(backendUrl, {
            headers: { 'Accept': 'application/json' }
          });
          
          if (response.data && response.data.token) {
            // Save token
            localStorage.setItem('auth_token', response.data.token);
            // Setup default axios header
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error('Email verification failed:', error);
          alert('Email verification failed or link expired. Please try again.');
        } finally {
          setVerifyingEmail(false);
          // Clean up URL without reloading
          window.history.replaceState({}, document.title, '/');
        }
      } else if (path.startsWith('/reset-password')) {
        setAuthView('password-reset');
      } else {
        // Check if token exists in local storage
        const token = localStorage.getItem('auth_token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setIsLoggedIn(true);
        }
      }
    };
    
    checkEmailVerification();
  }, []);

  if (verifyingEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF2D20] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#0F172A] font-bold text-lg">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoggedIn ? (
        <Dashboard 
          onLogout={async () => {
            try {
              const backendUrl = 'http://localhost:8000';
              await axios.post(`${backendUrl}/api/logout`, {}, {
                headers: {
                  'Accept': 'application/json'
                }
              });
            } catch (error) {
              console.error('Logout request failed:', error);
            } finally {
              setIsLoggedIn(false);
              setUser(null);
              localStorage.removeItem('auth_token');
              delete axios.defaults.headers.common['Authorization'];
            }
          }} 
          onOpenProfile={() => setViewProfile(true)} 
          user={user}
        />
      ) : (
        <>
          {window.location.pathname !== '/' && <Navigate to="/" replace />}
          <main className="overflow-x-hidden w-full relative bg-white select-none">
          <Navbar 
            onSignIn={() => setAuthView('login')} 
            onSignUp={() => setAuthView('signup')} 
            onShowDashboard={() => setAuthView('login')}
          />
          <Hero onGetStarted={() => setAuthView('signup')} />
          <LogoStrip />
          <ProblemSection />
          <FeaturesSection />
          <DashboardSection />
          <SecuritySection />
          <PricingSection />
          <TestimonialsSection />
          <FAQSection />
          <CTASection onGetStarted={() => setAuthView('signup')} />
          <Footer />

          <AnimatePresence>
            {authView && (
              <AuthSystem
                initialView={authView}
                onClose={(result) => {
                  setAuthView(null)
                  if (result?.loggedIn) {
                    setIsLoggedIn(true)
                  }
                }}
              />
            )}
          </AnimatePresence>
        </main>
        </>
      )}

      <AnimatePresence>
        {viewProfile && (
          <ProfilePage onClose={() => setViewProfile(false)} user={user} />
        )}
      </AnimatePresence>
    </>
  )
}