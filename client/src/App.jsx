import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { WeddingPhaseProvider } from './context/WeddingPhaseContext';
import Navigation from './components/Navigation';
import AmbientBackdrop from './components/motion/AmbientBackdrop';
import PointerGlow from './components/motion/PointerGlow';
import ScrollProgress from './components/motion/ScrollProgress';
import HomePage from './pages/HomePage';
import RSVPPage from './pages/RSVPPage';
import GalleryPage from './pages/GalleryPage';
import GuestPhotoPage from './pages/GuestPhotoPage';
import FeedbackPage from './pages/FeedbackPage';
import DashboardPage from './pages/DashboardPage';
import WeddingGuidePage from './pages/WeddingGuidePage';
import ShareMemoriesPage from './pages/ShareMemoriesPage';
import { EASE_SWIFT } from './lib/motion';
import './index.css';

const ROUTE_ORDER = ['/', '/ceremony', '/gallery', '/guest-photos', '/share-memories', '/rsvp', '/feedback', '/dashboard'];
const INTRO_STORAGE_KEY = 'invitation_opened';
const INTRO_AUTO_OPEN_MS = 3200;

/**
 * Opening invitation overlay.
 *
 * Instead of a split curtain or a sparkle burst, the seal lifts and fades while
 * a gold hairline fills to show when it will open on its own.
 */
function InvitationIntro({ onOpen }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center px-5"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: prefersReducedMotion ? 0.15 : 0.75, ease: EASE_SWIFT },
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Open the wedding invitation"
    >
      <motion.div
        className="absolute inset-0 bg-ink-950/92 backdrop-blur-xl"
        exit={{ opacity: 0 }}
        transition={{ duration: prefersReducedMotion ? 0.15 : 0.6 }}
      />

      <motion.div
        className="relative z-10 w-full max-w-md overflow-hidden rounded-4xl border border-ink-100/12 bg-ink-900/70 px-8 py-12 text-center shadow-lift backdrop-blur-2xl sm:px-12 sm:py-14"
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{
          opacity: 0,
          y: prefersReducedMotion ? 0 : -22,
          scale: prefersReducedMotion ? 1 : 0.98,
          filter: prefersReducedMotion ? 'blur(0px)' : 'blur(8px)',
          transition: { duration: prefersReducedMotion ? 0.15 : 0.5, ease: EASE_SWIFT },
        }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.85, ease: EASE_SWIFT }}
      >
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-300/60 to-transparent" aria-hidden="true" />

        <motion.div
          className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-gold-300/35 bg-gold-300/[0.06]"
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.9, delay: prefersReducedMotion ? 0 : 0.15, ease: EASE_SWIFT }}
        >
          <span className="font-serif text-2xl leading-none tracking-tight text-gold-200">
            S<span className="mx-1 text-base text-ink-300/70">&</span>S
          </span>
        </motion.div>

        <motion.p
          className="eyebrow mt-8 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: prefersReducedMotion ? 0 : 0.35 }}
        >
          Sajini & Subin
        </motion.p>

        <motion.p
          className="display mt-4 text-4xl text-ink-50 sm:text-5xl"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.42, ease: EASE_SWIFT }}
        >
          May 8, 2027
        </motion.p>

        <motion.p
          className="mt-3 text-[0.65rem] font-semibold uppercase tracking-label text-ink-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: prefersReducedMotion ? 0 : 0.5 }}
        >
          Chavadiyil Jehoash Gardens · Kerala
        </motion.p>

        <motion.button
          type="button"
          onClick={onOpen}
          className="btn btn-primary mt-9 w-full"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: prefersReducedMotion ? 0 : 0.6, ease: EASE_SWIFT }}
        >
          Open the invitation
        </motion.button>

        <div className="mt-7 h-px w-full overflow-hidden bg-ink-100/10" aria-hidden="true">
          <motion.span
            className="block h-full origin-left bg-gradient-to-r from-gold-500 via-gold-300 to-gold-200"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: prefersReducedMotion ? 0 : INTRO_AUTO_OPEN_MS / 1000, ease: 'linear' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function AppContent() {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const previousPath = useRef(location.pathname);
  const [direction, setDirection] = useState(1);
  const [isIntroVisible, setIsIntroVisible] = useState(() => {
    try {
      return sessionStorage.getItem(INTRO_STORAGE_KEY) !== 'true';
    } catch {
      return true;
    }
  });

  const dismissIntro = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, 'true');
    } catch {
      // Without storage the intro simply stays dismissed for this page view.
    }
    setIsIntroVisible(false);
  }, []);

  useEffect(() => {
    if (!isIntroVisible) return undefined;
    const timer = window.setTimeout(dismissIntro, INTRO_AUTO_OPEN_MS);
    return () => window.clearTimeout(timer);
  }, [isIntroVisible, dismissIntro]);

  useEffect(() => {
    if (previousPath.current === location.pathname) return;

    const previousIndex = ROUTE_ORDER.indexOf(previousPath.current);
    const currentIndex = ROUTE_ORDER.indexOf(location.pathname);
    if (previousIndex >= 0 && currentIndex >= 0) {
      setDirection(currentIndex >= previousIndex ? 1 : -1);
    }

    previousPath.current = location.pathname;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, [location.pathname, prefersReducedMotion]);

  const routeVariants = {
    initial: (routeDirection) =>
      prefersReducedMotion
        ? { opacity: 0 }
        : { opacity: 0, x: routeDirection * 28, y: 10, filter: 'blur(6px)' },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: prefersReducedMotion ? 0 : 0.5, ease: EASE_SWIFT },
    },
    exit: (routeDirection) =>
      prefersReducedMotion
        ? { opacity: 0, transition: { duration: 0.1 } }
        : {
            opacity: 0,
            x: routeDirection * -20,
            y: -6,
            filter: 'blur(4px)',
            transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
          },
  };

  return (
    <div className="relative min-h-screen text-ink-100">
      <AmbientBackdrop />
      <PointerGlow />
      <ScrollProgress />

      <AnimatePresence>{isIntroVisible && <InvitationIntro onOpen={dismissIntro} />}</AnimatePresence>

      <Navigation />

      <main className="page-shell">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={location.pathname}
            custom={direction}
            variants={routeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage isIntroComplete={!isIntroVisible} />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/guest-photos" element={<GuestPhotoPage />} />
              <Route path="/share-memories" element={<ShareMemoriesPage />} />
              <Route path="/ceremony" element={<WeddingGuidePage />} />
              <Route path="/rsvp" element={<RSVPPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/guide" element={<Navigate to="/ceremony" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
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
        <WeddingPhaseProvider>
          <AppContent />
        </WeddingPhaseProvider>
      </ThemeProvider>
    </Router>
  );
}
