import prisma from '../config/database.js';
import { isFeedbackEnabled, updateFeedbackEnabled } from '../services/feedbackSettings.js';

const average = (records, field) => (
  records.length
    ? Number((records.reduce((total, record) => total + record[field], 0) / records.length).toFixed(1))
    : 0
);

export const getDashboardData = async (_req, res) => {
  try {
    const [rsvps, feedback, feedbackEnabled] = await Promise.all([
      prisma.rSVP.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.feedback.findMany({ orderBy: { createdAt: 'desc' } }),
      isFeedbackEnabled(),
    ]);

    res.json({
      rsvps,
      feedback,
      feedbackEnabled,
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