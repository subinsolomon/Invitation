import express from 'express';
import { createFeedback, getAllFeedback, getFeedbackStatus } from '../controllers/feedbackController.js';
import { handleValidationErrors, validateFeedback } from '../middleware/validation.js';
import { requireAdminToken } from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/', validateFeedback, handleValidationErrors, createFeedback);
router.get('/', requireAdminToken, getAllFeedback);
router.get('/status', getFeedbackStatus);

export default router;