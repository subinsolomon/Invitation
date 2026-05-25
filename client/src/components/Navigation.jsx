import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, switchTheme, availableThemes, currentTheme } = useTheme();

  const isActive = (path) => location.pathname === path;

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

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/guest-photos', label: 'Guest Photos' },
    { path: '/ceremony', label: 'Ceremony' },
  ];

  return (
    <motion.nav
      className="sticky top-0 z-50 backdrop-blur-lg"
      style={{
        background: `linear-gradient(135deg, ${currentTheme.primaryColor}ee 0%, ${currentTheme.primaryColor}cc 100%)`,
        borderBottom: `3px solid ${currentTheme.accentColor}`,
        boxShadow: `0 8px 32px ${currentTheme.accentColor}33`,
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
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity }}
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
            {/* Theme Selector - Modern */}
            <div className="flex gap-1 lg:gap-2 bg-opacity-20 px-2 lg:px-3 py-1 rounded-full border" style={{ borderColor: currentTheme.accentColor }}>
              {availableThemes.map((t) => (
                <motion.button
                  key={t}
                  onClick={() => switchTheme(t)}
                  className={`px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold capitalize transition-all whitespace-nowrap`}
                  style={{
                    backgroundColor: theme === t ? currentTheme.accentColor : 'transparent',
                    color: theme === t ? currentTheme.primaryColor : currentTheme.textColor,
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t === 'dark' ? '🌙' : '☀️'} <span className="hidden sm:inline">{t}</span>
                </motion.button>
              ))}
            </div>

            {/* RSVP Button - Highlighted */}
            <motion.a
              href="/rsvp"
              className="px-4 lg:px-6 py-2 rounded-lg font-semibold flex items-center gap-2 text-sm lg:text-base whitespace-nowrap"
              style={{
                backgroundColor: currentTheme.accentColor,
                color: currentTheme.primaryColor,
                boxShadow: `0 4px 15px ${currentTheme.accentColor}66`,
              }}
              whileHover={{ scale: 1.05, boxShadow: `0 8px 25px ${currentTheme.accentColor}99` }}
              whileTap={{ scale: 0.95 }}
            >
              ✉️ <span className="hidden sm:inline">RSVP</span>
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg flex-shrink-0 ml-2"
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
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            className="md:hidden pb-4 space-y-2 max-h-96 overflow-y-auto"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
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
            ))}
            
            {/* Mobile Theme Selector */}
            <div className="px-4 py-3 border-t" style={{ borderColor: `${currentTheme.accentColor}33` }}>
              <p className="text-xs font-semibold mb-2" style={{ color: currentTheme.textColor, opacity: 0.7 }}>Theme:</p>
              <div className="flex gap-2">
                {availableThemes.map((t) => (
                  <motion.button
                    key={t}
                    onClick={() => {
                      switchTheme(t);
                      setIsOpen(false);
                    }}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all`}
                    style={{
                      backgroundColor: theme === t ? currentTheme.accentColor : `${currentTheme.accentColor}33`,
                      color: theme === t ? currentTheme.primaryColor : currentTheme.textColor,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t === 'dark' ? '🌙' : '☀️'} {t}
                  </motion.button>
                ))}
              </div>
            </div>

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
        )}
      </div>
    </motion.nav>
  );
};

export default Navigation;
