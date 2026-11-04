import express from 'express';
import {
	getDashboardData,
	updateDashboardFeedbackStatus,
	updateDashboardMemorySharingStatus,
	updateDashboardRSVPStatus,
	updateDashboardWeddingPhase,
} from '../controllers/dashboardController.js';
import { requireAdminToken } from '../middleware/adminAuth.js';

const router = express.Router();

router.get('/', requireAdminToken, getDashboardData);
router.patch('/feedback-status', requireAdminToken, updateDashboardFeedbackStatus);
router.patch('/rsvp-status', requireAdminToken, updateDashboardRSVPStatus);
router.patch('/memory-sharing-status', requireAdminToken, updateDashboardMemorySharingStatus);
router.patch('/wedding-phase', requireAdminToken, updateDashboardWeddingPhase);

export default router;