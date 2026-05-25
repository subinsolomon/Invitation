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

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
