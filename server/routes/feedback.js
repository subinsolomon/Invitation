import express from 'express';
import { createFeedback } from '../controllers/feedbackController.js';
import { handleValidationErrors, validateFeedback } from '../middleware/validation.js';

const router = express.Router();

router.post('/', validateFeedback, handleValidationErrors, createFeedback);

export default router;