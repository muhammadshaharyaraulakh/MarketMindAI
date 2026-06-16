import React, { useState } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import axios from 'axios'
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
import AuthSystem from './Authentication/AuthSystem'
import ProfilePage from './Profile/ProfilePage'
import { AnimatePresence } from 'framer-motion'

function LandingPage({ onSignIn, onSignUp }) {
  const navigate = useNavigate();
  return (
    <main className="overflow-x-hidden w-full relative bg-white select-none">
      <Navbar 
        onSignIn={onSignIn} 
        onSignUp={onSignUp} 
        onShowDashboard={() => navigate('/dashboard')}
      />
      <Hero onGetStarted={onSignUp} />
      <LogoStrip />
      <ProblemSection />
      <FeaturesSection />
      <DashboardSection />
      <SecuritySection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection onGetStarted={onSignUp} />
      <Footer />
    </main>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [authView, setAuthView] = useState(null)
  const [viewProfile, setViewProfile] = useState(false)

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/user');
        if (response.data && !response.data.email_verified_at) {
          // Force logout if not verified
          try { await axios.post('/api/logout'); } catch(e) {}
          setUser(null);
          localStorage.clear();
          sessionStorage.clear();
          document.cookie.split(";").forEach((c) => {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
          });
        } else {
          setUser(response.data);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  React.useEffect(() => {
    if (!loadingUser && user && (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup' || authView)) {
      setAuthView(null);
      navigate('/dashboard');
    }
  }, [user, loadingUser, location.pathname, authView, navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
    } catch (err) {
      console.error('Logout API failed', err);
    } finally {
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      navigate('/');
    }
  };

  if (loadingUser) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage onSignIn={() => setAuthView('login')} onSignUp={() => setAuthView('signup')} />} />
        <Route path="/*" element={
          user ? (
            <Dashboard 
              onLogout={handleLogout} 
              onOpenProfile={() => setViewProfile(true)} 
              user={user}
            />
          ) : (
            <Navigate to="/" />
          )
        } />
      </Routes>

      <AnimatePresence>
        {authView && (
          <AuthSystem
            initialView={authView}
            onClose={(result) => {
              setAuthView(null)
              if (result?.loggedIn) {
                // Trigger a re-fetch of the user
                axios.get('/api/user').then(res => {
                  setUser(res.data);
                  navigate('/dashboard');
                });
              }
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewProfile && (
          <ProfilePage onClose={() => setViewProfile(false)} user={user} />
        )}
      </AnimatePresence>
    </>
  )
}