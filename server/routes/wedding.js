import express from 'express';
import { getWeddingPhase } from '../services/feedbackSettings.js';

const router = express.Router();

router.get('/phase', async (_req, res) => {
  try {
    res.json({ phase: await getWeddingPhase() });
  } catch (error) {
    console.error('Error checking wedding phase:', error);
    res.status(500).json({ message: 'Unable to check the wedding phase.' });
  }
});

export default router;