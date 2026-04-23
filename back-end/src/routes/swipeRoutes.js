const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getProfiles,
  likeProfile,
  passProfile,
  getHistory,
  getStats,
} = require('../controllers/swipeController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateRequest');

const swipeActionValidators = [
  body('profileId').notEmpty().withMessage('profileId is required'),
];

router.get('/profiles', requireAuth, getProfiles);
router.get('/history', requireAuth, getHistory);
router.get('/stats', requireAuth, getStats);
router.post('/like', requireAuth, swipeActionValidators, validateRequest, likeProfile);
router.post('/pass', requireAuth, swipeActionValidators, validateRequest, passProfile);

module.exports = router;
