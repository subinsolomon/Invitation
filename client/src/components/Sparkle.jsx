import React from 'react';
import { motion } from 'framer-motion';

export const Sparkle = ({ children, className = '' }) => {
  const sparkles = Array.from({ length: 8 });

  const sparkleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: (i) => ({
      scale: [0, 1, 0],
      opacity: [0, 1, 0],
      x: Math.cos((i / 8) * Math.PI * 2) * 100,
      y: Math.sin((i / 8) * Math.PI * 2) * 100,
      transition: {
        duration: 2,
        delay: (i / 8) * 0.3,
        repeat: Infinity,
      },
    }),
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {sparkles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-300 rounded-full"
          style={{
            top: '50%',
            left: '50%',
            marginTop: '-2px',
            marginLeft: '-2px',
          }}
          variants={sparkleVariants}
          initial="initial"
          animate="animate"
          custom={i}
        />
      ))}
      {children}
    </div>
  );
};

export default Sparkle;
