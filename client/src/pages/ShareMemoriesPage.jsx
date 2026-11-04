import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import { shareMemoriesService } from '../services/api';
import { useWeddingPhase } from '../context/WeddingPhaseContext';

export const ShareMemoriesPage = () => {
  const { weddingPhase } = useWeddingPhase();
  const isAfterWedding = weddingPhase === 'after';
  const prefersReducedMotion = useReducedMotion();
  const [sharingEnabled, setSharingEnabled] = useState(null);

  useEffect(() => {
    let active = true;

    const checkStatus = async () => {
      try {
        const status = await shareMemoriesService.getStatus();
        if (active) setSharingEnabled(status.enabled);
      } catch {
        if (active) setSharingEnabled(false);
      }
    };

    checkStatus();
    const intervalId = window.setInterval(checkStatus, 3000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="shell pb-24">
      <PageHeader
        eyebrow="A little more of the day"
        title="Share Your"
        accent="Memories"
        lede={isAfterWedding
          ? 'A place for guests to share their photographs from the day we celebrated together.'
          : 'A place for guests to share their photographs after the celebration.'}
      />

      <motion.section
        className="card mx-auto mt-12 max-w-2xl px-6 py-14 text-center sm:px-10"
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.45 }}
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold-300/30 bg-gold-300/[0.06] text-gold-200" aria-hidden="true">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
            <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v5h14v-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="mt-6 font-serif text-2xl text-ink-50">
          {sharingEnabled === true ? 'Photo sharing is coming soon' : 'Photo sharing is currently unavailable'}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-400">
          {sharingEnabled === true
            ? isAfterWedding
              ? 'We are getting a place ready for you to add your photographs. For now, enjoy Event Memories.'
              : 'We are getting a place ready for you to share your photographs after the wedding.'
            : 'Please check back later for updates.'}
        </p>
      </motion.section>
    </div>
  );
};

export default ShareMemoriesPage;