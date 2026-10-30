import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { configService } from '../services/api';

export const CeremonyPage = () => {
  const { currentTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
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
        staggerChildren: prefersReducedMotion ? 0 : 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: prefersReducedMotion ? 0 : 0,
      transition: { duration: prefersReducedMotion ? 0.2 : 0.65, ease: [0.22, 1, 0.36, 1] },
    },
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center" style={{ backgroundColor: currentTheme.bgColor }}>
        <motion.div
          animate={prefersReducedMotion ? { rotate: 0 } : { rotate: 360 }}
          transition={{ duration: prefersReducedMotion ? 0 : 2, repeat: prefersReducedMotion ? 0 : Infinity }}
          className="w-12 h-12 border-4 rounded-full"
          style={{
            borderColor: currentTheme.accentColor,
            borderRightColor: 'transparent',
          }}
        />
      </div>
    );
  }

  const weddingDate = config?.weddingDate ? new Date(config.weddingDate) : null;

  return (
    <motion.div
      className="min-h-screen px-4 pt-8 pb-8 sm:px-6 sm:pt-12 sm:pb-12"
      style={{ backgroundColor: currentTheme.bgColor }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div variants={itemVariants} className="mb-12 max-w-2xl">
          <p className="eyebrow mb-4">The celebration</p>
          <h1 className="mb-4 text-4xl font-serif font-bold sm:text-6xl" style={{ color: currentTheme.accentColor }}>
            Ceremony Details
          </h1>
          <p className="text-base leading-7 opacity-75 sm:text-lg" style={{ color: currentTheme.textColor }}>
            Join us as we celebrate our love
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Ceremony Info */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="glass-surface rounded-3xl p-6 sm:p-8"
            style={{
              borderColor: `${currentTheme.accentColor}44`,
            }}
          >
            <div className="space-y-6">
              {/* Date & Time */}
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2" style={{ color: currentTheme.accentColor }}>
                  📅 Date & Time
                </h3>
                <p style={{ color: currentTheme.textColor }}>
                  {weddingDate?.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-lg font-semibold" style={{ color: currentTheme.textColor }}>
                  {weddingDate?.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </motion.div>

              {/* Location */}
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2" style={{ color: currentTheme.accentColor }}>
                  📍 Location
                </h3>
                <p style={{ color: currentTheme.textColor }}>
                  {config?.location}
                </p>
              </motion.div>

              {/* Dress Code */}
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2" style={{ color: currentTheme.accentColor }}>
                  👗 Dress Code
                </h3>
                <p style={{ color: currentTheme.textColor }}>
                  Formal / Semi-formal attire requested
                </p>
              </motion.div>

              {/* Contact */}
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2" style={{ color: currentTheme.accentColor }}>
                  📧 Questions?
                </h3>
                <p style={{ color: currentTheme.textColor }}>
                  Feel free to reach out to us with any questions!
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Google Maps Embed */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="glass-surface overflow-hidden rounded-3xl h-96 md:h-auto"
            style={{ minHeight: '400px' }}
            whileHover={prefersReducedMotion ? undefined : { y: -4, borderColor: `${currentTheme.accentColor}99` }}
            transition={{ duration: 0.25 }}
          >
            {config?.coordinates?.lat && config?.coordinates?.lng ? (
              <iframe
                width="100%"
                height="100%"
                style={{ border: 'none', borderRadius: '8px' }}
                loading="lazy"
                allowFullScreen=""
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${config.coordinates.lat},${config.coordinates.lng}&output=embed`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${currentTheme.primaryColor}33` }}>
                <p style={{ color: currentTheme.textColor }}>Map location not configured</p>
              </div>
            )}
          </motion.div>

          {/* Directions Button */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex justify-center"
          >
            {config?.coordinates?.lat && config?.coordinates?.lng && (
              <motion.a
                href={`https://www.google.com/maps/dir/?api=1&destination=${config.coordinates.lat},${config.coordinates.lng}&travelmode=driving`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                style={{
                  backgroundColor: currentTheme.accentColor,
                  color: currentTheme.bgColor,
                }}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.03, y: -2 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
              >
                🚗 Give me directions
              </motion.a>
            )}
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="glass-surface mt-12 rounded-3xl p-8 text-center"
          style={{
            borderColor: `${currentTheme.accentColor}44`,
          }}
          whileHover={prefersReducedMotion ? undefined : { y: -4, borderColor: `${currentTheme.accentColor}99` }}
          transition={{ duration: 0.25 }}
        >
          <h3 className="text-2xl font-serif font-bold mb-4" style={{ color: currentTheme.accentColor }}>
            Reception to Follow
          </h3>
          <p style={{ color: currentTheme.textColor }}>
            Join us for dinner, dancing, and celebration as we share this special day with our loved ones.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CeremonyPage;
