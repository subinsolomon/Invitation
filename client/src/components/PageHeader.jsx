import React from 'react';
import Reveal from './motion/Reveal';

/**
 * Shared page masthead: eyebrow, oversized serif title, lede and an optional
 * actions slot. Keeps every route's opening rhythm identical.
 */
export const PageHeader = ({ eyebrow, title, accent, lede, actions, children }) => (
  <header className="relative border-b border-ink-100/10 pb-10 pt-10 sm:pb-14 sm:pt-16">
    <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <Reveal variant="fade">
            <p className="eyebrow mb-5">{eyebrow}</p>
          </Reveal>
        )}

        <Reveal>
          <h1 className="display text-[clamp(2.5rem,7vw,4.75rem)] text-ink-50">
            {title}
            {accent && <span className="script ml-3 text-gold-200">{accent}</span>}
          </h1>
        </Reveal>

        {lede && (
          <Reveal variant="fade" delay={0.12}>
            <p className="lede mt-5">{lede}</p>
          </Reveal>
        )}

        {children}
      </div>

      {actions && (
        <Reveal variant="fade" delay={0.18}>
          <div className="flex flex-wrap items-center gap-3">{actions}</div>
        </Reveal>
      )}
    </div>
  </header>
);

export default PageHeader;
