import express from 'express';
import { createFeedback, getAllFeedback } from '../controllers/feedbackController.js';
import { handleValidationErrors, validateFeedback } from '../middleware/validation.js';
import { requireAdminToken } from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/', validateFeedback, handleValidationErrors, createFeedback);
router.get('/', requireAdminToken, getAllFeedback);

export default router;