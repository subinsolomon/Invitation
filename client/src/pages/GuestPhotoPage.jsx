import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { feedbackService } from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const FEEDBACK_PROMPT_KEY = 'guest_feedback_prompted';

const getApiUrl = (path) => (path?.startsWith('http') ? path : `${API_URL}${path}`);

export const GuestPhotoPage = () => {
  const { currentTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const showPromptIfFeedbackIsOpen = async () => {
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
  };

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
      if (activeScrollSeconds.current >= 10) showPromptIfFeedbackIsOpen();
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [feedbackEnabled]);

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

  // Fetch guest photos from backend API
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
          if (data.photos.length) console.log(`✅ Loaded ${data.photos.length} guest photos from Google Drive`);
        } else {
          throw new Error('Guest photos returned an invalid photo list.');
        }
      } catch (err) {
        console.error('❌ Error fetching guest photos:', err);
        setError('Guest photos could not load right now. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  // Handle photo download
  const handleDownload = async (photo) => {
    try {
      setDownloadingIds(prev => new Set([...prev, photo.id]));
      
      const response = await fetch(getApiUrl(photo.downloadProxyUrl));
      
      if (!response.ok) {
        throw new Error('Failed to download photo');
      }

      // Extract filename from photo name or create one
      const filename = photo.name || `guest-photo-${photo.id}.jpg`;
      
      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      console.log(`✅ Downloaded: ${filename}`);
      showPromptIfFeedbackIsOpen();
    } catch (err) {
      console.error('❌ Error downloading photo:', err);
      alert(`Error downloading photo: ${err.message}`);
    } finally {
      setDownloadingIds(prev => {
        const next = new Set(prev);
        next.delete(photo.id);
        return next;
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        delayChildren: prefersReducedMotion ? 0 : 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0.15 : 0.6 },
    },
  };

  const photoVariants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.94 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: prefersReducedMotion ? 0.18 : 0.5 },
    },
    hover: prefersReducedMotion ? {} : {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="min-h-screen px-4 pt-8 pb-8 sm:px-6 sm:pt-12 sm:pb-12"
      style={{ backgroundColor: currentTheme.bgColor }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div className="mb-12 max-w-2xl" variants={itemVariants}>
          <p className="eyebrow mb-4">Shared memories</p>
          <h1
            className="mb-4 text-4xl font-bold sm:text-6xl"
            style={{ color: currentTheme.accentColor }}
          >
            Guest Photos
          </h1>
          <p
            className="max-w-2xl text-base leading-7 opacity-75 sm:text-lg"
            style={{ color: currentTheme.textColor }}
          >
            Cherished moments from our celebration. Feel free to download and share your favorite memories!
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            className="flex items-center justify-center min-h-96"
            variants={itemVariants}
          >
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full border-4 border-transparent mx-auto mb-4"
                style={{
                  borderTopColor: currentTheme.accentColor,
                  animation: 'spin 1s linear infinite',
                }}
              />
              <p style={{ color: currentTheme.textColor }}>Loading guest photos...</p>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            className="glass-surface rounded-2xl p-5 text-center text-sm xs:text-base"
            variants={itemVariants}
            role="alert"
          >
            <p className="text-white/75">{error}</p>
          </motion.div>
        )}

        {/* Photos Grid */}
        {!loading && photos.length > 0 && (
          <motion.div
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                className="glass-surface group relative overflow-hidden rounded-2xl"
                style={{ backgroundColor: currentTheme.secondaryColor }}
                variants={photoVariants}
                whileHover={prefersReducedMotion ? undefined : 'hover'}
              >
                {/* Image Container */}
                <div
                  className="relative aspect-square overflow-hidden bg-gray-200"
                >
                  <motion.img
                    layoutId={`guest-photo-${photo.id}`}
                    src={getApiUrl(photo.proxyUrl)}
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${photo.alt || photo.name || 'guest photo'}`}
                    onClick={() => setSelectedPhoto(photo)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedPhoto(photo);
                      }
                    }}
                    whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
                  />

                  {/* Overlay with Download Button */}
                  <motion.div
                    className="pointer-events-none absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-300"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <motion.button
                      className="pointer-events-auto px-3 xs:px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 text-xs xs:text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(photo);
                      }}
                      disabled={downloadingIds.has(photo.id)}
                      style={{
                        backgroundColor: currentTheme.accentColor,
                        opacity: downloadingIds.has(photo.id) ? 0.7 : 1,
                      }}
                      whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
                    >
                      {downloadingIds.has(photo.id) ? '⏳ Downloading...' : '⬇️ Download'}
                    </motion.button>
                  </motion.div>
                </div>

              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && photos.length === 0 && !error && (
          <motion.div className="text-center py-12" variants={itemVariants}>
            <div className="text-5xl xs:text-6xl mb-4">📷</div>
            <p className="text-lg xs:text-xl" style={{ color: currentTheme.textColor }}>
              Stay tuned
            </p>
            <p
              className="text-xs xs:text-sm mt-2"
              style={{ color: currentTheme.textColor, opacity: 0.7 }}
            >
              Photos will be added here soon.
            </p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-3 backdrop-blur-xl sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedPhoto.alt || selectedPhoto.name || 'Guest'} photo viewer`}
          >
            <motion.div
              className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-sky-300/30 bg-slate-950/90 p-2 shadow-2xl sm:p-4"
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.97 }}
              transition={{ duration: prefersReducedMotion ? 0.15 : 0.3 }}
            >
              <button
                type="button"
                aria-label="Close photo viewer"
                className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-slate-950/75 text-2xl text-white"
                onClick={() => setSelectedPhoto(null)}
              >
                &times;
              </button>
              <motion.img
                layoutId={`guest-photo-${selectedPhoto.id}`}
                src={getApiUrl(selectedPhoto.proxyUrl)}
                alt={selectedPhoto.alt}
                className="max-h-[78vh] w-full rounded-xl object-contain"
              />
              <p className="px-3 pb-2 pt-4 text-center text-sm text-white/70">
                {new Date(selectedPhoto.createdTime).toLocaleDateString()}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFeedbackPrompt && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/75 px-4 py-8 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFeedbackPrompt(false)}
            role="presentation"
          >
            <motion.section
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-sky-200/20 bg-slate-950 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.6)] sm:p-8"
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24, scale: prefersReducedMotion ? 1 : 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 12, scale: prefersReducedMotion ? 1 : 0.98 }}
              transition={{ duration: prefersReducedMotion ? 0.15 : 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="guest-feedback-title"
              aria-describedby="guest-feedback-description"
            >
              <div className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl" />
              <button
                type="button"
                aria-label="Dismiss feedback invitation"
                onClick={() => setShowFeedbackPrompt(false)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-xl text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                &times;
              </button>
              <div className="relative">
                <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-amber-300/25 bg-amber-300/10 text-2xl text-amber-300" aria-hidden="true">
                  &#9733;
                </span>
                <p className="eyebrow mb-2">A little note</p>
                <h2 id="guest-feedback-title" className="font-serif text-3xl font-semibold text-white">
                  How was the celebration?
                </h2>
                <p id="guest-feedback-description" className="mt-3 text-sm leading-6 text-white/65">
                  We would love to hear what you thought of the day. Your ratings and a short note help us keep these memories close.
                </p>
                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackPrompt(false)}
                    className="min-h-12 rounded-lg border border-white/15 px-5 text-sm font-medium text-white/75 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    Maybe later
                  </button>
                  <Link
                    to="/feedback"
                    onClick={() => setShowFeedbackPrompt(false)}
                    className="inline-flex min-h-12 items-center justify-center rounded-lg px-5 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
                    style={{ backgroundColor: currentTheme.accentColor }}
                  >
                    Share feedback <span className="ml-2" aria-hidden="true">&#8599;</span>
                  </Link>
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </motion.div>
  );
};

export default GuestPhotoPage;
