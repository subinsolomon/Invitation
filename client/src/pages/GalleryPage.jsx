import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getApiUrl = (path) => (path?.startsWith('http') ? path : `${API_URL}${path}`);

export const GalleryPage = () => {
  const { currentTheme } = useTheme();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Fetch photos from backend API
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

        if (data.success && data.photos && data.photos.length > 0) {
          setPhotos(data.photos);
          console.log(`✅ Loaded ${data.photos.length} photos from Google Drive`);
        } else {
          setError('No photos found in your Google Drive folder.');
          console.warn('No photos found in response:', data);
        }
      } catch (err) {
        console.error('❌ Error fetching photos:', err);
        setError(`Error loading gallery: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedPhoto(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const photoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="min-h-screen py-20"
      style={{ backgroundColor: currentTheme.bgColor }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h1
            className="text-5xl md:text-6xl font-serif font-bold mb-4"
            style={{ color: currentTheme.accentColor }}
          >
            Our Gallery
          </h1>
          
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-16 h-16 border-4 rounded-full"
              style={{
                borderColor: currentTheme.accentColor,
                borderTopColor: 'transparent',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="mt-4 text-lg" style={{ color: currentTheme.textColor }}>
              Loading photos from Google Drive...
            </p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            className="p-6 rounded-lg text-center mb-8"
            style={{
              backgroundColor: '#ff6b6b33',
              border: '2px solid #ff6b6b',
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-red-500 text-lg font-semibold">⚠️ {error}</p>
            <p className="text-red-400 text-sm mt-2">
              Make sure your Google Drive folder ID is configured in .env and all photos are shared with "Anyone with the link"
            </p>
          </motion.div>
        )}

        {/* Photo Grid */}
        {!loading && photos.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                variants={photoVariants}
                whileHover="hover"
                className="relative group overflow-hidden rounded-lg"
                style={{
                  aspectRatio: '1/1',
                  boxShadow: `0 8px 32px ${currentTheme.accentColor}33`,
                }}
              >
                {/* Image Container */}
                <motion.div
                  className="w-full h-full cursor-pointer relative"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={getApiUrl(photo.proxyUrl || `/api/gallery/image/${photo.id}`)}
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to direct Google Drive URL if proxy fails
                      e.target.src = `https://drive.google.com/uc?export=view&id=${photo.id}`;
                    }}
                  />

                  {/* Overlay */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      backgroundColor: `${currentTheme.primaryColor}cc`,
                    }}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="text-center"
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1 }}
                    >
                      {/* <p className="text-white text-lg font-semibold mb-2">{photo.title}</p> */}
                      <p className="text-white text-sm">Click to view</p>
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Number Badge */}
                <div
                  className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{
                    backgroundColor: currentTheme.accentColor,
                    color: currentTheme.primaryColor,
                  }}
                >
                  {index + 1}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

      
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          style={{
            backgroundColor: `${currentTheme.primaryColor}ee`,
            backdropFilter: 'blur(12px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedPhoto(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedPhoto.title} photo viewer`}
        >
          <motion.div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl p-2 sm:p-3"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(event) => event.stopPropagation()}
            style={{
              backgroundColor: currentTheme.bgColor,
              border: `1px solid ${currentTheme.accentColor}99`,
              boxShadow: `0 24px 80px ${currentTheme.primaryColor}cc, 0 0 0 1px ${currentTheme.accentColor}33`,
            }}
          >
            {/* Close Button */}
            <motion.button
              type="button"
              aria-label="Close photo viewer"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-2xl font-light shadow-lg"
              style={{
                backgroundColor: `${currentTheme.primaryColor}cc`,
                color: currentTheme.textColor,
                border: `1px solid ${currentTheme.accentColor}99`,
              }}
              whileHover={{ scale: 1.08, backgroundColor: currentTheme.accentColor, color: currentTheme.primaryColor }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedPhoto(null)}
            >
              ✕
            </motion.button>

            {/* Image */}
            <img
              src={selectedPhoto.proxyUrl || `${API_URL}/api/gallery/image/${selectedPhoto.id}`}
              alt={selectedPhoto.alt}
              className="max-h-[72vh] w-full rounded-xl object-contain"
              style={{ backgroundColor: `${currentTheme.primaryColor}55` }}
              onError={(e) => {
                // Fallback to direct Google Drive URL
                e.target.src = `https://drive.google.com/uc?export=view&id=${selectedPhoto.id}`;
              }}
            />

            {/* Caption */}
            <motion.div
              className="px-3 pb-2 pt-4 text-center sm:px-5 sm:pb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* <p className="text-lg font-semibold" style={{ color: currentTheme.accentColor }}>
                {selectedPhoto.title}
              </p> */}
              {/* <p className="mt-1 text-sm" style={{ color: currentTheme.textColor }}>
                {selectedPhoto.alt}
              </p> */}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GalleryPage;
