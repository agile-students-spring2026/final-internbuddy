const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getAllEvents,
  getEventsCount,
  getEventById,
  getUserEvents,
  createEvent,
} = require('../controllers/eventsController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateRequest');

router.get('/', getAllEvents);
router.get('/count', getEventsCount);
router.get('/me', requireAuth, getUserEvents);
router.get('/:id', getEventById);

router.post(
  '/',
  requireAuth,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().isString().trim(),
    body('location').optional().isString().trim(),
    body('date').optional().isString().trim(),
    body('time').optional().isString().trim(),
    body('privacy')
      .optional()
      .isIn(['public', 'private'])
      .withMessage('Privacy must be public or private'),
  ],
  validateRequest,
  createEvent
);

module.exports = router;
