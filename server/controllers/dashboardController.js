import prisma from '../config/database.js';
import {
  isFeedbackEnabled,
  isMemorySharingEnabled,
  isRSVPEnabled,
  getWeddingPhase,
  updateFeedbackEnabled,
  updateMemorySharingEnabled,
  updateRSVPEnabled,
  updateWeddingPhase,
} from '../services/feedbackSettings.js';

const average = (records, field) => (
  records.length
    ? Number((records.reduce((total, record) => total + record[field], 0) / records.length).toFixed(1))
    : 0
);

export const getDashboardData = async (_req, res) => {
  try {
    const [rsvps, feedback, feedbackEnabled, rsvpEnabled, memorySharingEnabled, weddingPhase] = await Promise.all([
      prisma.rSVP.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.feedback.findMany({ orderBy: { createdAt: 'desc' } }),
      isFeedbackEnabled(),
      isRSVPEnabled(),
      isMemorySharingEnabled(),
      getWeddingPhase(),
    ]);

    res.json({
      rsvps,
      feedback,
      feedbackEnabled,
      rsvpEnabled,
      memorySharingEnabled,
      weddingPhase,
      summary: {
        totalRSVPs: rsvps.length,
        attending: rsvps.filter(({ attendance }) => attendance).length,
        notAttending: rsvps.filter(({ attendance }) => !attendance).length,
        totalFeedback: feedback.length,
        ratings: {
          food: average(feedback, 'foodRating'),
          venueAmbience: average(feedback, 'venueAmbienceRating'),
          photography: average(feedback, 'photographyRating'),
          musicEntertainment: average(feedback, 'musicEntertainmentRating'),
        },
      },
    });
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    res.status(500).json({ message: 'Unable to load dashboard data right now.' });
  }
};

export const updateDashboardFeedbackStatus = async (req, res) => {
  try {
    const { enabled } = req.body;
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ message: 'enabled must be a boolean.' });
    }

    const feedbackEnabled = await updateFeedbackEnabled(enabled);
    res.json({ feedbackEnabled });
  } catch (error) {
    console.error('Error updating feedback status:', error);
    res.status(500).json({ message: 'Unable to update feedback availability.' });
  }
};

export const updateDashboardRSVPStatus = async (req, res) => {
  try {
    const { enabled } = req.body;
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ message: 'enabled must be a boolean.' });
    }

    const rsvpEnabled = await updateRSVPEnabled(enabled);
    res.json({ rsvpEnabled });
  } catch (error) {
    console.error('Error updating RSVP status:', error);
    res.status(500).json({ message: 'Unable to update RSVP availability.' });
  }
};

export const updateDashboardMemorySharingStatus = async (req, res) => {
  try {
    const { enabled } = req.body;
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ message: 'enabled must be a boolean.' });
    }

    const memorySharingEnabled = await updateMemorySharingEnabled(enabled);
    res.json({ memorySharingEnabled });
  } catch (error) {
    console.error('Error updating memory sharing status:', error);
    res.status(500).json({ message: 'Unable to update photo-sharing availability.' });
  }
};

export const updateDashboardWeddingPhase = async (req, res) => {
  try {
    const { phase } = req.body;
    if (phase !== 'before' && phase !== 'after') {
      return res.status(400).json({ message: 'phase must be "before" or "after".' });
    }

    const weddingPhase = await updateWeddingPhase(phase);
    res.json({ weddingPhase });
  } catch (error) {
    console.error('Error updating wedding phase:', error);
    res.status(500).json({ message: 'Unable to update the wedding phase.' });
  }
};