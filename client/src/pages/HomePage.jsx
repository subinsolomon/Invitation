import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import Countdown from '../components/Countdown';
import WeddingNames from '../components/WeddingNames';
import Reveal from '../components/motion/Reveal';
import Marquee from '../components/motion/Marquee';
import MagneticButton from '../components/motion/MagneticButton';
import SpotlightCard from '../components/motion/SpotlightCard';
import { configService } from '../services/api';
import { useWeddingPhase } from '../context/WeddingPhaseContext';
import { EASE_SWIFT } from '../lib/motion';

const FALLBACK_DATE = '2027-05-08T14:00:00+05:30';

const HERO_IMAGE = "url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&h=1200&fit=crop')";

const BEFORE_RIBBON_ITEMS = [
  'Save the date',
  'May 8, 2027',
  'Chavadiyil Jehoash Gardens',
  'Pooyappally, Kerala',
  'Sajini & Subin',
];

const AFTER_RIBBON_ITEMS = [
  'Thank you for celebrating with us',
  'Sajini & Subin',
  'Our Moments',
  'Event Memories',
  'May 8, 2027',
];

const BEFORE_DETAILS = [
  {
    index: '01',
    title: 'The ceremony',
    body: 'Saturday, May 8, 2027. The service begins at 2:00 PM India Standard Time.',
    link: { to: '/ceremony', label: 'Full schedule' },
  },
  {
    index: '02',
    title: 'The venue',
    body: 'Chavadiyil Jehoash Gardens, Pooyappally, Kollam, Kerala — a garden ceremony.',
    link: { to: '/ceremony', label: 'Open the map' },
  },
  {
    index: '03',
    title: 'Event memories',
    body: 'We will share photographs from the celebration here.',
    link: { to: '/guest-photos', label: 'Event memories' },
  },
];

const AFTER_DETAILS = [
  {
    index: '01',
    title: 'Our wedding day',
    body: 'Thank you for being part of our celebration on May 8, 2027.',
    link: { to: '/ceremony', label: 'Ceremony details' },
  },
  {
    index: '02',
    title: 'Our Moments',
    body: 'Portraits of Sajini, Subin, and close family from the day.',
    link: { to: '/gallery', label: 'View Our Moments' },
  },
  {
    index: '03',
    title: 'Event Memories',
    body: 'Photographs from the celebration, gathered in one place.',
    link: { to: '/guest-photos', label: 'View Event Memories' },
  },
];

const Dot = () => <span className="h-1 w-1 rounded-full bg-gold-300/60" aria-hidden="true" />;

export const HomePage = ({ isIntroComplete = true }) => {
  const { weddingPhase } = useWeddingPhase();
  const isAfterWedding = weddingPhase === 'after';
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const heroShift = useSpring(useTransform(scrollY, [0, 800], [0, 130]), {
    stiffness: 90,
    damping: 26,
    mass: 0.4,
  });
  const heroDim = useTransform(scrollY, [0, 620], [0.62, 0.9]);

  const [weddingDate, setWeddingDate] = useState(FALLBACK_DATE);

  useEffect(() => {
    let active = true;
    configService
      .getConfig()
      .then((config) => {
        if (active && config?.weddingDate) setWeddingDate(config.weddingDate);
      })
      .catch((error) => console.error('Failed to fetch wedding configuration:', error));

    return () => {
      active = false;
    };
  }, []);

  const fadeUp = (delay) => ({
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
    animate: isIntroComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
    transition: { duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : delay, ease: EASE_SWIFT },
  });

  return (
    <div className="relative">
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative isolate -mt-[4.5rem] overflow-hidden pt-[4.5rem] sm:-mt-20 sm:pt-20">
        <motion.div
          className="absolute inset-0 -z-10"
          style={{ y: prefersReducedMotion ? 0 : heroShift }}
          aria-hidden="true"
        >
          <div
            className="h-[118%] w-full bg-cover bg-center"
            style={{ backgroundImage: HERO_IMAGE, backgroundPosition: 'center 38%' }}
          />
        </motion.div>

        <motion.div
          className="absolute inset-0 -z-10 bg-ink-950"
          style={{ opacity: prefersReducedMotion ? 0.72 : heroDim }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/70 via-ink-950/55 to-ink-950"
          aria-hidden="true"
        />

        <div className="shell flex min-h-[calc(100svh-5rem)] flex-col justify-center pb-16 pt-14 sm:pb-20">
          <motion.p {...fadeUp(0.1)} className="eyebrow mb-8 self-center">
            {isAfterWedding ? 'Thank you for celebrating with us' : 'Together with our families'}
          </motion.p>

          <WeddingNames isVisible={isIntroComplete} brideName="Sajini" groomName="Subin" />

          <motion.div
            {...fadeUp(0.85)}
            className="mt-9 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[0.68rem] font-semibold uppercase tracking-label text-ink-300"
          >
            <span>Saturday</span>
            <Dot />
            <span>May 8, 2027</span>
            <Dot />
            <span>2:00 PM IST</span>
            <Dot />
            <span>Kerala, India</span>
          </motion.div>

          {isAfterWedding ? (
            <motion.p {...fadeUp(1)} className="mx-auto mt-12 max-w-lg border-y border-ink-100/12 py-7 text-center font-serif text-2xl text-gold-200 sm:text-3xl">
              A day we will always remember.
            </motion.p>
          ) : (
            <motion.div {...fadeUp(1)} className="mx-auto mt-12 w-full max-w-lg border-y border-ink-100/12 py-7">
              <Countdown weddingDate={weddingDate} />
            </motion.div>
          )}

          <motion.div {...fadeUp(1.15)} className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {isAfterWedding ? (
              <>
                <MagneticButton>
                  <Link to="/gallery" className="btn btn-primary w-full sm:w-auto">Our Moments</Link>
                </MagneticButton>
                <MagneticButton>
                  <Link to="/guest-photos" className="btn btn-ghost w-full sm:w-auto">Event Memories</Link>
                </MagneticButton>
              </>
            ) : (
              <>
                <MagneticButton>
                  <Link to="/ceremony" className="btn btn-primary w-full sm:w-auto">
                    Explore the day
                    <svg className="arrow h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M4 12 12 4M12 4H5.5M12 4v6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link to="/rsvp" className="btn btn-ghost w-full sm:w-auto">Reserve your seat</Link>
                </MagneticButton>
              </>
            )}
          </motion.div>

          <motion.div
            className="mt-16 flex flex-col items-center gap-3 self-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isIntroComplete ? 1 : 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.9, delay: prefersReducedMotion ? 0 : 1.5 }}
            aria-hidden="true"
          >
            <span className="text-[0.55rem] font-semibold uppercase tracking-label text-ink-500">Scroll</span>
            <motion.span
              className="h-10 w-px origin-top bg-gradient-to-b from-gold-300/70 to-transparent"
              animate={prefersReducedMotion ? undefined : { scaleY: [0.3, 1, 0.3] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Ribbon */}
      <div className="relative z-10 border-y border-ink-100/10 bg-ink-950/40 py-3.5">
        <Marquee items={isAfterWedding ? AFTER_RIBBON_ITEMS : BEFORE_RIBBON_ITEMS} />
      </div>

      {/* ------------------------------------------------------------ Details */}
      <section className="section shell" aria-labelledby="details-heading">
        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal variant="fade">
              <p className="eyebrow mb-4">The essentials</p>
            </Reveal>
            <Reveal>
              <h2 id="details-heading" className="display text-[clamp(2rem,5vw,3.4rem)] text-ink-50">
                {isAfterWedding ? 'Memories we made' : 'Everything you need'}
                <span className="block text-ink-400">{isAfterWedding ? 'to keep close.' : 'for the day.'}</span>
              </h2>
            </Reveal>
          </div>
          <Reveal variant="fade" delay={0.15}>
            <p className="lede md:max-w-xs md:text-right">
              {isAfterWedding
                ? 'Thank you for being part of our day. Revisit the ceremony details and photographs.'
                : 'A short guide to when we gather and where to find us.'}
            </p>
          </Reveal>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(isAfterWedding ? AFTER_DETAILS : BEFORE_DETAILS).map((detail, index) => (
            <Reveal key={detail.title} delay={index * 0.1} variant="fade">
              <SpotlightCard className="flex h-full flex-col p-6 sm:p-7">
                <span className="font-mono text-[0.65rem] tracking-[0.3em] text-ink-500">{detail.index}</span>
                <h3 className="mt-6 text-2xl text-ink-50">{detail.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-300">{detail.body}</p>
                <Link
                  to={detail.link.to}
                  className="mt-7 inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-label text-gold-300 transition-colors duration-300 hover:text-gold-100"
                >
                  {detail.link.label}
                  <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M4 12 12 4M12 4H5.5M12 4v6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------- Quote */}
      <section className="relative border-y border-ink-100/10 py-20 sm:py-28">
        <div className="shell flex flex-col items-center text-center">
          <Reveal variant="fade">
            <span className="eyebrow">A word we hold close</span>
          </Reveal>
          <Reveal delay={0.12}>
            <blockquote className="mt-7 max-w-2xl text-[clamp(1.5rem,3.4vw,2.4rem)] leading-[1.35] text-ink-100">
              &ldquo;Therefore what God has joined together,
              <span className="script text-gold-200"> let no one separate.</span>&rdquo;
            </blockquote>
          </Reveal>
          <Reveal variant="fade" delay={0.2}>
            <p className="mt-6 text-[0.65rem] font-semibold uppercase tracking-label text-ink-500">Mark 10:9</p>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- CTA */}
      <section className="section shell">
        <SpotlightCard className="relative overflow-hidden px-6 py-14 text-center sm:px-14 sm:py-20">
          <div
            className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-[radial-gradient(50%_100%_at_50%_100%,rgba(227,192,122,0.16),transparent)]"
            aria-hidden="true"
          />
          <Reveal variant="fade">
            <p className="eyebrow justify-center">{isAfterWedding ? 'With gratitude' : 'One question'}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display mx-auto mt-6 max-w-2xl text-[clamp(2rem,5vw,3.6rem)] text-ink-50">
              {isAfterWedding ? 'Thank you for celebrating with us.' : 'Will you celebrate with us?'}
            </h2>
          </Reveal>
          <Reveal variant="fade" delay={0.18}>
            <p className="lede mx-auto mt-5 text-center">
              {isAfterWedding
                ? 'We are grateful you shared this day with us. We hope these photographs bring it all back.'
                : 'Kindly respond by April 2027 so we can plan the day with you.'}
            </p>
          </Reveal>
          <Reveal variant="fade" delay={0.26}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {isAfterWedding ? (
                <>
                  <MagneticButton><Link to="/gallery" className="btn btn-primary">Our Moments</Link></MagneticButton>
                  <MagneticButton><Link to="/guest-photos" className="btn btn-ghost">Event Memories</Link></MagneticButton>
                </>
              ) : (
                <>
                  <MagneticButton><Link to="/rsvp" className="btn btn-primary">Respond to the invitation</Link></MagneticButton>
                  <MagneticButton><Link to="/guest-photos" className="btn btn-ghost">Event Memories</Link></MagneticButton>
                </>
              )}
            </div>
          </Reveal>
        </SpotlightCard>
      </section>
    </div>
  );
};

export default HomePage;
