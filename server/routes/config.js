import express from 'express';

const router = express.Router();

// GET /api/config - Get wedding configuration
router.get('/', (req, res) => {
  const config = {
    brideName: process.env.BRIDE_NAME || 'Bride',
    groomName: process.env.GROOM_NAME || 'Groom',
    weddingDate: process.env.WEDDING_DATE,
    location: process.env.WEDDING_LOCATION,
    coordinates: {
      lat: parseFloat(process.env.WEDDING_COORDINATES_LAT),
      lng: parseFloat(process.env.WEDDING_COORDINATES_LNG),
    },
    theme: {
      primaryColor: process.env.THEME_PRIMARY_COLOR,
      secondaryColor: process.env.THEME_SECONDARY_COLOR,
      accentColor: process.env.THEME_ACCENT_COLOR,
    },
    bibleVerse: {
      text: 'Therefore what God has joined together, let no one separate.',
      reference: 'Mark 10:9',
    },
  };

  res.json(config);
});

export default router;
