import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Countdown from '../components/Countdown';
import Sparkle from '../components/Sparkle';
import WeddingNames from '../components/WeddingNames';
import { configService } from '../services/api';

export const HomePage = () => {
  const { currentTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 700], [0, 110]);
  const heroImageScale = useTransform(scrollY, [0, 700], [1, 1.12]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await configService.getConfig();
        setConfig(data);
      } catch (error) {
        console.error('Failed to fetch config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center" style={{ backgroundColor: currentTheme.bgColor }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 border-4 rounded-full"
          style={{
            borderColor: currentTheme.accentColor,
            borderRightColor: 'transparent',
          }}
        />
      </div>
    );
  }

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundColor: currentTheme.bgColor,
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          y: prefersReducedMotion ? 0 : heroImageY,
          scale: prefersReducedMotion ? 1 : heroImageScale,
          backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/90"
        style={{
          zIndex: 1,
        }}
      />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_20%,transparent,rgba(0,0,0,0.5)_75%)]" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24 lg:py-28">
        <motion.div
          className="grid min-h-[calc(100vh-9rem)] content-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-3xl">
            <motion.div variants={itemVariants} className="eyebrow mb-6">
              An invitation to celebrate
            </motion.div>
            {config && (
              <motion.div variants={itemVariants}>
              <WeddingNames 
                brideName={config.brideName} 
                groomName={config.groomName}
              />
              <p className="max-w-xl text-base leading-8 text-white/75 sm:text-lg">
                Together with our families, we invite you to share an unforgettable day of love, laughter, and new beginnings.
              </p>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link to="/ceremony" className="inline-flex items-center justify-center rounded-full px-7 py-3.5 font-semibold" style={{ backgroundColor: currentTheme.accentColor, color: currentTheme.primaryColor }}>
                Explore the day <span className="ml-3" aria-hidden="true">↗</span>
              </Link>
              <Link to="/rsvp" className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-sm">
                RSVP now
              </Link>
            </motion.div>
          </div>

          <motion.aside variants={itemVariants} className="glass-surface rounded-3xl p-6 text-left text-white sm:p-8">
            <div className="mb-8 flex items-center justify-between border-b border-white/15 pb-5">
              <div>
                <p className="eyebrow">Save the date</p>
                <p className="mt-2 text-sm text-white/60">The countdown begins</p>
              </div>
              <span className="text-3xl" aria-hidden="true">✦</span>
            </div>
            {config && <Countdown weddingDate={config.weddingDate} />}
            <Sparkle>
              <blockquote className="mt-8 border-t border-white/15 pt-6 text-center font-serif text-xl italic leading-8 text-white/85">
                &ldquo;Therefore what God has joined together, let no one separate.&rdquo;
                <footer className="mt-3 font-sans text-xs not-italic uppercase tracking-[0.2em] text-white/55">Mark 10:9</footer>
              </blockquote>
            </Sparkle>
          </motion.aside>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HomePage;
