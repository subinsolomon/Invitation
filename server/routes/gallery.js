import express from 'express';
import sharp from 'sharp';

const router = express.Router();

const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || 'your_folder_id_here';
const GOOGLE_DRIVE_API_KEY = process.env.GOOGLE_DRIVE_API_KEY;

console.log(`📁 Using Google Drive Folder ID: ${GOOGLE_DRIVE_FOLDER_ID}`);
console.log(`🔑 API Key configured: ${GOOGLE_DRIVE_API_KEY ? `Yes (${GOOGLE_DRIVE_API_KEY.substring(0, 20)}...)` : 'No'}`);

/**
 * Helper function to convert Google Drive file ID to direct image URL
 * This bypasses CORB by using Google's CDN for image serving
 */
const getGoogleDriveImageUrl = (fileId) => {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
};

/**
 * Helper function to fetch files from Google Drive folder using REST API
 * Returns array of photos with metadata
 */
const fetchPhotosFromFolder = async () => {
  try {
    if (!GOOGLE_DRIVE_API_KEY) {
      throw new Error('GOOGLE_DRIVE_API_KEY not set in .env file');
    }

    console.log(`🔍 Querying Google Drive API for folder: ${GOOGLE_DRIVE_FOLDER_ID}`);

    // Query to get all image files from the folder
    const query = encodeURIComponent(
      `'${GOOGLE_DRIVE_FOLDER_ID}' in parents and trashed=false and (mimeType='image/jpeg' or mimeType='image/png' or mimeType='image/webp' or mimeType='image/gif' or mimeType='image/heif')`
    );

    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&spaces=drive&fields=files(id,name,createdTime,mimeType)&pageSize=100&orderBy=createdTime%20desc&key=${GOOGLE_DRIVE_API_KEY}`;

    console.log(`📡 Fetching from: https://www.googleapis.com/drive/v3/files...`);

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
    console.log(`📦 Found ${files.length} image files in Google Drive`);

    // Transform files into photo objects
    const photos = files.map((file) => ({
      id: file.id,
      name: file.name,
      title: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
      alt: file.name,
      url: getGoogleDriveImageUrl(file.id),
      proxyUrl: `/api/gallery/image/${file.id}`, // Use backend proxy for CORS safety
      createdTime: file.createdTime,
      mimeType: file.mimeType,
    }));

    console.log(`✅ Successfully transformed ${photos.length} photos`);
    return photos;
  } catch (error) {
    console.error('❌ Error fetching from Google Drive API:');
    console.error('Error Message:', error.message);
    
    // Throw error so it's caught by the route handler
    throw new Error(`Google Drive API Error: ${error.message}`);
  }
};

/**
 * GET /api/gallery/health
 * Health check endpoint for Google Drive API configuration
 */
router.get('/health', async (req, res) => {
  const healthStatus = {
    status: 'ok',
    folderConfigured: !!GOOGLE_DRIVE_FOLDER_ID && GOOGLE_DRIVE_FOLDER_ID !== 'your_folder_id_here',
    apiKeyConfigured: !!GOOGLE_DRIVE_API_KEY,
    folderId: GOOGLE_DRIVE_FOLDER_ID,
    timestamp: new Date().toISOString(),
  };

  if (!healthStatus.apiKeyConfigured || !healthStatus.folderConfigured) {
    healthStatus.status = 'incomplete';
    healthStatus.message = 'Missing configuration. Please check GOOGLE_DRIVE_API_KEY and GOOGLE_DRIVE_FOLDER_ID in .env';
  } else {
    // Try to validate the API key by making a simple request
    try {
      console.log('🧪 Validating API key...');
      const testUrl = `https://www.googleapis.com/drive/v3/files?q='root'%20in%20parents&pageSize=1&key=${GOOGLE_DRIVE_API_KEY}`;
      const testResponse = await fetch(testUrl);
      
      if (testResponse.ok) {
        healthStatus.apiKeyValid = true;
        healthStatus.message = '✅ All systems operational!';
      } else {
        const errorData = await testResponse.json().catch(() => ({}));
        healthStatus.apiKeyValid = false;
        healthStatus.status = 'error';
        healthStatus.message = `API Key validation failed: ${errorData.error?.message || testResponse.statusText}`;
        console.error('❌ API Key validation failed:', errorData.error?.message);
      }
    } catch (error) {
      healthStatus.apiKeyValid = false;
      healthStatus.status = 'error';
      healthStatus.message = `API Key validation error: ${error.message}`;
    }
  }

  res.json(healthStatus);
});

/**
 * GET /api/gallery
 * Returns list of photos from Google Drive folder
 */
router.get('/', async (req, res) => {
  try {
    console.log('\n🎬 Gallery request started...');
    const photos = await fetchPhotosFromFolder();

    res.json({
      success: true,
      folderId: GOOGLE_DRIVE_FOLDER_ID,
      photoCount: photos.length,
      photos: photos,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('\n❌ Gallery request failed');
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery data',
      error: error.message,
    });
  }
});

/**
 * GET /api/gallery/image/:fileId
 * Proxy endpoint to serve images from Google Drive with CORS headers
 * This solves the CORB (Cross-Origin Read Blocking) issue
 */
router.get('/image/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;

    // Validate file ID format
    if (!fileId || !/^[a-zA-Z0-9_-]+$/.test(fileId)) {
      return res.status(400).json({ error: 'Invalid file ID' });
    }

    // Fetch image from Google Drive
    const imageUrl = getGoogleDriveImageUrl(fileId);

    // Use fetch to get the image and proxy it
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Failed to fetch image from Google Drive',
      });
    }

    // Set CORS headers to allow cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours

    // Set content type based on Google Drive response
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    // Convert the fetch Response to a Node.js stream and pipe to response
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Error proxying image:', error);
    res.status(500).json({ error: 'Failed to serve image' });
  }
});

export default router;
