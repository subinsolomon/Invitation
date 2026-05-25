import express from 'express';

const router = express.Router();

const GUEST_PHOTOS_FOLDER_ID = process.env.GUEST_PHOTOS_FOLDER_ID || 'your_folder_id_here';
const GOOGLE_DRIVE_API_KEY = process.env.GOOGLE_DRIVE_API_KEY;

console.log(`📸 Using Guest Photos Folder ID: ${GUEST_PHOTOS_FOLDER_ID}`);

/**
 * Helper function to convert Google Drive file ID to direct image URL
 */
const getGoogleDriveImageUrl = (fileId) => {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
};

/**
 * Helper function to get download URL for files from Google Drive
 */
const getGoogleDriveDownloadUrl = (fileId) => {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

/**
 * Helper function to fetch files from Google Drive folder
 */
const fetchGuestPhotosFromFolder = async () => {
  try {
    if (!GOOGLE_DRIVE_API_KEY) {
      throw new Error('GOOGLE_DRIVE_API_KEY not set in .env file');
    }

    console.log(`🔍 Querying Google Drive API for guest photos folder: ${GUEST_PHOTOS_FOLDER_ID}`);

    // Query to get all image files from the folder (web-compatible formats only)
    // Note: HEIC/HEIF files will be filtered out on the backend since they're not supported in browsers
    const query = encodeURIComponent(
      `'${GUEST_PHOTOS_FOLDER_ID}' in parents and trashed=false and (mimeType='image/jpeg' or mimeType='image/png' or mimeType='image/webp' or mimeType='image/gif')`
    );

    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&spaces=drive&fields=files(id,name,createdTime,mimeType,size)&pageSize=100&orderBy=createdTime%20desc&key=${GOOGLE_DRIVE_API_KEY}`;

    console.log(`📡 Fetching guest photos...`);

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || response.statusText;
      
      if (response.status === 403) {
        throw new Error(
          `403 Forbidden: ${errorMessage}\n` +
          `Possible causes:\n` +
          `1. API key is invalid or revoked\n` +
          `2. Google Drive API is not enabled for this project\n` +
          `3. Folder ID is incorrect\n` +
          `4. Folder is not shared publicly`
        );
      }
      
      throw new Error(`Google Drive API returned ${response.status}: ${errorMessage}`);
    }

    const data = await response.json();
    const files = data.files || [];
    console.log(`📦 Found ${files.length} image files in guest photos folder`);

    // Filter out HEIC/HEIF files (not supported in browsers)
    // Only keep web-compatible formats: JPEG, PNG, WebP, GIF
    const webCompatibleMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const webCompatibleFiles = files.filter(file => webCompatibleMimeTypes.includes(file.mimeType));
    
    if (webCompatibleFiles.length < files.length) {
      const heicCount = files.length - webCompatibleFiles.length;
      console.log(`⚠️  Filtered out ${heicCount} HEIC/HEIF file(s) - not supported in browsers`);
    }

    // Transform files into photo objects with download support
    const photos = webCompatibleFiles.map((file) => ({
      id: file.id,
      name: file.name,
      title: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
      alt: file.name,
      url: getGoogleDriveImageUrl(file.id),
      downloadUrl: getGoogleDriveDownloadUrl(file.id),
      proxyUrl: `/api/guest-photos/image/${file.id}`,
      downloadProxyUrl: `/api/guest-photos/download/${file.id}`,
      createdTime: file.createdTime,
      mimeType: file.mimeType,
      size: file.size,
    }));

    console.log(`✅ Successfully transformed ${photos.length} guest photos`);
    return photos;
  } catch (error) {
    console.error('❌ Error fetching guest photos from Google Drive API:');
    console.error('Error Message:', error.message);
    throw new Error(`Google Drive API Error: ${error.message}`);
  }
};

/**
 * GET /api/guest-photos/health
 * Health check endpoint for guest photos API configuration
 */
router.get('/health', async (req, res) => {
  const healthStatus = {
    status: 'ok',
    folderConfigured: !!GUEST_PHOTOS_FOLDER_ID && GUEST_PHOTOS_FOLDER_ID !== 'your_folder_id_here',
    apiKeyConfigured: !!GOOGLE_DRIVE_API_KEY,
    folderId: GUEST_PHOTOS_FOLDER_ID,
    timestamp: new Date().toISOString(),
  };

  if (!healthStatus.apiKeyConfigured || !healthStatus.folderConfigured) {
    healthStatus.status = 'incomplete';
    healthStatus.message = 'Missing configuration. Please check GOOGLE_DRIVE_API_KEY and GUEST_PHOTOS_FOLDER_ID in .env';
  }

  res.json(healthStatus);
});

/**
 * GET /api/guest-photos
 * Returns list of guest photos from Google Drive folder
 */
router.get('/', async (req, res) => {
  try {
    console.log('\n📸 Guest photos request started...');
    const photos = await fetchGuestPhotosFromFolder();

    res.json({
      success: true,
      folderId: GUEST_PHOTOS_FOLDER_ID,
      photoCount: photos.length,
      photos: photos,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('\n❌ Guest photos request failed');
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch guest photos',
      error: error.message,
    });
  }
});

/**
 * GET /api/guest-photos/image/:fileId
 * Proxy endpoint to serve images from Google Drive with CORS headers
 */
router.get('/image/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;

    // Validate file ID format
    if (!fileId || !/^[a-zA-Z0-9_-]+$/.test(fileId)) {
      return res.status(400).json({ error: 'Invalid file ID' });
    }

    const imageUrl = getGoogleDriveImageUrl(fileId);
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Failed to fetch image from Google Drive',
      });
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'public, max-age=86400');

    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Error proxying image:', error);
    res.status(500).json({ error: 'Failed to proxy image' });
  }
});

/**
 * GET /api/guest-photos/download/:fileId
 * Download endpoint for guest photos
 * Returns the file with proper download headers
 */
router.get('/download/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;

    // Validate file ID format
    if (!fileId || !/^[a-zA-Z0-9_-]+$/.test(fileId)) {
      return res.status(400).json({ error: 'Invalid file ID' });
    }

    const downloadUrl = getGoogleDriveDownloadUrl(fileId);
    const response = await fetch(downloadUrl);

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Failed to download from Google Drive',
      });
    }

    // Set download headers
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent('guest-photo')}`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

export default router;
