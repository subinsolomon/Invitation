import express from 'express';
import { getDashboardData, updateDashboardFeedbackStatus } from '../controllers/dashboardController.js';
import { requireAdminToken } from '../middleware/adminAuth.js';

const router = express.Router();

router.get('/', requireAdminToken, getDashboardData);
router.patch('/feedback-status', requireAdminToken, updateDashboardFeedbackStatus);

export default router;