import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/motion/Reveal';
import SpotlightCard from '../components/motion/SpotlightCard';
import { configService } from '../services/api';
import { EASE_SWIFT } from '../lib/motion';
import { useWeddingPhase } from '../context/WeddingPhaseContext';

const fallbackEvent = {
    answer: 'Please use the RSVP page to let us know whether you can attend, or simply show up on the day.',
};

const escapeCalendarText = (value) =>
  String(value).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');

const calendarDateInKerala = (value) => {
  const rawValue = String(value);
  const localDate = rawValue.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (localDate && !/(?:Z|[+-]\d{2}:?\d{2})$/i.test(rawValue)) {
    const [, year, month, day, hour, minute, second = '00'] = localDate;
    return `${year}${month}${day}T${hour}${minute}${second}`;
  }

  const date = new Date(value);
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value: partValue }) => [type, partValue]));
  return `${values.year}${values.month}${values.day}T${values.hour}${values.minute}${values.second}`;
};

const downloadCalendarInvite = (event) => {
  const start = calendarDateInKerala(event.weddingDate);
  const location = escapeCalendarText(event.location);
  const content = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sajini and Subin//Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:sajini-subin-wedding-20270508@invitation',
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
    `DTSTART;TZID=Asia/Kolkata:${start}`,
    'SUMMARY:Sajini weds Subin',
    `LOCATION:${location}`,
    'DESCRIPTION:Wedding ceremony at 2:00 PM.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sajini-subin-wedding.ics';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const faqs = [
  {
    question: 'When is the wedding?',
    answer: 'Saturday, May 8, 2027. The ceremony begins at 02:00 PM India Standard Time.',
  },
  {
    question: 'Where is the celebration?',
    answer:
      'Chavadiyil Jehoash Gardens, Pooyappally, Kerala, India. Use the map links on this page for directions.',
  },
  {
    question: 'How do I respond?',
    answer:
      'Please use the RSVP page to let us know whether you can attend, or simply show up on the day.',
  },
];

const FaqItem = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(index === 0);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="border-b border-ink-100/10">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors duration-300 hover:text-gold-100"
      >
        <span className="flex items-baseline gap-4">
          <span className="font-mono text-[0.6rem] tracking-[0.28em] text-ink-500">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-lg text-ink-100">{question}</span>
        </span>
        <motion.span
          className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full border border-ink-100/15 text-gold-200"
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: EASE_SWIFT }}
          aria-hidden="true"
        >
          <span className="absolute h-px w-3 bg-current" />
          <span className="absolute h-3 w-px bg-current" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: EASE_SWIFT }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-6 pl-10 text-sm leading-relaxed text-ink-300">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const WeddingGuidePage = () => {
  const { weddingPhase } = useWeddingPhase();
  const isAfterWedding = weddingPhase === 'after';
  const phaseFaqs = faqs.map((item) => item.question === 'How do I respond?'
    ? {
        ...item,
        answer: isAfterWedding
          ? 'The celebration has passed. Thank you for being part of it — revisit Our Moments and Event Memories to relive the day.'
          : item.answer,
      }
    : item);
  const [event, setEvent] = useState(fallbackEvent);

  useEffect(() => {
    let active = true;
    configService
      .getConfig()
      .then((config) => {
        if (active) {
          setEvent({ ...fallbackEvent, ...config, coordinates: config.coordinates || fallbackEvent.coordinates });
        }
      })
      .catch((error) => console.error('Failed to load ceremony details:', error));
    return () => {
      active = false;
    };
  }, []);

  const coordinates = event.coordinates;
  const mapUrl =
    coordinates?.lat && coordinates?.lng
      ? `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
  const directionsUrl =
    coordinates?.lat && coordinates?.lng
      ? `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`
      : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.location)}`;
  const mapEmbedSrc =
    coordinates?.lat && coordinates?.lng
      ? `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&output=embed`
      : `https://www.google.com/maps?q=${encodeURIComponent(event.location)}&output=embed`;

  return (
    <div className="shell pb-24">
      <PageHeader
        eyebrow={isAfterWedding ? 'A day to remember' : 'The day, at a glance'}
        title={isAfterWedding ? 'Our wedding' : 'Ceremony'}
        accent={isAfterWedding ? 'day' : 'details'}
        lede={isAfterWedding
          ? 'Thank you for sharing May 8, 2027 with us. We are grateful for every moment we spent together.'
          : 'Sajini weds Subin on Saturday, May 8, 2027 at Chavadiyil Jehoash Gardens, Pooyappally. Here is everything you need to arrive calmly and on time.'}
        actions={!isAfterWedding && (
          <button type="button" onClick={() => downloadCalendarInvite(event)} className="btn btn-primary">
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2v8m0 0 3-3m-3 3L5 7M3 12.5h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Add to calendar
          </button>
        )}
      />

      <div className="mt-14 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <section aria-labelledby="schedule-title">
          <Reveal variant="fade">
            <p className="eyebrow mb-3">Schedule</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 id="schedule-title" className="display text-3xl text-ink-50">
              {isAfterWedding ? 'The day we shared' : 'Saturday, May 8'}
            </h2>
          </Reveal>

          <div className="mt-9">
            <Reveal delay={0.12} variant="fade">
              <div className="relative pl-8">
                <span className="absolute left-[0.28rem] top-2 h-full w-px bg-gradient-to-b from-gold-300/60 via-ink-100/20 to-transparent" aria-hidden="true" />
                <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full border border-gold-300 bg-ink-950 shadow-[0_0_14px_rgba(227,192,122,0.45)]" aria-hidden="true" />

                <p className="font-mono text-xs tracking-[0.24em] text-gold-300">14:00 IST</p>
                <h3 className="mt-2 text-2xl text-ink-50">Wedding ceremony</h3>
                <p className="mt-1 text-sm text-ink-300">Chavadiyil Jehoash Gardens</p>

                {isAfterWedding && (
                  <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-400">
                    Thank you to everyone who joined us and made this day so meaningful.
                  </p>
                )}
              </div>
            </Reveal>
          </div>

          <Reveal variant="fade" delay={0.18}>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href={directionsUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                Get directions
                <svg className="arrow h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M4 12 12 4M12 4H5.5M12 4v6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href={mapUrl} target="_blank" rel="noreferrer" className="btn btn-ghost">
                Open map
              </a>
            </div>
          </Reveal>
        </section>

        <section aria-labelledby="venue-title">
          <Reveal variant="fade">
            <p className="eyebrow mb-3">Getting there</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 id="venue-title" className="display text-3xl text-ink-50">
              Venue & travel
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <SpotlightCard className="mt-8 overflow-hidden p-0" lift={false}>
              <div className="p-6 sm:p-7">
                <p className="font-serif text-2xl text-ink-50">Chavadiyil Jehoash Gardens</p>
                <p className="mt-1.5 text-sm text-ink-300">Pooyappally, Kollam, Kerala, India</p>
              </div>
              <iframe
                title="Map to Chavadiyil Jehoash Gardens"
                className="h-64 w-full border-t border-ink-100/10 grayscale-[0.35] contrast-[0.95] sm:h-72"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={mapEmbedSrc}
              />
            </SpotlightCard>
          </Reveal>

          <Reveal variant="fade" delay={0.2}>
            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-ink-100/10 pt-6 text-sm">
              <div>
                <dt className="text-[0.6rem] font-semibold uppercase tracking-label text-ink-500">{isAfterWedding ? 'Ceremony' : 'Arrive by'}</dt>
                <dd className="mt-1.5 text-ink-100">{isAfterWedding ? '2:00 PM IST' : '1:30 PM'}</dd>
              </div>
              <div>
                <dt className="text-[0.6rem] font-semibold uppercase tracking-label text-ink-500">Wedding date</dt>
                <dd className="mt-1.5 text-ink-100">May 8, 2027</dd>
              </div>
            </dl>
          </Reveal>
        </section>
      </div>

      <section className="mt-16 border-t border-ink-100/10 pt-10" aria-labelledby="faq-title">
        <Reveal variant="fade">
          <p className="eyebrow mb-3">Helpful details</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 id="faq-title" className="display mb-6 text-3xl text-ink-50">
            Frequently asked questions
          </h2>
        </Reveal>
        <div>
          {phaseFaqs.map((item, index) => (
            <FaqItem key={item.question} question={item.question} answer={item.answer} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default WeddingGuidePage;
