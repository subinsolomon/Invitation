import express from 'express';
import { createFeedback, getAllFeedback } from '../controllers/feedbackController.js';
import { handleValidationErrors, validateFeedback } from '../middleware/validation.js';

const router = express.Router();

router.post('/', validateFeedback, handleValidationErrors, createFeedback);
router.get('/', getAllFeedback);

export default router;