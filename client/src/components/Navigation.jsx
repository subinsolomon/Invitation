import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'framer-motion';
import { feedbackService, rsvpService, shareMemoriesService } from '../services/api';
import { EASE_SWIFT } from '../lib/motion';

const STATIC_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/ceremony', label: 'Ceremony' },
  { path: '/gallery', label: 'Our Moments' },
  { path: '/guest-photos', label: 'Event Memories' },
];

const FEEDBACK_CHECK_INTERVAL = 3000;

export const Navigation = () => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeedbackEnabled, setIsFeedbackEnabled] = useState(false);
  const [isRSVPEnabled, setIsRSVPEnabled] = useState(false);
  const [isMemorySharingEnabled, setIsMemorySharingEnabled] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 18);
  });

  useEffect(() => {
    let active = true;

    const checkFeedbackStatus = async () => {
      const [feedbackResult, rsvpResult, memorySharingResult] = await Promise.allSettled([
        feedbackService.getStatus(),
        rsvpService.getStatus(),
        shareMemoriesService.getStatus(),
      ]);
      if (!active) return;
      setIsFeedbackEnabled(feedbackResult.status === 'fulfilled' && Boolean(feedbackResult.value.enabled));
      setIsRSVPEnabled(rsvpResult.status === 'fulfilled' && Boolean(rsvpResult.value.enabled));
      setIsMemorySharingEnabled(memorySharingResult.status === 'fulfilled' && Boolean(memorySharingResult.value.enabled));
    };

    checkFeedbackStatus();
    const intervalId = window.setInterval(checkFeedbackStatus, FEEDBACK_CHECK_INTERVAL);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  // Close the mobile sheet whenever the route changes.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const links = [
    ...STATIC_LINKS,
    ...(isMemorySharingEnabled ? [{ path: '/share-memories', label: 'Share Your Memories' }] : []),
    ...(isRSVPEnabled ? [{ path: '/rsvp', label: 'RSVP' }] : []),
    ...(isFeedbackEnabled ? [{ path: '/feedback', label: 'Feedback' }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50">
      <motion.div
        className="border-b transition-colors duration-500 ease-swift"
        animate={{
          backgroundColor: isScrolled ? 'rgba(12, 10, 8, 0.82)' : 'rgba(12, 10, 8, 0)',
          borderBottomColor: isScrolled ? 'rgba(242, 235, 225, 0.1)' : 'rgba(242, 235, 225, 0)',
          backdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)',
        }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: EASE_SWIFT }}
      >
        <nav className="shell flex items-center justify-between gap-4" aria-label="Main">
          <motion.div
            animate={{ height: isScrolled ? '4rem' : '5rem' }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: EASE_SWIFT }}
            className="flex flex-1 items-center justify-between gap-4"
          >
            <Link to="/" className="group flex items-center gap-3" aria-label="Sajini and Subin — home">
              <motion.span
                className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold-300/40 bg-gold-300/[0.07]"
                whileHover={prefersReducedMotion ? undefined : { scale: 1.06, rotate: -5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <span className="font-serif text-[0.9rem] leading-none tracking-tight text-gold-200">
                  S<span className="mx-[1px] text-[0.7rem] text-ink-300/70">&</span>S
                </span>
                <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-gold-200/10 transition-colors duration-500 group-hover:ring-gold-200/30" />
              </motion.span>

              <span className="hidden flex-col leading-none sm:flex md:hidden lg:flex">
                <span className="font-serif text-[1.05rem] leading-none text-ink-50">
                  Sajini <span className="text-gold-300">&</span> Subin
                </span>
                <span className="mt-1.5 text-[0.58rem] font-semibold uppercase tracking-label text-ink-400">
                  May 8, 2027 · Kerala
                </span>
              </span>
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              {links.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    aria-current={active ? 'page' : undefined}
                    className={`group relative rounded-full px-3 py-2 text-[0.8125rem] font-medium transition-colors duration-300 ease-swift ${
                      active ? 'text-ink-50' : 'text-ink-400 hover:text-ink-100'
                    }`}
                  >
                    <span className="relative z-10">{link.label}</span>
                    {active && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-full border border-gold-300/20 bg-gold-300/[0.08]"
                        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                      />
                    )}
                    <span
                      className={`pointer-events-none absolute inset-x-3 bottom-1 h-px origin-left bg-gold-300/70 transition-transform duration-500 ease-swift ${
                        active ? 'scale-x-0' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              {isRSVPEnabled && (
                <Link to="/rsvp" className="btn btn-primary hidden sm:inline-flex">
                  RSVP
                  <svg className="arrow h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M4 12 12 4M12 4H5.5M12 4v6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              )}

              <button
                type="button"
                onClick={() => setIsMenuOpen((open) => !open)}
                className="grid h-11 w-11 place-items-center rounded-full border border-ink-100/12 text-ink-100 transition-colors duration-300 hover:border-gold-300/35 hover:text-gold-100 md:hidden"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-nav"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <span className="relative block h-3.5 w-5">
                  <motion.span
                    className="absolute left-0 block h-px w-full bg-current"
                    animate={isMenuOpen ? { top: '50%', rotate: 45 } : { top: 0, rotate: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: EASE_SWIFT }}
                  />
                  <motion.span
                    className="absolute left-0 top-1/2 block h-px w-full -translate-y-1/2 bg-current"
                    animate={{ opacity: isMenuOpen ? 0 : 1, scaleX: isMenuOpen ? 0.4 : 1 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
                  />
                  <motion.span
                    className="absolute left-0 block h-px w-full bg-current"
                    animate={isMenuOpen ? { bottom: '50%', rotate: -45 } : { bottom: 0, rotate: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: EASE_SWIFT }}
                  />
                </span>
              </button>
            </div>
          </motion.div>
        </nav>
      </motion.div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-nav"
            className="overflow-hidden border-b border-ink-100/10 bg-ink-950/95 backdrop-blur-xl md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.42, ease: EASE_SWIFT }}
          >
            <div className="shell flex flex-col gap-1 py-5">
              {links.map((link, index) => {
                const active = isActive(link.path);
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.4,
                      delay: prefersReducedMotion ? 0 : 0.05 + index * 0.045,
                      ease: EASE_SWIFT,
                    }}
                  >
                    <Link
                      to={link.path}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center justify-between rounded-xl px-3 py-3 text-base transition-colors duration-300 ${
                        active ? 'bg-gold-300/[0.08] text-gold-100' : 'text-ink-200 hover:bg-ink-100/[0.05]'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="font-mono text-[0.6rem] tracking-widest text-ink-500">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {link.label}
                      </span>
                      {active && <span className="h-1.5 w-1.5 rounded-full bg-gold-300" />}
                    </Link>
                  </motion.div>
                );
              })}

              {isRSVPEnabled && (
                <div className="mt-3 border-t border-ink-100/10 pt-4">
                  <Link to="/rsvp" className="btn btn-primary w-full">
                    Reserve your seat
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;
