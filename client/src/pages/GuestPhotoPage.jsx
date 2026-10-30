import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getApiUrl = (path) => (path?.startsWith('http') ? path : `${API_URL}${path}`);

export const GuestPhotoPage = () => {
  const { currentTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingIds, setDownloadingIds] = useState(new Set());
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedPhoto(null);
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

        if (data.success && data.photos && data.photos.length > 0) {
          setPhotos(data.photos);
          console.log(`✅ Loaded ${data.photos.length} guest photos from Google Drive`);
        } else {
          setError('No photos found in the guest photos folder.');
          console.warn('No photos found in response:', data);
        }
      } catch (err) {
        console.error('❌ Error fetching guest photos:', err);
        setError(`Error loading guest photos: ${err.message}`);
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
            className="bg-red-50 border border-red-200 rounded-lg p-4 xs:p-6 text-center text-sm xs:text-base"
            variants={itemVariants}
          >
            <p className="text-red-800 mb-2">⚠️ {error}</p>
            <p className="text-red-600 text-xs xs:text-sm">
              Please ensure the guest photos folder ID and Google Drive API key are correctly configured.
            </p>
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

                {/* Photo Info */}
                <div className="p-2 xs:p-3 sm:p-4">
                  <p
                    className="text-xs xs:text-sm"
                    style={{ color: currentTheme.textColor, opacity: 0.7 }}
                  >
                    {new Date(photo.createdTime).toLocaleDateString()}
                  </p>
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
              No photos available yet.
            </p>
            <p
              className="text-xs xs:text-sm mt-2"
              style={{ color: currentTheme.textColor, opacity: 0.7 }}
            >
              Check back soon for guest photos!
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
