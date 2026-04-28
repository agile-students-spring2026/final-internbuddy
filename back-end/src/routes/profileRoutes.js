const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { requireAuth } = require('../middleware/authMiddleware');
const { getMyProfile, saveProfile } = require('../controllers/profileController');

const profileValidation = [
  // basic info
  body('name').optional().trim().isLength({ max: 100 }).escape(),
  body('dob').optional().isISO8601().toDate(),
  body('location').optional().trim().isLength({ max: 200 }).escape(),
  body('city').optional().trim().isLength({ max: 100 }).escape(),
  body('pronouns').optional().trim().isLength({ max: 50 }).escape(),
  body('gender').optional().trim().isLength({ max: 50 }).escape(),
  body('friendPreference').optional().trim().isLength({ max: 100 }).escape(),

  // internship / work
  body('internship').optional().trim().isLength({ max: 200 }).escape(),
  body('jobTitle').optional().trim().isLength({ max: 100 }).escape(),
  body('company').optional().trim().isLength({ max: 100 }).escape(),

  // education
  body('school').optional().trim().isLength({ max: 200 }).escape(),
  body('degree').optional().trim().isLength({ max: 100 }).escape(),
  body('major').optional().trim().isLength({ max: 100 }).escape(),

  // lifestyle
  body('lifestyle').optional().trim().isLength({ max: 100 }).escape(),
  body('drinks').optional().trim().isLength({ max: 100 }).escape(),

  // arrays
  body('meetupTypes').optional().isArray({ max: 20 }),
  body('meetupTypes.*').optional().trim().isLength({ max: 50 }).escape(),
  body('interests').optional().isArray({ max: 30 }),
  body('interests.*').optional().trim().isLength({ max: 50 }).escape(),
  body('hostingEvents').optional().isArray({ max: 50 }),
  body('hostingEvents.*').optional().trim().isLength({ max: 100 }).escape(),
  body('attendingEvents').optional().isArray({ max: 50 }),
  body('attendingEvents.*').optional().trim().isLength({ max: 100 }).escape(),

  // about / personality
  body('about').optional().trim().isLength({ max: 1000 }).escape(),
  body('personality').optional().trim().isLength({ max: 100 }).escape(),

  // onboarding state
  body('currentStep').optional().trim().isLength({ max: 50 }).escape(),
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