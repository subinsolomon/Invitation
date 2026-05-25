import React from 'react';
import { motion } from 'framer-motion';
import { useCountdown } from '../hooks/useCountdown';
import { useTheme } from '../context/ThemeContext';

export const Countdown = ({ weddingDate }) => {
  const { timeLeft, isExpired } = useCountdown(weddingDate);
  const { currentTheme } = useTheme();

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
      className="flex justify-center gap-8 py-12"
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
          className="flex flex-col items-center"
          variants={itemVariants}
        >
          <motion.div
            className="text-4xl md:text-5xl font-bold font-serif mb-2 px-4 py-3 rounded-lg"
            style={{
              backgroundColor: currentTheme.primaryColor,
              color: currentTheme.secondaryColor,
              border: `2px solid ${currentTheme.accentColor}`,
            }}
          >
            {String(item.value).padStart(2, '0')}
          </motion.div>
          <p className="text-sm md:text-base uppercase tracking-wider" style={{ color: currentTheme.textColor }}>
            {item.label}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Countdown;
