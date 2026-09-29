import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useCountdown } from '../hooks/useCountdown';
import { useTheme } from '../context/ThemeContext';

export const Countdown = ({ weddingDate }) => {
  const { timeLeft, isExpired } = useCountdown(weddingDate);
  const { currentTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (isExpired) {
    return (
      <motion.div
        className="text-center py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p className="text-2xl font-serif" style={{ color: currentTheme.accentColor }}>
          🎉 The wedding is today! 🎉
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
        className="grid w-full grid-cols-4 gap-2 sm:gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hours', value: timeLeft.hours },
          { label: 'Minutes', value: timeLeft.minutes },
          { label: 'Seconds', value: timeLeft.seconds },
        ].map((item) => (
          <motion.div
            key={item.label}
            className="flex min-w-0 flex-col items-center"
            variants={itemVariants}
          >
            <motion.div
              className="flex aspect-square w-full items-center justify-center rounded-2xl border text-2xl font-bold font-serif sm:text-3xl"
              style={{
                backgroundColor: `${currentTheme.accentColor}18`,
                color: currentTheme.accentColor,
                borderColor: `${currentTheme.accentColor}55`,
              }}
            >
              <motion.span
                key={item.value}
                initial={{
                  opacity: 0,
                  y: prefersReducedMotion ? 0 : 12,
                  rotateX: prefersReducedMotion ? 0 : -55,
                }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: 'easeOut' }}
                className="inline-block"
                style={{ transformOrigin: 'center' }}
              >
                {String(item.value).padStart(2, '0')}
              </motion.span>
            </motion.div>
            <p className="mt-2 text-[0.6rem] uppercase tracking-[0.16em] opacity-65 sm:text-xs" style={{ color: currentTheme.textColor }}>
              {item.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
  );
};

export default Countdown;
