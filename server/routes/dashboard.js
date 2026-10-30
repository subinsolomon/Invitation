import express from 'express';
import { getDashboardData } from '../controllers/dashboardController.js';
import { requireAdminToken } from '../middleware/adminAuth.js';

const router = express.Router();

router.get('/', requireAdminToken, getDashboardData);

export default router;