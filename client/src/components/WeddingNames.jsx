import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_SWIFT } from '../lib/motion';

/**
 * The couple's names.
 *
 * Motion: each letter rises from behind its own clipping edge, staggered from
 * the outside in. No shimmer, no sparkles — the effect is purely typographic
 * and settles in under a second.
 */
const NameLine = ({ text, isVisible, delay = 0, className = '' }) => {
  const prefersReducedMotion = useReducedMotion();
  const letters = [...text];

  const step = prefersReducedMotion ? 0 : 0.055;
  const travel = prefersReducedMotion ? 0 : 105;

  return (
    <>
      <span className="sr-only">{text}</span>
      <span
        aria-hidden="true"
        className={`inline-flex flex-wrap justify-center whitespace-nowrap ${className}`}
      >
        {letters.map((letter, index) => (
          <span key={`${letter}-${index}`} className="inline-block overflow-hidden pb-[0.06em]">
            <motion.span
              className="inline-block will-change-transform"
              initial={{ y: `${travel}%`, opacity: prefersReducedMotion ? 0 : 1 }}
              animate={isVisible ? { y: '0%', opacity: 1 } : { y: `${travel}%`, opacity: prefersReducedMotion ? 0 : 1 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.95,
                delay: prefersReducedMotion ? 0 : delay + index * step,
                ease: EASE_SWIFT,
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          </span>
        ))}
      </span>
    </>
  );
};

export const WeddingNames = ({ brideName = 'Bride', groomName = 'Groom', isVisible = true }) => {
  const prefersReducedMotion = useReducedMotion();
  const ruleDelay = prefersReducedMotion ? 0 : 0.75;

  const ruleMotion = {
    initial: { scaleX: 0 },
    animate: isVisible ? { scaleX: 1 } : { scaleX: 0 },
    transition: { duration: prefersReducedMotion ? 0 : 1.1, delay: ruleDelay, ease: EASE_SWIFT },
  };

  return (
    <div className="group flex flex-col items-center text-center">
      <h1 className="display text-[clamp(2.75rem,10vw,6.5rem)] leading-[0.92]">
        <span className="block text-ink-50 transition-[letter-spacing] duration-700 ease-swift group-hover:tracking-[0.015em]">
          <NameLine text={brideName} isVisible={isVisible} delay={0.1} />
        </span>

        <span className="my-[0.18em] flex items-center justify-center gap-4 sm:gap-6" aria-hidden="true">
          <motion.span
            className="h-px w-10 origin-right bg-gradient-to-l from-gold-300/70 to-transparent sm:w-16"
            {...ruleMotion}
          />
          <motion.span
            className="script text-[0.32em] leading-none tracking-[0.08em] text-gold-200"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: prefersReducedMotion ? 0 : 0.6, ease: EASE_SWIFT }}
          >
            weds
          </motion.span>
          <motion.span
            className="h-px w-10 origin-left bg-gradient-to-r from-gold-300/70 to-transparent sm:w-16"
            {...ruleMotion}
          />
        </span>

        <span className="block text-ink-50 transition-[letter-spacing] duration-700 ease-swift group-hover:tracking-[0.015em]">
          <NameLine text={groomName} isVisible={isVisible} delay={0.34} />
        </span>
      </h1>
    </div>
  );
};

export default WeddingNames;
