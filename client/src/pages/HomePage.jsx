import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Countdown from '../components/Countdown';
import Sparkle from '../components/Sparkle';
import { configService } from '../services/api';

export const HomePage = () => {
  const { currentTheme } = useTheme();
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
      className="min-h-screen"
      style={{
        backgroundColor: currentTheme.bgColor,
        backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: `${currentTheme.primaryColor}99`,
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          className="text-center space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Heading */}
          <motion.div variants={itemVariants}>
            <h1
              className="text-5xl md:text-7xl font-serif font-bold mb-4"
              style={{ color: currentTheme.accentColor }}
            >
              Our Wedding
            </h1>
            <p className="text-xl md:text-2xl" style={{ color: currentTheme.textColor }}>
              A celebration of love and commitment
            </p>
          </motion.div>

          {/* Bible Verse with Sparkles */}
          <motion.div variants={itemVariants}>
            <Sparkle>
              <blockquote className="text-2xl md:text-3xl font-serif italic px-8 py-8 rounded-lg border-2" 
                style={{
                  color: currentTheme.accentColor,
                  borderColor: currentTheme.accentColor,
                  backgroundColor: `${currentTheme.primaryColor}66`,
                }}
              >
                &ldquo;Therefore what God has joined together, let no one separate.&rdquo;
                <footer className="mt-4 text-lg not-italic">— Mark 10:9</footer>
              </blockquote>
            </Sparkle>
          </motion.div>

          {/* Countdown */}
          {config && (
            <motion.div variants={itemVariants}>
              <p className="text-lg mb-6" style={{ color: currentTheme.textColor }}>
                Count down the days until our special day:
              </p>
              <Countdown weddingDate={config.weddingDate} />
            </motion.div>
          )}

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
          >
            <motion.a
              href="/ceremony"
              className="px-8 py-4 rounded-lg font-semibold text-lg"
              style={{
                backgroundColor: currentTheme.accentColor,
                color: currentTheme.primaryColor,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Ceremony Details
            </motion.a>
            <motion.a
              href="/rsvp"
              className="px-8 py-4 rounded-lg font-semibold text-lg border-2"
              style={{
                color: currentTheme.accentColor,
                borderColor: currentTheme.accentColor,
                backgroundColor: 'transparent',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              RSVP Now
            </motion.a>
          </motion.div>

          {/* Decorative Element */}
          <motion.div
            className="text-4xl"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💕
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HomePage;
