import React from 'react';

/**
 * Infinite horizontal ribbon.
 *
 * The track is duplicated once and translated by exactly -50%, so the loop is
 * seamless at any width. Pauses on hover (see `.marquee:hover` in index.css)
 * and freezes entirely under prefers-reduced-motion.
 */
export const Marquee = ({ items = [], separator = '·', className = '' }) => {
  if (items.length === 0) return null;

  const sequence = [...items, ...items];

  return (
    <div className={`marquee ${className}`} aria-hidden="true">
      <div className="marquee-track">
        {sequence.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex flex-none items-center gap-6 whitespace-nowrap px-3 font-sans text-[0.6875rem] font-semibold uppercase tracking-label text-ink-400/80"
          >
            {item}
            <span className="text-gold-400/70" aria-hidden="true">
              {separator}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
