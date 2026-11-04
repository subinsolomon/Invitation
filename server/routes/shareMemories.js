import express from 'express';
import { isMemorySharingEnabled } from '../services/feedbackSettings.js';

const router = express.Router();

router.get('/status', async (_req, res) => {
  try {
    res.json({ enabled: await isMemorySharingEnabled() });
  } catch (error) {
    console.error('Error checking photo-sharing availability:', error);
    res.status(500).json({ message: 'Unable to check photo-sharing availability.' });
  }
});

export default router;