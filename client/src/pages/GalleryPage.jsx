import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/motion/Reveal';
import { EASE_SWIFT } from '../lib/motion';
import { useWeddingPhase } from '../context/WeddingPhaseContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getApiUrl = (path) => (path?.startsWith('http') ? path : `${API_URL}${path}`);
const getImageSrc = (photo) => getApiUrl(photo.proxyUrl || `/api/gallery/image/${photo.id}`);
const getDriveFallback = (photo) => `https://drive.google.com/uc?export=view&id=${photo.id}`;

const ArrowIcon = ({ direction = 'next' }) => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    style={{ transform: direction === 'prev' ? 'rotate(180deg)' : undefined }}
  >
    <path d="M3 8h9m0 0L8.5 4.5M12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const GalleryPage = () => {
  const { weddingPhase } = useWeddingPhase();
  const isAfterWedding = weddingPhase === 'after';
  const prefersReducedMotion = useReducedMotion();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const selectedPhoto = activeIndex === null ? null : photos[activeIndex];

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/api/gallery`);
        if (!response.ok) {
          throw new Error(`Failed to fetch photos: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.success && Array.isArray(data.photos)) {
          setPhotos(data.photos);
        } else {
          throw new Error('Gallery returned an invalid photo list.');
        }
      } catch (err) {
        console.error('Error fetching gallery photos:', err);
        setError('The gallery could not load right now. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const closeLightbox = useCallback(() => setActiveIndex(null), []);

  const step = useCallback(
    (direction) => {
      setActiveIndex((current) => {
        if (current === null || photos.length === 0) return current;
        return (current + direction + photos.length) % photos.length;
      });
    },
    [photos.length],
  );

  useEffect(() => {
    if (activeIndex === null) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, closeLightbox, step]);

  return (
    <div className="shell pb-24">
      <PageHeader
        eyebrow={isAfterWedding ? 'From the day we shared' : 'Sajini, Subin & family'}
        title="Our"
        accent="Moments"
        lede={
          photos.length > 0
            ? isAfterWedding
              ? `${photos.length} photographs of Sajini, Subin, and close family from the wedding day.`
              : `${photos.length} photographs of Sajini, Subin, and close family.`
            : isAfterWedding
              ? 'Photographs of the couple and close family will appear here. Stay tuned.'
              : 'We are getting our family photographs ready. Stay tuned.'
        }
      />

      {loading && (
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[4/5] animate-pulse rounded-2xl border border-ink-100/10 bg-ink-100/[0.04]"
              style={{ animationDelay: `${index * 90}ms` }}
              aria-hidden="true"
            />
          ))}
          <span className="sr-only" role="status">
            Loading photographs
          </span>
        </div>
      )}

      {error && !loading && (
        <motion.div
          className="mt-10 rounded-2xl border border-clay-400/35 bg-clay-500/10 px-5 py-4 text-sm text-clay-200"
          role="alert"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

      {!loading && !error && photos.length === 0 && (
        <Reveal variant="fade">
          <div className="card mt-12 px-6 py-16 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold-300/30 bg-gold-300/[0.06] text-gold-200">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
                <circle cx="8.5" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.4" />
                <path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl text-ink-50">Stay tuned</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-400">
              Wedding memories will be added to the gallery soon.
            </p>
          </div>
        </Reveal>
      )}

      {!loading && photos.length > 0 && (
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {photos.map((photo, index) => (
            <motion.button
              key={photo.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-ink-100/10 bg-ink-900 text-left focus-visible:outline-none"
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.6,
                delay: prefersReducedMotion ? 0 : Math.min(index * 0.04, 0.4),
                ease: EASE_SWIFT,
              }}
              whileHover={prefersReducedMotion ? undefined : { y: -3 }}
              aria-label={`Open photograph ${index + 1} of ${photos.length}`}
            >
              <motion.img
                src={getImageSrc(photo)}
                alt={photo.alt || `Wedding photograph ${index + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[900ms] ease-swift group-hover:scale-[1.06]"
                onError={(event) => {
                  event.currentTarget.src = getDriveFallback(photo);
                }}
              />

              <span
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-95"
                aria-hidden="true"
              />

              <span
                className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent transition-colors duration-500 group-hover:ring-gold-300/45"
                aria-hidden="true"
              />

              <span className="pointer-events-none absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                <span className="font-mono text-[0.6rem] tracking-[0.28em] text-ink-200/80">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="translate-y-1 text-[0.62rem] font-semibold uppercase tracking-label text-gold-200 opacity-0 transition-all duration-500 ease-swift group-hover:translate-y-0 group-hover:opacity-100">
                  View
                </span>
              </span>
            </motion.button>
          ))}
        </div>
      )}

      {createPortal(
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/94 p-3 backdrop-blur-xl sm:p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
              onClick={closeLightbox}
              role="dialog"
              aria-modal="true"
              aria-label="Photograph viewer"
            >
              <motion.div
                className="relative w-full max-w-4xl"
                initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.98 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: EASE_SWIFT }}
                onClick={(event) => event.stopPropagation()}
              >
                <img
                  src={getImageSrc(selectedPhoto)}
                  alt={selectedPhoto.alt || 'Wedding photograph'}
                  className="mx-auto max-h-[78vh] w-auto max-w-full rounded-2xl border border-ink-100/15 object-contain shadow-lift"
                  onError={(event) => {
                    event.currentTarget.src = getDriveFallback(selectedPhoto);
                  }}
                />

                <div className="mt-4 flex items-center justify-between gap-4">
                  <button type="button" onClick={() => step(-1)} className="btn-quiet" aria-label="Previous photograph">
                    <ArrowIcon direction="prev" />
                    Prev
                  </button>

                  <span className="font-mono text-[0.65rem] tracking-[0.28em] text-ink-400">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
                  </span>

                  <button type="button" onClick={() => step(1)} className="btn-quiet" aria-label="Next photograph">
                    Next
                    <ArrowIcon direction="next" />
                  </button>
                </div>

                <button
                  type="button"
                  aria-label="Close photograph viewer"
                  onClick={closeLightbox}
                  className="absolute -top-2 right-0 grid h-10 w-10 -translate-y-full place-items-center rounded-full border border-ink-100/20 bg-ink-950/80 text-ink-200 transition-colors duration-300 hover:border-gold-300/50 hover:text-gold-100 sm:-right-2"
                >
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
};

export default GalleryPage;
