import prisma from '../config/database.js';
import { isFeedbackEnabled } from '../services/feedbackSettings.js';

export const getFeedbackStatus = async (_req, res) => {
  try {
    res.json({ enabled: await isFeedbackEnabled() });
  } catch (error) {
    console.error('Error checking feedback status:', error);
    res.status(500).json({ message: 'Unable to check feedback availability.' });
  }
};

export const getAllFeedback = async (_req, res) => {
  try {
    const feedback = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json({ total: feedback.length, feedback });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Unable to retrieve feedback right now.' });
  }
};

export const createFeedback = async (req, res) => {
  try {
    if (!(await isFeedbackEnabled())) {
      return res.status(403).json({ message: 'Feedback submissions are currently closed.' });
    }

    const feedback = await prisma.feedback.create({
      data: {
        foodRating: req.body.foodRating,
        venueAmbienceRating: req.body.venueAmbienceRating,
        photographyRating: req.body.photographyRating,
        musicEntertainmentRating: req.body.musicEntertainmentRating,
        comment: req.body.comment,
      },
    });

    res.status(201).json({ message: 'Thank you for your feedback!', data: feedback });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ message: 'Unable to submit feedback right now.' });
  }
};