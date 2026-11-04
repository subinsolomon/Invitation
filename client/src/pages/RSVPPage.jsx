import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/motion/Reveal';
import { rsvpService } from '../services/api';
import { EASE_SWIFT } from '../lib/motion';
import { useWeddingPhase } from '../context/WeddingPhaseContext';

const ATTENDANCE_OPTIONS = [
  {
    value: 'yes',
    title: 'I will be there',
    hint: 'Joining the celebration',
  },
  {
    value: 'no',
    title: 'I cannot make it',
    hint: 'Sending love from afar',
  },
];

const INITIAL_FORM = { name: '', email: '', phone: '', attendance: '' };

const SuccessBanner = ({ afterWedding }) => (
  <motion.div
    className="mt-8 flex items-start gap-3 rounded-2xl border border-gold-300/30 bg-gold-300/[0.08] px-5 py-4"
    role="status"
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.4, ease: EASE_SWIFT }}
  >
    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold-300 text-ink-950">
      <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="m2.5 6.5 2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
    <div>
      <p className="text-sm font-semibold text-gold-100">Your RSVP has been received</p>
      <p className="mt-1 text-sm text-ink-300">
        {afterWedding ? 'Thank you for sharing the day with us.' : 'Thank you — we cannot wait to celebrate with you.'}
      </p>
    </div>
  </motion.div>
);

export const RSVPPage = () => {
  const { weddingPhase } = useWeddingPhase();
  const isAfterWedding = weddingPhase === 'after';
  const prefersReducedMotion = useReducedMotion();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rsvpEnabled, setRsvpEnabled] = useState(null);
  const [rsvpStatusUnavailable, setRsvpStatusUnavailable] = useState(false);

  useEffect(() => {
    let active = true;
    const checkRSVPStatus = async () => {
      try {
        const status = await rsvpService.getStatus();
        if (active) {
          setRsvpEnabled(status.enabled);
          setRsvpStatusUnavailable(false);
        }
      } catch {
        if (active) {
          setRsvpEnabled(null);
          setRsvpStatusUnavailable(true);
        }
      }
    };

    checkRSVPStatus();
    const intervalId = window.setInterval(checkRSVPStatus, 3000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));

    if (errors[name]) {
      setErrors((previous) => ({ ...previous, [name]: '' }));
    }

    if (name === 'attendance') {
      setErrors({});
      setErrorMessage('');
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (formData.attendance === 'yes') {
      if (!formData.name.trim()) {
        nextErrors.name = 'Name is required';
      } else if (formData.name.trim().length < 2) {
        nextErrors.name = 'Name must be at least 2 characters';
      }

      if (!formData.email.trim()) {
        nextErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        nextErrors.email = 'Please enter a valid email address';
      }

      if (formData.phone && !/^[\d\s\-+()]+$/.test(formData.phone)) {
        nextErrors.phone = 'Please enter a valid phone number';
      }
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);

    try {
      await rsvpService.submitRSVP({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        attendance: formData.attendance === 'yes',
      });

      setSuccess(true);
      setFormData(INITIAL_FORM);
      setErrors({});
      window.setTimeout(() => setSuccess(false), 6000);
    } catch (error) {
      if (error.status === 403) setRsvpEnabled(false);
      if (error.message) {
        setErrorMessage(error.message);
      } else if (error.errors) {
        setErrors(Object.fromEntries(error.errors.map((item) => [item.path, item.msg])));
      } else {
        setErrorMessage('Failed to submit RSVP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isAttending = formData.attendance === 'yes';

  return (
    <div className="shell pb-24">
      <PageHeader
        eyebrow={isAfterWedding ? 'After the celebration' : 'Your seat at the table'}
        title="RSVP"
        lede={isAfterWedding
          ? 'Thank you to everyone who celebrated with us. You can still update your response below.'
          : 'Let us know whether you can join us. If you are coming, a name and an email are all we need — phone is optional.'}
      />

      {rsvpEnabled === true ? (
      <div className="mx-auto mt-12 max-w-2xl">
        <AnimatePresence>{success && <SuccessBanner afterWedding={isAfterWedding} />}</AnimatePresence>

        {errorMessage && (
          <motion.div
            className="mt-8 rounded-2xl border border-clay-400/35 bg-clay-500/10 px-5 py-4 text-sm text-clay-200"
            role="alert"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {errorMessage}
          </motion.div>
        )}

        <Reveal variant="fade" delay={0.1}>
          <form onSubmit={handleSubmit} className="card mt-8 p-6 sm:p-9" noValidate>
            <fieldset>
              <legend className="label">Will you be attending?</legend>

              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {ATTENDANCE_OPTIONS.map((option) => {
                  const selected = formData.attendance === option.value;
                  return (
                    <label
                      key={option.value}
                      htmlFor={option.value}
                      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border p-5 transition-colors duration-300 ease-swift ${
                        selected
                          ? 'border-gold-300/60 bg-gold-300/[0.07]'
                          : 'border-ink-100/12 hover:border-ink-100/25 hover:bg-ink-100/[0.03]'
                      }`}
                    >
                      {selected && (
                        <motion.span
                          layoutId="rsvp-selection"
                          className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-gold-300/40"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}

                      <span className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-3">
                          <input
                            type="radio"
                            id={option.value}
                            name="attendance"
                            value={option.value}
                            checked={selected}
                            onChange={handleChange}
                            className="h-4 w-4 shrink-0 accent-gold-300"
                          />
                          <span className="text-[0.95rem] font-medium text-ink-100">{option.title}</span>
                        </span>
                        <motion.span
                          className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-gold-300/50 text-gold-200"
                          animate={{ opacity: selected ? 1 : 0, scale: selected ? 1 : 0.6 }}
                          transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: EASE_SWIFT }}
                          aria-hidden="true"
                        >
                          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                            <path d="m2.5 6.5 2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </motion.span>
                      </span>
                      <span className="mt-2 pl-7 text-xs uppercase tracking-[0.16em] text-ink-500">
                        {option.hint}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <AnimatePresence initial={false} mode="wait">
              {isAttending && (
                <motion.div
                  key="attending-fields"
                  className="mt-8 space-y-5"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: EASE_SWIFT }}
                >
                  <div>
                    <label htmlFor="name" className="label">
                      Full name
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="field"
                      placeholder="Enter your full name"
                      autoComplete="name"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="field-error">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="label">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="field"
                      placeholder="you@example.com"
                      autoComplete="email"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="field-error">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="label">
                      Phone <span className="normal-case tracking-normal text-ink-500">(optional)</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="field"
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                    />
                    {errors.phone && (
                      <p id="phone-error" className="field-error">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border border-ink-950/40 border-t-ink-950" aria-hidden="true" />
                        Sending your RSVP
                      </>
                    ) : (
                      'Send my RSVP'
                    )}
                  </button>

                  <p className="text-center text-xs text-ink-500">Fields above are required.</p>
                </motion.div>
              )}

              {formData.attendance === 'no' && (
                <motion.div
                  key="declined"
                  className="mt-8 rounded-2xl border border-ink-100/12 bg-ink-100/[0.03] px-5 py-6 text-center"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: EASE_SWIFT }}
                >
                  <p className="font-serif text-xl text-ink-100">We will miss you.</p>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-ink-400">
                    {isAfterWedding
                      ? 'Thank you for letting us know. Browse Our Moments and Event Memories to revisit the day.'
                      : 'Thank you for letting us know. We will share the photographs here after the celebration.'}
                  </p>
                  <Link to="/gallery" className="btn-quiet mt-5">
                    Visit the gallery
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Reveal>

        <Reveal variant="fade" delay={0.16}>
          <div className="mt-8 flex items-center justify-center">
            <Link to="/" className="btn-quiet">
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M12 8H4m0 0 3.5-3.5M4 8l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to home
            </Link>
          </div>
        </Reveal>
      </div>
      ) : (
        <Reveal variant="fade" delay={0.1}>
          <section className="card mx-auto mt-12 max-w-2xl px-6 py-10 text-center" role="status" aria-live="polite">
            <p className="eyebrow mb-3">RSVP</p>
            <h2 className="font-serif text-2xl text-ink-50">
              {rsvpStatusUnavailable
                ? 'RSVPs are temporarily unavailable'
                : rsvpEnabled === false
                  ? 'RSVPs are currently closed'
                  : 'Checking RSVP availability'}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink-400">
              {rsvpStatusUnavailable
                ? 'Please try again in a moment.'
                : rsvpEnabled === false
                  ? 'We are not accepting new responses right now. Please check back later.'
                  : 'The RSVP form will appear when responses are open.'}
            </p>
          </section>
        </Reveal>
      )}
    </div>
  );
};

export default RSVPPage;
