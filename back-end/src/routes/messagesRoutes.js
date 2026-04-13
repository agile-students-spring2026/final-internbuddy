const express = require('express');
const router = express.Router();
const { getConversations, getMessages, sendMessage, createConversation } = require('../controllers/messagesController');

router.get('/', getConversations);
router.post('/', createConversation);
router.get('/:conversationId', getMessages);
router.post('/:conversationId', sendMessage);

module.exports = router;
