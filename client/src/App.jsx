import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import RSVPPage from './pages/RSVPPage';
import CeremonyPage from './pages/CeremonyPage';
import GalleryPage from './pages/GalleryPage';
import GuestPhotoPage from './pages/GuestPhotoPage';
import FeedbackPage from './pages/FeedbackPage';
import DashboardPage from './pages/DashboardPage';
import './index.css';

const ROUTE_ORDER = ['/', '/ceremony', '/gallery', '/guest-photos', '/rsvp', '/feedback', '/dashboard'];
const INTRO_KEY = 'invitation_opened';

function InvitationIntro({ onOpen, prefersReducedMotion }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] grid grid-cols-2 overflow-hidden"
      initial="closed"
      animate="open"
      exit="dismissed"
      aria-label="Wedding invitation opening"
    >
      <motion.div
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 1 },
          dismissed: { opacity: 0, scale: 1.04, filter: 'blur(12px)' },
        }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="relative z-10 border-r border-sky-200/10 bg-slate-950/65"
        variants={{
          closed: { x: 0, opacity: 1, scale: 1, filter: 'blur(0px)' },
          open: { x: 0, opacity: 1, scale: 1, filter: 'blur(0px)' },
          dismissed: { x: '-100%', opacity: 0, scale: 1.04, filter: 'blur(12px)' },
        }}
        transition={{ duration: prefersReducedMotion ? 0.2 : 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="relative z-10 border-l border-sky-200/10 bg-slate-950/65"
        variants={{
          closed: { x: 0, opacity: 1, scale: 1, filter: 'blur(0px)' },
          open: { x: 0, opacity: 1, scale: 1, filter: 'blur(0px)' },
          dismissed: { x: '100%', opacity: 0, scale: 1.04, filter: 'blur(12px)' },
        }}
        transition={{ duration: prefersReducedMotion ? 0.2 : 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="absolute inset-0 z-20 flex items-center justify-center px-6 text-center"
        variants={{
          closed: { opacity: 1, scale: 1 },
          open: { opacity: 1, scale: 1 },
          dismissed: { opacity: 0, scale: 0.96, filter: 'blur(8px)' },
        }}
        transition={{ duration: prefersReducedMotion ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="intro-seal glass-surface flex w-full max-w-sm flex-col items-center rounded-[2rem] px-8 py-10 sm:px-12 sm:py-14">
          <div className="mb-7 flex h-24 w-24 items-center justify-center rounded-full border border-sky-200/35 bg-sky-300/[0.07] font-serif text-3xl text-sky-100 shadow-[0_0_60px_rgba(56,189,248,0.16)]">
            S <span className="mx-1 text-amber-300">&amp;</span> S
          </div>
          <p className="eyebrow mb-3">Sajini &amp; Subin</p>
          <p className="font-serif text-2xl text-white sm:text-3xl">May 8, 2027</p>
          <button
            type="button"
            onClick={onOpen}
            className="mt-9 rounded-full border border-sky-200/45 bg-sky-300/10 px-7 py-3 text-sm font-semibold text-sky-100 transition-colors hover:bg-sky-300/20"
          >
            Open Invitation <span aria-hidden="true">↗</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AppContent() {
  const { currentTheme } = useTheme();
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const previousPath = useRef(location.pathname);
  const [direction, setDirection] = useState(1);
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return sessionStorage.getItem(INTRO_KEY) !== 'true';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const previousIndex = ROUTE_ORDER.indexOf(previousPath.current);
    const currentIndex = ROUTE_ORDER.indexOf(location.pathname);
    if (previousPath.current !== location.pathname) {
      if (currentIndex >= 0 && previousIndex >= 0) {
        setDirection(currentIndex >= previousIndex ? 1 : -1);
      }
      previousPath.current = location.pathname;
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  }, [location.pathname, prefersReducedMotion]);

  useEffect(() => {
    if (!showIntro) return undefined;
    const timer = window.setTimeout(openInvitation, 2800);
    return () => window.clearTimeout(timer);
  }, [showIntro]);

  function openInvitation() {
    try {
      sessionStorage.setItem(INTRO_KEY, 'true');
    } catch {
      // The intro remains dismissed for this app instance if storage is unavailable.
    }
    setShowIntro(false);
  }

  const routeVariants = {
    initial: (routeDirection) => prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, x: routeDirection * 36, y: 8, filter: 'blur(6px)', scale: 0.99 },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: { duration: prefersReducedMotion ? 0.18 : 0.48, ease: [0.22, 1, 0.36, 1] },
    },
    exit: (routeDirection) => prefersReducedMotion
      ? { opacity: 0, transition: { duration: 0.14 } }
      : {
          opacity: 0,
          x: routeDirection * -28,
          y: -4,
          filter: 'blur(4px)',
          scale: 0.99,
          transition: { duration: 0.32, ease: [0.4, 0, 1, 1] },
        },
  };

  return (
    <div
      style={{ backgroundColor: currentTheme.bgColor, color: currentTheme.textColor }}
      className="min-h-screen transition-colors duration-500"
    >
      <AnimatePresence>
        {showIntro && <InvitationIntro onOpen={openInvitation} prefersReducedMotion={prefersReducedMotion} />}
      </AnimatePresence>
      <Navigation />
      <main className="page-shell">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={location.pathname}
            custom={direction}
            variants={routeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage isIntroComplete={!showIntro} />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/guest-photos" element={<GuestPhotoPage />} />
              <Route path="/ceremony" element={<CeremonyPage />} />
              <Route path="/rsvp" element={<RSVPPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Router>
  );
}
