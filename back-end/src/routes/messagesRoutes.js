const express = require('express');
const router = express.Router();
const { getConversations, getMessages, sendMessage } = require('../controllers/messagesController');

router.get('/', getConversations);
router.get('/:conversationId', getMessages);
router.post('/:conversationId', sendMessage);

module.exports = router;
