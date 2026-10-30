import prisma from '../config/database.js';

export const createFeedback = async (req, res) => {
  try {
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