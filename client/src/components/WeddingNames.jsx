import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export const WeddingNames = ({ brideName = 'Bride', groomName = 'Groom' }) => {
  const { currentTheme } = useTheme();

  // Split names into characters for animation
  const brideChars = brideName.split('');
  const groomChars = groomName.split('');

  // Container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  // Character animation variants - modern and smooth
  const charVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: 90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  // Name container with glow effect
  const nameContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        delayChildren: 0.1,
      },
    },
  };

  // Weds text with bounce
  const wedsVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  // Decorative ornament animation
  const decorVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      rotate: -180,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 12,
        duration: 0.6,
      },
    },
  };

  // Separator line animation
  const lineVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: {
        delay: 1.5,
        duration: 1,
        ease: 'easeOut',
      },
    },
  };

  // Floating animation loop
  const floatVariants = {
    hover: {
      y: [-5, 5, -5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-4 xs:gap-6 sm:gap-8 md:gap-10 lg:gap-12 py-8 xs:py-12 sm:py-16 md:py-20 lg:py-24 px-3 xs:px-4"
      initial="hidden"
      animate="visible"
    >
      {/* Bride's Name - Character by Character Animation */}
      <motion.div
        className="flex flex-wrap justify-center"
        variants={nameContainerVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={floatVariants}
      >
        {brideChars.map((char, index) => (
          <motion.span
            key={`bride-${index}`}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold inline-block"
            style={{
              color: currentTheme.accentColor,
              textShadow: `0 10px 30px ${currentTheme.accentColor}40, 0 0 20px ${currentTheme.accentColor}60`,
              letterSpacing: '0.02em',
              perspective: '1000px',
            }}
            variants={charVariants}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.div>

      {/* Decorative Element and Weds Section */}
      <motion.div
        className="flex items-center justify-center gap-2 xs:gap-3 sm:gap-4 md:gap-6 lg:gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Decorative ornament */}
        <motion.div
          variants={decorVariants}
          className="hidden sm:block text-lg sm:text-xl md:text-2xl lg:text-3xl"
          style={{
            color: currentTheme.accentColor,
            filter: `drop-shadow(0 0 10px ${currentTheme.accentColor}40)`,
          }}
        >
          ✨
        </motion.div>

        {/* Weds Text */}
        <motion.span
          className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-script italic font-bold"
          style={{
            color: currentTheme.accentColor,
            textShadow: `0 10px 30px ${currentTheme.accentColor}40, 0 0 20px ${currentTheme.accentColor}60`,
            letterSpacing: '0.05em',
          }}
          variants={wedsVariants}
        >
          weds
        </motion.span>

        {/* Right Decorative ornament */}
        <motion.div
          variants={decorVariants}
          className="hidden sm:block text-lg sm:text-xl md:text-2xl lg:text-3xl"
          style={{
            color: currentTheme.accentColor,
            filter: `drop-shadow(0 0 10px ${currentTheme.accentColor}40)`,
          }}
        >
          ✨
        </motion.div>
      </motion.div>

      {/* Groom's Name - Character by Character Animation */}
      <motion.div
        className="flex flex-wrap justify-center"
        variants={nameContainerVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={floatVariants}
      >
        {groomChars.map((char, index) => (
          <motion.span
            key={`groom-${index}`}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold inline-block"
            style={{
              color: currentTheme.accentColor,
              textShadow: `0 10px 30px ${currentTheme.accentColor}40, 0 0 20px ${currentTheme.accentColor}60`,
              letterSpacing: '0.02em',
              perspective: '1000px',
            }}
            variants={charVariants}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.div>

      {/* Decorative Separator Line */}
      <motion.div
        className="w-16 xs:w-20 sm:w-24 md:w-32 lg:w-40 h-1 rounded-full mt-4 xs:mt-6"
        style={{
          background: `linear-gradient(90deg, transparent, ${currentTheme.accentColor}, transparent)`,
          boxShadow: `0 0 20px ${currentTheme.accentColor}80`,
        }}
        variants={lineVariants}
        initial="hidden"
        animate="visible"
      />
    </motion.div>
  );
};

export default WeddingNames;
