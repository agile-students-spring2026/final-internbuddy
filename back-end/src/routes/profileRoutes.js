const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { requireAuth } = require('../middleware/authMiddleware');
const { getMyProfile, saveProfile } = require('../controllers/profileController');

const textField = (field, max) =>
  body(field)
    .optional()
    .trim()
    .isLength({ max })
    .withMessage(`${field} must be ${max} characters or fewer`);

const profileValidation = [
  // basic info
  textField('name', 100),
  body('dob').optional().isISO8601().toDate(),
  textField('location', 200),
  textField('city', 100),
  textField('pronouns', 50),
  textField('gender', 50),
  textField('friendPreference', 100),

  // internship / work
  textField('internship', 200),
  textField('jobTitle', 100),
  textField('company', 100),

  // education
  textField('school', 200),
  textField('degree', 100),
  textField('major', 100),

  // lifestyle
  textField('lifestyle', 100),
  textField('drinks', 100),

  // arrays
  body('meetupTypes').optional().isArray({ max: 20 }),
  body('meetupTypes.*').optional().trim().isLength({ max: 50 }),

  body('interests').optional().isArray({ max: 30 }),
  body('interests.*').optional().trim().isLength({ max: 50 }),

  body('hostingEvents').optional().isArray({ max: 50 }),
  body('hostingEvents.*').optional().trim().isLength({ max: 100 }),

  body('attendingEvents').optional().isArray({ max: 50 }),
  body('attendingEvents.*').optional().trim().isLength({ max: 100 }),

  // about / personality
  textField('about', 1000),
  textField('personality', 100),

  // onboarding state
  textField('currentStep', 50),
  body('completed').optional().isBoolean(),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/me', requireAuth, getMyProfile);
router.post('/', requireAuth, profileValidation, validate, saveProfile);

module.exports = router;