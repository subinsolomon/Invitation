import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
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
        duration: 0.32,
        ease: [0.22, 1, 0.36, 1],
        when: 'beforeChildren',
        staggerChildren: 0.07,
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
    hidden: { opacity: 0, x: 14 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 360, damping: 28 } },
    exit: { opacity: 0, x: 8, transition: { duration: 0.12 } },
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/guest-photos', label: 'Guest Photos' },
    { path: '/ceremony', label: 'Ceremony' },
  ];

  return (
    <motion.nav
      className="sticky top-0 z-50 border-b backdrop-blur-xl"
      style={{
        backgroundColor: `${currentTheme.primaryColor}dd`,
        borderColor: `${currentTheme.accentColor}44`,
        boxShadow: `0 12px 32px ${currentTheme.primaryColor}33`,
      }}
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 xs:h-18 sm:h-20">
          {/* Logo - Modern Look */}
          <Link
            to="/"
            className="flex items-center gap-2 xs:gap-3 group flex-shrink-0"
          >
            <motion.div
              className="text-2xl xs:text-3xl sm:text-4xl"
              animate={{ y: [0, -3, 0], rotate: [0, 4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              💒
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
              <motion.div key={link.path} variants={linkVariants} whileHover="hover">
                <Link
                  to={link.path}
                  className="px-3 sm:px-4 py-2 rounded-lg font-medium transition-all relative group text-sm sm:text-base"
                  style={{
                    color: isActive(link.path) ? currentTheme.accentColor : currentTheme.textColor,
                  }}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 rounded-full"
                      style={{ backgroundColor: currentTheme.accentColor }}
                      layoutId="underline"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4 flex-shrink-0">
            {/* RSVP Button - Highlighted */}
            <motion.div
              className="px-4 lg:px-6 py-2 rounded-lg font-semibold flex items-center gap-2 text-sm lg:text-base whitespace-nowrap"
              style={{
                backgroundColor: currentTheme.accentColor,
                color: currentTheme.primaryColor,
                boxShadow: `0 4px 15px ${currentTheme.accentColor}66`,
              }}
              whileHover={{ scale: 1.05, boxShadow: `0 8px 25px ${currentTheme.accentColor}99` }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/rsvp"
                className="flex items-center gap-2 px-4 py-2 lg:px-6 font-semibold text-sm lg:text-base whitespace-nowrap"
                style={{ color: currentTheme.primaryColor }}
              >
                ✉️ <span className="hidden sm:inline">RSVP</span>
              </Link>
            </motion.div>
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
                animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </motion.svg>
            </button>
            <AnimatePresence>
              {showMenuHint && (
                <motion.div
                  className="absolute right-0 top-full mt-2 whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-semibold shadow-xl"
                  style={{
                    color: currentTheme.textColor,
                    backgroundColor: currentTheme.secondaryColor,
                    borderColor: `${currentTheme.accentColor}88`,
                  }}
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: [0, 3, 0], scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.35, y: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } }}
                  aria-hidden="true"
                >
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle"
                    style={{ backgroundColor: currentTheme.accentColor }}
                  />
                  Tap to explore
                  <span
                    className="absolute right-4 bottom-full w-0 h-0 border-x-[6px] border-x-transparent border-b-[6px]"
                    style={{ borderBottomColor: currentTheme.secondaryColor }}
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
            className="md:hidden pb-4 space-y-2 max-h-96 overflow-y-auto"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {navLinks.map((link) => (
              <motion.div key={link.path} variants={mobileLinkVariants} whileHover={{ x: 4 }}>
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
            
            <motion.div variants={mobileLinkVariants} whileHover={{ x: 4 }}>
              <Link
                to="/rsvp"
                className="block px-4 py-3 rounded-lg font-semibold text-center text-sm xs:text-base"
                style={{
                  backgroundColor: currentTheme.accentColor,
                  color: currentTheme.primaryColor,
                }}
                onClick={() => setIsOpen(false)}
              >
                ✉️ RSVP
              </Link>
            </motion.div>
          </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;
