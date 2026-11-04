/**
 * Shared motion language.
 *
 * Three rules keep the interface feeling modern rather than busy:
 *  1. Everything moves on the same easing curve and settles quickly.
 *  2. Entrances reveal from behind an edge (mask) or rise a short distance.
 *  3. `prefers-reduced-motion` collapses every distance and duration to zero.
 */

export const EASE_SWIFT = [0.22, 1, 0.36, 1];
export const EASE_EXIT = [0.4, 0, 1, 1];

export const SPRING_SOFT = { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 };
export const SPRING_SNAPPY = { type: 'spring', stiffness: 380, damping: 32 };

/** Duration helper: returns 0 so framer settles instantly when motion is off. */
export const duration = (prefersReducedMotion, value) => (prefersReducedMotion ? 0 : value);

/** Rise-and-fade used for single blocks (cards, headings, rows). */
export function riseVariants(prefersReducedMotion, { distance = 18, delay = 0, blur = true } = {}) {
  if (prefersReducedMotion) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0 } },
    };
  }

  return {
    hidden: {
      opacity: 0,
      y: distance,
      filter: blur ? 'blur(6px)' : 'blur(0px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.72, delay, ease: EASE_SWIFT },
    },
  };
}

/** Parent that staggers its children into view. */
export function staggerVariants(prefersReducedMotion, { stagger = 0.08, delay = 0.06 } = {}) {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : stagger,
        delayChildren: prefersReducedMotion ? 0 : delay,
      },
    },
  };
}

/** Viewport config shared by every scroll reveal. */
export const REVEAL_VIEWPORT = { once: true, amount: 0.25, margin: '0px 0px -10% 0px' };
