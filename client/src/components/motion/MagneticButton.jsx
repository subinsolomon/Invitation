import React, { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

/**
 * Wraps any element in a subtle magnetic pull toward the pointer.
 *
 * The pull is capped at a few pixels: enough to feel responsive and premium,
 * never enough to displace the layout or fight the user's cursor.
 */
const MAX_PULL = 6;

export const MagneticButton = ({ children, strength = 0.28, className = '', disabled = false }) => {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 240, damping: 22, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 240, damping: 22, mass: 0.6 });

  const isInactive = disabled || prefersReducedMotion;

  const handleMove = (event) => {
    if (isInactive || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = (event.clientX - (rect.left + rect.width / 2)) * strength;
    const offsetY = (event.clientY - (rect.top + rect.height / 2)) * strength;
    rawX.set(Math.max(-MAX_PULL, Math.min(MAX_PULL, offsetX)));
    rawY.set(Math.max(-MAX_PULL, Math.min(MAX_PULL, offsetY)));
  };

  const handleLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`inline-flex ${className}`}
      style={isInactive ? undefined : { x, y }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      whileTap={isInactive ? undefined : { scale: 0.975 }}
      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
    >
      {children}
    </motion.div>
  );
};

export default MagneticButton;
