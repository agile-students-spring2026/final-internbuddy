const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getConversations,
  getUnreadCount,
  getMessages,
  sendMessage,
  createConversation,
} = require('../controllers/messagesController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateRequest');

router.get('/', requireAuth, getConversations);
router.get('/unread/count', requireAuth, getUnreadCount);

router.post(
  '/',
  requireAuth,
  [body('otherUserId').notEmpty().withMessage('otherUserId is required')],
  validateRequest,
  createConversation
);

router.get('/:conversationId', requireAuth, getMessages);

router.post(
  '/:conversationId',
  requireAuth,
  [
    body('text').trim().notEmpty().withMessage('text is required'),
    body('text').isLength({ max: 2000 }).withMessage('text must be 2000 characters or fewer'),
  ],
  validateRequest,
  sendMessage
);

module.exports = router;
