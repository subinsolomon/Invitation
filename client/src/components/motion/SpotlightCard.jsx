import React, { useCallback, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Card whose surface catches a warm highlight that tracks the pointer.
 *
 * The light is drawn by the `.spotlight` rule in index.css; this component only
 * writes `--spot-x` / `--spot-y` and adds the lift-on-hover motion.
 */
export const SpotlightCard = ({
  children,
  className = '',
  as = 'div',
  lift = true,
  style,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef(null);
  const frame = useRef(null);
  const MotionTag = motion[as] || motion.div;

  const handlePointerMove = useCallback((event) => {
    const node = ref.current;
    if (!node) return;
    if (frame.current) return;

    const { clientX, clientY } = event;
    frame.current = window.requestAnimationFrame(() => {
      frame.current = null;
      const rect = node.getBoundingClientRect();
      node.style.setProperty('--spot-x', `${clientX - rect.left}px`);
      node.style.setProperty('--spot-y', `${clientY - rect.top}px`);
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (frame.current) {
      window.cancelAnimationFrame(frame.current);
      frame.current = null;
    }
  }, []);

  return (
    <MotionTag
      ref={ref}
      className={`spotlight card-edge ${className}`}
      style={style}
      onPointerMove={prefersReducedMotion ? undefined : handlePointerMove}
      onPointerLeave={handlePointerLeave}
      whileHover={lift && !prefersReducedMotion ? { y: -4 } : undefined}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
};

export default SpotlightCard;
