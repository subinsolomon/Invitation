import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * A warm light that follows the pointer across the whole page.
 *
 * Runs entirely off CSS variables written inside a rAF tick, so it never
 * triggers React renders. Disabled for reduced motion and coarse pointers.
 */
export const PointerGlow = () => {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef(null);
  const frame = useRef(null);
  const lastPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const isCoarse = window.matchMedia('(hover: none)').matches;
    if (isCoarse) return undefined;

    const node = ref.current;
    if (!node) return undefined;

    const paint = () => {
      frame.current = null;
      const { x, y } = lastPosition.current;
      node.style.setProperty('--pointer-x', `${x}px`);
      node.style.setProperty('--pointer-y', `${y}px`);
      node.dataset.active = 'true';
    };

    const handleMove = (event) => {
      lastPosition.current = { x: event.clientX, y: event.clientY };
      if (frame.current) return;
      frame.current = window.requestAnimationFrame(paint);
    };

    const handleLeave = () => {
      node.dataset.active = 'false';
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerdown', handleMove, { passive: true });
    document.addEventListener('pointerleave', handleLeave);

    return () => {
      if (frame.current) window.cancelAnimationFrame(frame.current);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerdown', handleMove);
      document.removeEventListener('pointerleave', handleLeave);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return <div ref={ref} className="pointer-glow" aria-hidden="true" />;
};

export default PointerGlow;
