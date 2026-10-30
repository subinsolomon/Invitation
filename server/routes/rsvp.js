import express from 'express';
import { 
  createRSVP, 
  getAllRSVPs, 
  getRSVPCount 
} from '../controllers/rsvpController.js';
import { 
  validateRSVP, 
  handleValidationErrors 
} from '../middleware/validation.js';
import { requireAdminToken } from '../middleware/adminAuth.js';

const router = express.Router();

// POST /api/rsvp - Create new RSVP
router.post('/', validateRSVP, handleValidationErrors, createRSVP);

// GET /api/rsvp - Get all RSVPs (admin only)
router.get('/', requireAdminToken, getAllRSVPs);

// GET /api/rsvp/count - Get RSVP statistics
router.get('/count', requireAdminToken, getRSVPCount);

export default router;
