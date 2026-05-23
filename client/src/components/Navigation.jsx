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

  return (
    <motion.nav
      className="sticky top-0 z-50 backdrop-blur-sm"
      style={{
        backgroundColor: `${currentTheme.primaryColor}dd`,
        borderBottom: `2px solid ${currentTheme.accentColor}`,
      }}
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-serif font-bold"
            style={{ color: currentTheme.accentColor }}
          >
            💒 Our Wedding
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <motion.div variants={linkVariants} whileHover="hover">
              <Link
                to="/"
                style={{
                  color: isActive('/') ? currentTheme.accentColor : currentTheme.textColor,
                  textDecoration: isActive('/') ? 'underline' : 'none',
                }}
              >
                Home
              </Link>
            </motion.div>
            <motion.div variants={linkVariants} whileHover="hover">
              <Link
                to="/ceremony"
                style={{
                  color: isActive('/ceremony') ? currentTheme.accentColor : currentTheme.textColor,
                  textDecoration: isActive('/ceremony') ? 'underline' : 'none',
                }}
              >
                Ceremony
              </Link>
            </motion.div>
            <motion.div variants={linkVariants} whileHover="hover">
              <Link
                to="/rsvp"
                className="px-6 py-2 rounded-lg font-semibold"
                style={{
                  backgroundColor: currentTheme.accentColor,
                  color: currentTheme.primaryColor,
                }}
              >
                RSVP
              </Link>
            </motion.div>

            {/* Theme Selector */}
            <div className="flex gap-2">
              {availableThemes.map((t) => (
                <button
                  key={t}
                  onClick={() => switchTheme(t)}
                  className={`px-3 py-1 rounded text-sm capitalize ${
                    theme === t ? 'opacity-100' : 'opacity-50 hover:opacity-75'
                  }`}
                  style={{
                    backgroundColor: theme === t ? currentTheme.accentColor : 'transparent',
                    color: theme === t ? currentTheme.primaryColor : currentTheme.textColor,
                    border: `1px solid ${currentTheme.accentColor}`,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
            style={{ color: currentTheme.textColor }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            className="md:hidden pb-4 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Link to="/" className="block px-4 py-2" style={{ color: currentTheme.textColor }}>
              Home
            </Link>
            <Link to="/ceremony" className="block px-4 py-2" style={{ color: currentTheme.textColor }}>
              Ceremony
            </Link>
            <Link
              to="/rsvp"
              className="block px-4 py-2 rounded font-semibold"
              style={{
                backgroundColor: currentTheme.accentColor,
                color: currentTheme.primaryColor,
              }}
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
