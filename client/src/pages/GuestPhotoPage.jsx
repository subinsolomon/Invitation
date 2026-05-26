import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const GuestPhotoPage = () => {
  const { currentTheme } = useTheme();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [downloadingIds, setDownloadingIds] = useState(new Set());

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
      
      const response = await fetch(photo.downloadProxyUrl);
      
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
      className="min-h-screen py-8 xs:py-12 sm:py-16 md:py-20 px-3 xs:px-4"
      style={{ backgroundColor: currentTheme.bgColor }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div className="text-center mb-8 xs:mb-10 sm:mb-12" variants={itemVariants}>
          <h1
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold mb-3 xs:mb-4"
            style={{ color: currentTheme.accentColor }}
          >
            Guest Photos
          </h1>
          <p
            className="text-sm xs:text-base sm:text-lg max-w-2xl mx-auto"
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
                className="group relative overflow-hidden rounded-lg shadow-lg"
                style={{ backgroundColor: currentTheme.secondaryColor }}
                variants={photoVariants}
                whileHover="hover"
              >
                {/* Image Container */}
                <div
                  className="relative aspect-square overflow-hidden bg-gray-200 cursor-pointer"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <motion.img
                    src={photo.proxyUrl}
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Overlay with Download Button */}
                  <motion.div
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-300"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(photo);
                      }}
                      disabled={downloadingIds.has(photo.id)}
                      className="px-3 xs:px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 text-xs xs:text-sm"
                      style={{
                        backgroundColor: currentTheme.accentColor,
                        opacity: downloadingIds.has(photo.id) ? 0.7 : 1,
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
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

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-3 xs:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedPhoto(null)}
        >
          <motion.div
            className="relative max-w-2xl max-h-96 w-full"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.proxyUrl}
              alt={selectedPhoto.alt}
              className="w-full h-full object-contain rounded-lg"
            />

            {/* Modal Close Button */}
            <motion.button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-8 xs:-top-10 -right-8 xs:-right-10 text-white text-2xl xs:text-3xl hover:text-gray-300 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              ✕
            </motion.button>

            {/* Modal Download Button */}
            <motion.button
              onClick={() => {
                handleDownload(selectedPhoto);
              }}
              disabled={downloadingIds.has(selectedPhoto.id)}
              className="absolute bottom-3 xs:bottom-4 right-3 xs:right-4 px-4 xs:px-6 py-2 xs:py-3 rounded-lg font-semibold text-white transition-all duration-300 flex items-center gap-2 text-xs xs:text-base"
              style={{
                backgroundColor: currentTheme.accentColor,
                opacity: downloadingIds.has(selectedPhoto.id) ? 0.7 : 1,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {downloadingIds.has(selectedPhoto.id) ? '⏳ Downloading...' : '⬇️ Download'}
            </motion.button>

            {/* Photo Info in Modal */}
            <div className="absolute bottom-3 xs:bottom-4 left-3 xs:left-4 bg-black bg-opacity-60 px-3 xs:px-4 py-2 rounded text-white text-xs xs:text-sm">
              <p className="text-sm opacity-80">
                {new Date(selectedPhoto.createdTime).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
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
