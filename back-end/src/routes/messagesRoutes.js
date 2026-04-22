const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getConversations,
  getMessages,
  sendMessage,
  createConversation,
} = require('../controllers/messagesController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateRequest');

router.get('/', requireAuth, getConversations);

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
  [body('text').trim().notEmpty().withMessage('text is required')],
  validateRequest,
  sendMessage
);

module.exports = router;
