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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Modern Look */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <motion.div
              className="text-3xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity }}
            >
              💒
            </motion.div>
            <div>
              <motion.h1
                className="text-2xl font-serif font-bold"
                style={{ color: currentTheme.accentColor }}
                whileHover={{ scale: 1.05 }}
              >
                Our Wedding
              </motion.h1>
              <p className="text-xs" style={{ color: currentTheme.textColor }}>
                A celebration of love
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <motion.div key={link.path} variants={linkVariants} whileHover="hover">
                <Link
                  to={link.path}
                  className="px-4 py-2 rounded-lg font-medium transition-all relative group"
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
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Selector - Modern */}
            <div className="flex gap-2 bg-opacity-20 px-3 py-1 rounded-full border" style={{ borderColor: currentTheme.accentColor }}>
              {availableThemes.map((t) => (
                <motion.button
                  key={t}
                  onClick={() => switchTheme(t)}
                  className={`px-3 py-1 rounded-full text-sm font-semibold capitalize transition-all`}
                  style={{
                    backgroundColor: theme === t ? currentTheme.accentColor : 'transparent',
                    color: theme === t ? currentTheme.primaryColor : currentTheme.textColor,
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t === 'dark' ? '🌙' : '☀️'} {t}
                </motion.button>
              ))}
            </div>

            {/* RSVP Button - Highlighted */}
            <motion.a
              href="/rsvp"
              className="px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
              style={{
                backgroundColor: currentTheme.accentColor,
                color: currentTheme.primaryColor,
                boxShadow: `0 4px 15px ${currentTheme.accentColor}66`,
              }}
              whileHover={{ scale: 1.05, boxShadow: `0 8px 25px ${currentTheme.accentColor}99` }}
              whileTap={{ scale: 0.95 }}
            >
              ✉️ RSVP
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg"
            style={{ color: currentTheme.textColor }}
          >
            <motion.svg
              className="w-6 h-6"
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
            className="md:hidden pb-6 space-y-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block px-4 py-3 rounded-lg font-medium"
                style={{
                  backgroundColor: isActive(link.path) ? `${currentTheme.accentColor}33` : 'transparent',
                  color: isActive(link.path) ? currentTheme.accentColor : currentTheme.textColor,
                }}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/rsvp"
              className="block px-4 py-3 rounded-lg font-semibold text-center"
              style={{
                backgroundColor: currentTheme.accentColor,
                color: currentTheme.primaryColor,
              }}
              onClick={() => setIsOpen(false)}
            >
              RSVP
            </Link>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navigation;
