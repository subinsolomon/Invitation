import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_SWIFT, REVEAL_VIEWPORT } from '../../lib/motion';

/**
 * Scroll-triggered entrance.
 *
 * `variant="mask"` slides content up from behind its own clipping edge — a
 * cleaner, more editorial reveal than a bounce or a sparkle.
 */
export const Reveal = ({
  children,
  as = 'div',
  variant = 'mask',
  delay = 0,
  distance = 110,
  className = '',
  style,
  once = true,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const MotionTag = motion[as] || motion.div;
  const viewport = { ...REVEAL_VIEWPORT, once };

  if (variant === 'mask') {
    return (
      <MotionTag
        className={`mask-reveal ${className}`}
        style={style}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <motion.span
          className="block"
          variants={{
            hidden: {
              y: prefersReducedMotion ? '0%' : `${distance}%`,
              opacity: prefersReducedMotion ? 0 : 1,
            },
            visible: {
              y: '0%',
              opacity: 1,
              transition: { duration: prefersReducedMotion ? 0 : 0.85, delay, ease: EASE_SWIFT },
            },
          }}
        >
          {children}
        </motion.span>
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={{
        hidden: {
          opacity: 0,
          y: prefersReducedMotion ? 0 : 22,
          filter: prefersReducedMotion ? 'blur(0px)' : 'blur(7px)',
        },
        visible: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration: prefersReducedMotion ? 0 : 0.7, delay, ease: EASE_SWIFT },
        },
      }}
    >
      {children}
    </MotionTag>
  );
};

export default Reveal;
