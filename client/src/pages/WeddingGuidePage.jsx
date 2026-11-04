import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { configService } from '../services/api';

const fallbackEvent = {
  weddingDate: '2027-05-08T14:00:00',
  location: 'Chavadiyil Jehoash Gardens, Pooyappally, Kerala, India',
  coordinates: { lat: 8.903304700132821, lng: 76.76278418645106 },
};

const escapeCalendarText = (value) => String(value).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');

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
  { question: 'When is the wedding?', answer: 'Saturday, May 8, 2027. The ceremony begins at 02:00 PM India Standard Time.' },
  { question: 'Where is the celebration?', answer: 'Chavadiyil Jehoash Gardens, Pooyappally, Kerala, India. Use the map links on this page for directions.' },
  { question: 'How do I respond?', answer: 'Please use the RSVP page to let us know whether you can attend, or simply show up.' },
];

export const WeddingGuidePage = () => {
  const { currentTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [event, setEvent] = useState(fallbackEvent);

  useEffect(() => {
    let active = true;
    configService.getConfig()
      .then((config) => {
        if (active) setEvent({ ...fallbackEvent, ...config, coordinates: config.coordinates || fallbackEvent.coordinates });
      })
      .catch((error) => console.error('Failed to load ceremony details:', error));
    return () => { active = false; };
  }, []);

  const coordinates = event.coordinates;
  const mapUrl = coordinates?.lat && coordinates?.lng
    ? `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
  const directionsUrl = coordinates?.lat && coordinates?.lng
    ? `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.location)}`;

  return (
    <motion.main
      className="min-h-[calc(100vh-5rem)] px-4 pb-14 pt-8 sm:px-6 sm:pt-12"
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0.15 : 0.42 }}
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-3">The day, at a glance</p>
            <h1 className="font-serif text-4xl font-semibold sm:text-5xl" style={{ color: currentTheme.accentColor }}>
              Ceremony details
            </h1>
            <p className="mt-3 text-white/65">Sajini weds Subin · Saturday, May 8, 2027</p>
          </div>
          <button
            type="button"
            onClick={() => downloadCalendarInvite(event)}
            className="inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-lg border border-sky-300/30 bg-sky-300/10 px-5 text-sm font-semibold text-sky-100 transition-colors hover:bg-sky-300/20 sm:self-auto"
          >
            <span aria-hidden="true">&#8595;</span> Add to calendar
          </button>
        </header>

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <section aria-labelledby="schedule-title">
            <p className="eyebrow mb-2">Schedule</p>
            <h2 id="schedule-title" className="mb-5 font-serif text-2xl text-white">Saturday, May 8</h2>
            <ol className="border-l border-sky-300/25 pl-5">
              <li className="relative pb-7">
                <span className="absolute -left-[1.57rem] top-1 h-3 w-3 rounded-full border-2 border-sky-200 bg-slate-950" />
                <p className="text-sm font-semibold text-sky-200">02:00 PM</p>
                <h3 className="mt-1 text-lg font-medium text-white">Wedding ceremony</h3>
                <p className="mt-1 text-sm text-white/55">Chavadiyil Jehoash Gardens</p>
              </li>
            </ol>

            <div className="mt-9 flex flex-wrap gap-3">
              <a href={directionsUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-semibold text-slate-950" style={{ backgroundColor: currentTheme.accentColor }}>
                Get directions <span className="ml-2" aria-hidden="true">&#8599;</span>
              </a>
              <a href={mapUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-lg border border-white/15 px-4 text-sm font-medium text-white/80 hover:bg-white/5">
                Open map
              </a>
            </div>
          </section>

          <section aria-labelledby="travel-title" className="border-t border-white/10 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="eyebrow mb-2">Getting there</p>
            <h2 id="travel-title" className="font-serif text-2xl text-white">Venue &amp; travel</h2>
            <p className="mt-4 text-lg text-white">Chavadiyil Jehoash Gardens</p>
            <p className="mt-1 text-sm leading-6 text-white/60">Pooyappally, Kerala, India</p>
            <iframe
              title="Map to Chavadiyil Jehoash Gardens"
              className="mt-6 h-64 w-full rounded-xl border border-white/10 bg-slate-900"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={coordinates?.lat && coordinates?.lng
                ? `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&output=embed`
                : `https://www.google.com/maps?q=${encodeURIComponent(event.location)}&output=embed`}
            />
          </section>
        </div>

        <section className="mt-14 border-t border-white/10 pt-8" aria-labelledby="faq-title">
          <p className="eyebrow mb-2">Helpful details</p>
          <h2 id="faq-title" className="mb-5 font-serif text-2xl text-white">Frequently asked questions</h2>
          <div className="divide-y divide-white/10">
            {faqs.map((item) => (
              <details key={item.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-white marker:hidden">
                  {item.question}
                  <span className="text-lg text-sky-200 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="max-w-3xl pt-3 text-sm leading-6 text-white/60">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </motion.main>
  );
};

export default WeddingGuidePage;