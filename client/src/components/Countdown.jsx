import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCountdown } from '../hooks/useCountdown';
import { EASE_SWIFT } from '../lib/motion';

/**
 * Countdown with flip-style digits.
 *
 * Each digit block cross-fades and rotates about its own X axis when its value
 * changes, which reads like a split-flap board without any spinning sparkle.
 */
const UNIT_LAYOUT = [
  { key: 'days', label: 'Days', pad: 2 },
  { key: 'hours', label: 'Hours', pad: 2 },
  { key: 'minutes', label: 'Minutes', pad: 2 },
  { key: 'seconds', label: 'Seconds', pad: 2 },
];

const FlipValue = ({ value, prefersReducedMotion }) => (
  <span className="relative flex h-[1.05em] w-full items-center justify-center overflow-hidden">
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={value}
        className="tnum absolute inline-flex items-center justify-center"
        initial={
          prefersReducedMotion
            ? { opacity: 0 }
            : { rotateX: -72, y: '42%', opacity: 0, filter: 'blur(4px)' }
        }
        animate={{ rotateX: 0, y: '0%', opacity: 1, filter: 'blur(0px)' }}
        exit={
          prefersReducedMotion
            ? { opacity: 0 }
            : { rotateX: 72, y: '-42%', opacity: 0, filter: 'blur(4px)' }
        }
        transition={{ duration: prefersReducedMotion ? 0 : 0.42, ease: EASE_SWIFT }}
        style={{ transformPerspective: 520 }}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  </span>
);

export const Countdown = ({ weddingDate }) => {
  const { timeLeft, isExpired } = useCountdown(weddingDate);
  const prefersReducedMotion = useReducedMotion();

  if (isExpired) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <span className="eyebrow">The day is here</span>
        <p className="script text-3xl text-gold-200 sm:text-4xl">Today we celebrate</p>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-4 items-stretch">
      {UNIT_LAYOUT.map((unit, index) => (
        <div
          key={unit.key}
          className={`flex flex-col items-center px-2 sm:px-3 ${
            index === 0 ? '' : 'border-l border-ink-100/10'
          }`}
        >
          <span className="w-full text-center font-serif text-[clamp(1.75rem,5.4vw,2.6rem)] leading-none text-ink-50">
            <FlipValue
              value={String(timeLeft[unit.key]).padStart(unit.pad, '0')}
              prefersReducedMotion={prefersReducedMotion}
            />
          </span>
          <span className="mt-3 text-[0.6rem] font-semibold uppercase tracking-label text-ink-400 sm:text-[0.65rem]">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
