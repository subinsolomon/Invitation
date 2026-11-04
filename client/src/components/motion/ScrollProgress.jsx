import React from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

/**
 * Thin gold rail at the very top of the viewport showing reading progress.
 * Purely decorative (aria-hidden) and hidden entirely for reduced motion.
 */
export const ScrollProgress = () => {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 30, restDelta: 0.001 });

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      className="scroll-rail"
      style={{ scaleX: progress }}
      aria-hidden="true"
    />
  );
};

export default ScrollProgress;
