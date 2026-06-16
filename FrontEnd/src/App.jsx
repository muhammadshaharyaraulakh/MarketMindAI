import React, { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
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
  const [user] = useState({ name: 'Test User', email: 'test@example.com' }) // Mock user
  const navigate = useNavigate();
  const [authView, setAuthView] = useState(null)
  const [viewProfile, setViewProfile] = useState(false)

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage onSignIn={() => setAuthView('login')} onSignUp={() => setAuthView('signup')} />} />
        <Route path="/*" element={
          <Dashboard 
            onLogout={() => navigate('/')} 
            onOpenProfile={() => setViewProfile(true)} 
            user={user}
          />
        } />
      </Routes>

      <AnimatePresence>
        {authView && (
          <AuthSystem
            initialView={authView}
            onClose={(result) => {
              setAuthView(null)
              if (result?.loggedIn) {
                navigate('/dashboard')
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