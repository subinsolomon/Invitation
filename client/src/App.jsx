import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import RSVPPage from './pages/RSVPPage';
import CeremonyPage from './pages/CeremonyPage';
import GalleryPage from './pages/GalleryPage';
import GuestPhotoPage from './pages/GuestPhotoPage';
import './index.css';

function AppContent() {
  const { currentTheme } = useTheme();
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      style={{ backgroundColor: currentTheme.bgColor, color: currentTheme.textColor }}
      className="min-h-screen transition-colors duration-500"
    >
      <Navigation />
      <main className="page-shell">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.99, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 1.01, filter: 'blur(6px)' }}
            transition={{ duration: prefersReducedMotion ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/guest-photos" element={<GuestPhotoPage />} />
              <Route path="/ceremony" element={<CeremonyPage />} />
              <Route path="/rsvp" element={<RSVPPage />} />
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
