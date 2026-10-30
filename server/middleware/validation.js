import { body, validationResult } from 'express-validator';

export const validateRSVP = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Invalid phone number format'),
  body('attendance')
    .isBoolean()
    .withMessage('Attendance must be true or false'),
];

export const validateFeedback = [
  body('foodRating').isInt({ min: 1, max: 5 }).withMessage('Food rating must be between 1 and 5').toInt(),
  body('venueAmbienceRating').isInt({ min: 1, max: 5 }).withMessage('Venue & ambience rating must be between 1 and 5').toInt(),
  body('photographyRating').isInt({ min: 1, max: 5 }).withMessage('Photography rating must be between 1 and 5').toInt(),
  body('musicEntertainmentRating').isInt({ min: 1, max: 5 }).withMessage('Music & entertainment rating must be between 1 and 5').toInt(),
  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Feedback comment is required')
    .isLength({ max: 2000 })
    .withMessage('Feedback comment must be 2000 characters or fewer'),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
