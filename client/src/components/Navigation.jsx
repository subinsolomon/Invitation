import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMenuHint, setShowMenuHint] = useState(() => {
    try {
      return sessionStorage.getItem('mobile-menu-hint-dismissed') !== 'true';
    } catch {
      return true;
    }
  });
  const location = useLocation();
  const { currentTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const isActive = (path) => location.pathname === path;

  const handleMenuToggle = () => {
    setIsOpen((open) => !open);
    setShowMenuHint(false);
    try {
      sessionStorage.setItem('mobile-menu-hint-dismissed', 'true');
    } catch {
      // The hint remains dismissed for this component instance if storage is unavailable.
    }
  };

  const navVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0.15 : 0.5 },
    },
  };

  const linkVariants = {
    hover: {
      scale: 1.05,
      color: currentTheme.accentColor,
    },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: prefersReducedMotion ? 0.12 : 0.32,
        ease: [0.22, 1, 0.36, 1],
        when: 'beforeChildren',
        staggerChildren: prefersReducedMotion ? 0 : 0.07,
        delayChildren: 0.04,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2, when: 'afterChildren', staggerChildren: 0.03, staggerDirection: -1 },
    },
  };

  const mobileLinkVariants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 14 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 360, damping: 28 } },
    exit: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 8, transition: { duration: 0.12 } },
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/ceremony', label: 'Ceremony' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/guest-photos', label: 'Guest Photos' },
    { path: '/rsvp', label: 'RSVP' },
    { path: '/feedback', label: 'Feedback' },
  ];

  return (
    <motion.nav
      className="sticky top-0 z-50 px-3 pt-2 sm:px-5 sm:pt-3"
      style={{
        backgroundColor: 'transparent',
      }}
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="glass-surface mx-auto flex max-w-7xl justify-between items-center rounded-full border border-sky-400/15 bg-slate-950/65 px-3 xs:px-4 sm:px-5 h-14 sm:h-16 shadow-[0_12px_36px_rgba(2,8,23,0.4)]">
          {/* Logo - Modern Look */}
          <Link
            to="/"
            className="flex items-center gap-2 xs:gap-3 group flex-shrink-0"
          >
            <motion.div
              className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border"
              style={{
                borderColor: `${currentTheme.accentColor}99`,
                background: `radial-gradient(circle at 35% 28%, ${currentTheme.accentColor}33, ${currentTheme.primaryColor} 72%)`,
                boxShadow: `0 0 20px ${currentTheme.accentColor}22, inset 0 0 12px ${currentTheme.accentColor}18`,
              }}
              whileHover={{ scale: 1.06, rotate: -4 }}
              transition={{ type: 'spring', stiffness: 280, damping: 18 }}
              aria-hidden="true"
            >
              <span
                className="absolute -translate-x-1.5 -translate-y-1 font-serif text-2xl font-bold italic leading-none"
                style={{ color: currentTheme.textColor }}
              >
                S
              </span>
              <span
                className="absolute translate-x-1.5 translate-y-1 font-serif text-2xl font-bold italic leading-none"
                style={{ color: currentTheme.accentColor }}
              >
                S
              </span>
              <span
                className="absolute z-10 font-serif text-[0.55rem] italic leading-none"
                style={{ color: currentTheme.accentColor }}
              >
                &amp;
              </span>
            </motion.div>
            <div className="hidden xs:block">
              <motion.h1
                className="text-lg xs:text-xl sm:text-2xl font-serif font-bold leading-none"
                style={{ color: currentTheme.accentColor }}
                whileHover={{ scale: 1.05 }}
              >
                Our Wedding
              </motion.h1>
              <p className="text-xs leading-tight" style={{ color: currentTheme.textColor }}>
                A celebration of love
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => (
              <motion.div key={link.path} variants={linkVariants} whileHover={prefersReducedMotion ? undefined : 'hover'}>
                <Link
                  to={link.path}
                  className="relative isolate px-3 sm:px-4 py-2 rounded-full font-medium transition-all text-sm sm:text-base"
                  style={{
                    color: isActive(link.path) ? currentTheme.accentColor : currentTheme.textColor,
                  }}
                >
                  {isActive(link.path) && (
                    <motion.span
                      className="absolute inset-0 -z-10 rounded-full bg-sky-300/10"
                      layoutId="activeTabPill"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="relative md:hidden flex-shrink-0 ml-2">
            <button
              onClick={handleMenuToggle}
              className="p-2 rounded-lg"
              style={{ color: currentTheme.textColor }}
              aria-label="Toggle menu"
            >
              <motion.svg
                className="w-5 h-5 xs:w-6 xs:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={prefersReducedMotion ? { rotate: 0 } : isOpen ? { rotate: 90 } : { rotate: 0 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </motion.svg>
            </button>
            <AnimatePresence>
              {showMenuHint && (
                <motion.div
                  className="absolute right-0 top-full z-50 mt-2 whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-semibold shadow-xl"
                  style={{
                    color: '#f8fafc',
                    backgroundColor: 'rgba(2, 8, 23, 0.96)',
                    borderColor: 'rgba(56, 189, 248, 0.55)',
                    boxShadow: '0 12px 32px rgba(2, 8, 23, 0.55), 0 0 20px rgba(56, 189, 248, 0.12)',
                  }}
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 1, y: [0, 3, 0], scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: prefersReducedMotion ? 0.15 : 0.35, y: { duration: 1.4, repeat: prefersReducedMotion ? 0 : Infinity, ease: 'easeInOut' } }}
                  aria-hidden="true"
                >
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle"
                    style={{ backgroundColor: currentTheme.accentColor }}
                  />
                  Tap to explore
                  <span
                    className="absolute right-4 bottom-full w-0 h-0 border-x-[6px] border-x-transparent border-b-[6px]"
                    style={{ borderBottomColor: 'rgba(2, 8, 23, 0.96)' }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
          <motion.div
            className="glass-surface md:hidden mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl border border-sky-400/15 bg-slate-950/85 p-2"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {navLinks.map((link) => (
              <motion.div key={link.path} variants={mobileLinkVariants} whileHover={prefersReducedMotion ? undefined : { x: 4 }}>
                <Link
                  to={link.path}
                  className="block px-4 py-3 rounded-lg font-medium text-sm xs:text-base"
                  style={{
                    backgroundColor: isActive(link.path) ? `${currentTheme.accentColor}33` : 'transparent',
                    color: isActive(link.path) ? currentTheme.accentColor : currentTheme.textColor,
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;
