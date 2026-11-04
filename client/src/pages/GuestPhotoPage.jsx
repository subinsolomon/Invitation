import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/motion/Reveal';
import { feedbackService } from '../services/api';
import { EASE_SWIFT } from '../lib/motion';
import { useWeddingPhase } from '../context/WeddingPhaseContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const FEEDBACK_PROMPT_KEY = 'guest_feedback_prompted';
const PROMPT_AFTER_SCROLL_SECONDS = 10;

const getApiUrl = (path) => (path?.startsWith('http') ? path : `${API_URL}${path}`);

const DownloadIcon = ({ className = 'h-4 w-4' }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 2v8m0 0 3-3m-3 3L5 7M3 12.5h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const GuestPhotoPage = () => {
  const { weddingPhase } = useWeddingPhase();
  const isAfterWedding = weddingPhase === 'after';
  const prefersReducedMotion = useReducedMotion();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadError, setDownloadError] = useState('');
  const [downloadingIds, setDownloadingIds] = useState(new Set());
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [feedbackEnabled, setFeedbackEnabled] = useState(false);
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  const promptedThisSession = useRef(null);
  const checkingPrompt = useRef(false);
  const activeScrollSeconds = useRef(0);

  if (promptedThisSession.current === null) {
    try {
      promptedThisSession.current = sessionStorage.getItem(FEEDBACK_PROMPT_KEY) === 'true';
    } catch {
      promptedThisSession.current = false;
    }
  }

  const showPromptIfFeedbackIsOpen = useCallback(async () => {
    if (promptedThisSession.current || checkingPrompt.current) return;
    checkingPrompt.current = true;

    try {
      const status = await feedbackService.getStatus();
      setFeedbackEnabled(status.enabled);
      if (!status.enabled) return;

      promptedThisSession.current = true;
      try {
        sessionStorage.setItem(FEEDBACK_PROMPT_KEY, 'true');
      } catch {
        // Keep the once-per-session guard in memory if storage is unavailable.
      }
      setShowFeedbackPrompt(true);
    } catch {
      setFeedbackEnabled(false);
    } finally {
      checkingPrompt.current = false;
    }
  }, []);

  useEffect(() => {
    let active = true;
    const checkFeedbackStatus = async () => {
      try {
        const status = await feedbackService.getStatus();
        if (active) setFeedbackEnabled(status.enabled);
      } catch {
        if (active) setFeedbackEnabled(false);
      }
    };

    checkFeedbackStatus();
    const intervalId = window.setInterval(checkFeedbackStatus, 3000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!feedbackEnabled || promptedThisSession.current) return undefined;

    const intervalId = window.setInterval(() => {
      if (promptedThisSession.current) return;
      if (document.visibilityState !== 'visible' || window.scrollY <= 0) return;
      activeScrollSeconds.current += 1;
      if (activeScrollSeconds.current >= PROMPT_AFTER_SCROLL_SECONDS) showPromptIfFeedbackIsOpen();
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [feedbackEnabled, showPromptIfFeedbackIsOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedPhoto(null);
        setShowFeedbackPrompt(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/api/guest-photos`);
        if (!response.ok) {
          throw new Error(`Failed to fetch photos: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.success && Array.isArray(data.photos)) {
          setPhotos(data.photos);
        } else {
          throw new Error('Guest photos returned an invalid photo list.');
        }
      } catch (err) {
        console.error('Error fetching guest photos:', err);
        setError('Guest photos could not load right now. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const handleDownload = async (photo) => {
    setDownloadError('');
    try {
      setDownloadingIds((previous) => new Set([...previous, photo.id]));

      const response = await fetch(getApiUrl(photo.downloadProxyUrl));
      if (!response.ok) {
        throw new Error('Failed to download photo');
      }

      const filename = photo.name || `guest-photo-${photo.id}.jpg`;
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      showPromptIfFeedbackIsOpen();
    } catch (err) {
      console.error('Error downloading photo:', err);
      setDownloadError('That photo could not be downloaded. Please try again.');
    } finally {
      setDownloadingIds((previous) => {
        const next = new Set(previous);
        next.delete(photo.id);
        return next;
      });
    }
  };

  return (
    <div className="shell pb-24">
      <PageHeader
        eyebrow={isAfterWedding ? 'From the day we shared' : 'Coming after the celebration'}
        title="Event"
        accent="Memories"
        lede={isAfterWedding
          ? 'Photographs from the celebration. Open any picture, or download the ones you love.'
          : 'Guest photographs from the celebration will be gathered here. Stay tuned.'}
      />

      {downloadError && (
        <div className="mt-8 rounded-2xl border border-clay-400/35 bg-clay-500/10 px-5 py-4 text-sm text-clay-200" role="alert">
          {downloadError}
        </div>
      )}

      {loading && (
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[4/5] animate-pulse rounded-2xl border border-ink-100/10 bg-ink-100/[0.04]"
              style={{ animationDelay: `${index * 80}ms` }}
              aria-hidden="true"
            />
          ))}
          <span className="sr-only" role="status">
            Loading guest photographs
          </span>
        </div>
      )}

      {error && !loading && (
        <div className="mt-10 rounded-2xl border border-clay-400/35 bg-clay-500/10 px-5 py-4 text-sm text-clay-200" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && photos.length > 0 && (
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo, index) => {
            const isDownloading = downloadingIds.has(photo.id);
            return (
              <motion.div
                key={photo.id}
                className="group relative overflow-hidden rounded-2xl border border-ink-100/10 bg-ink-900"
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.55,
                  delay: prefersReducedMotion ? 0 : Math.min(index * 0.035, 0.35),
                  ease: EASE_SWIFT,
                }}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={getApiUrl(photo.proxyUrl)}
                    alt={photo.alt || photo.name || 'Guest photograph'}
                    loading="lazy"
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${photo.alt || photo.name || 'guest photograph'}`}
                    className="h-full w-full cursor-pointer object-cover transition-transform duration-[900ms] ease-swift group-hover:scale-[1.05]"
                    onClick={() => setSelectedPhoto(photo)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedPhoto(photo);
                      }
                    }}
                  />

                  <span
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/5 to-transparent opacity-80 transition-opacity duration-500"
                    aria-hidden="true"
                  />
                  <span
                    className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent transition-colors duration-500 group-hover:ring-gold-300/40"
                    aria-hidden="true"
                  />

                  <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPhoto(photo)}
                      className="text-[0.62rem] font-semibold uppercase tracking-label text-ink-100/80 transition-colors duration-300 hover:text-gold-200"
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownload(photo)}
                      disabled={isDownloading}
                      className="inline-flex items-center gap-1.5 rounded-full border border-ink-100/25 bg-ink-950/70 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ink-100 backdrop-blur-sm transition-colors duration-300 hover:border-gold-300/50 hover:text-gold-100 disabled:opacity-60"
                    >
                      {isDownloading ? (
                        <>
                          <span className="h-3 w-3 animate-spin rounded-full border border-ink-100/40 border-t-ink-100" aria-hidden="true" />
                          Saving
                        </>
                      ) : (
                        <>
                          <DownloadIcon className="h-3 w-3" />
                          Save
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {!loading && !error && photos.length === 0 && (
        <Reveal variant="fade">
          <div className="card mt-12 px-6 py-16 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold-300/30 bg-gold-300/[0.06] text-gold-200">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="6" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M8.5 6 10 3.8h4L15.5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="12" cy="12.5" r="3.2" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl text-ink-50">Stay tuned</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-400">
              Photos shared by guests will appear here soon.
            </p>
          </div>
        </Reveal>
      )}

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/94 p-3 backdrop-blur-xl sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
            onClick={() => setSelectedPhoto(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Guest photograph viewer"
          >
            <motion.div
              className="relative w-full max-w-4xl"
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.98 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: EASE_SWIFT }}
            >
              <img
                src={getApiUrl(selectedPhoto.proxyUrl)}
                alt={selectedPhoto.alt || selectedPhoto.name || 'Guest photograph'}
                className="mx-auto max-h-[78vh] w-auto max-w-full rounded-2xl border border-ink-100/15 object-contain shadow-lift"
              />

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <span className="font-mono text-[0.65rem] tracking-[0.24em] text-ink-400">
                  {selectedPhoto.createdTime
                    ? new Date(selectedPhoto.createdTime).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Guest photograph'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownload(selectedPhoto)}
                    disabled={downloadingIds.has(selectedPhoto.id)}
                    className="btn-quiet"
                  >
                    <DownloadIcon className="h-3.5 w-3.5" />
                    {downloadingIds.has(selectedPhoto.id) ? 'Saving' : 'Save photo'}
                  </button>
                  <button type="button" onClick={() => setSelectedPhoto(null)} className="btn-quiet">
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFeedbackPrompt && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-ink-950/85 px-4 py-8 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFeedbackPrompt(false)}
            role="presentation"
          >
            <motion.section
              className="card relative w-full max-w-md p-6 sm:p-8"
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 22, scale: prefersReducedMotion ? 1 : 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 12, scale: prefersReducedMotion ? 1 : 0.98 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: EASE_SWIFT }}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="guest-feedback-title"
              aria-describedby="guest-feedback-description"
            >
              <button
                type="button"
                aria-label="Dismiss feedback invitation"
                onClick={() => setShowFeedbackPrompt(false)}
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-ink-100/15 text-ink-300 transition-colors duration-300 hover:border-gold-300/40 hover:text-gold-100"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>

              <span className="mb-5 grid h-12 w-12 place-items-center rounded-full border border-gold-300/30 bg-gold-300/[0.07] text-gold-200" aria-hidden="true">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path d="m12 3.6 2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L3.4 9.9l6-.8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
              </span>

              <p className="eyebrow mb-2">A little note</p>
              <h2 id="guest-feedback-title" className="text-3xl text-ink-50">
                How was the celebration?
              </h2>
              <p id="guest-feedback-description" className="mt-3 text-sm leading-relaxed text-ink-300">
                We would love to hear what you thought of the day. Your ratings and a short note help us keep these memories close.
              </p>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setShowFeedbackPrompt(false)} className="btn-quiet">
                  Maybe later
                </button>
                <Link to="/feedback" onClick={() => setShowFeedbackPrompt(false)} className="btn btn-primary">
                  Share feedback
                </Link>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GuestPhotoPage;
