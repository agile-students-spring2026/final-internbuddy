const mockStore = require('../services/mockStore');

function getConversations(req, res) {
  const conversations = mockStore.getConversations();
  res.json(conversations);
}

function getMessages(req, res) {
  const data = mockStore.getMessages(req.params.conversationId);
  if (!data) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  res.json(data);
}

function sendMessage(req, res) {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'text is required' });
  }
  const message = mockStore.sendMessage(req.params.conversationId, text);
  res.status(201).json(message);
}

function createConversation(req, res) {
  const { userId, otherUserId } = req.body;
  if (!userId || !otherUserId) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['userId', 'otherUserId'],
    });
  }
  const conversation = mockStore.createConversation(userId, otherUserId);
  res.status(201).json(conversation);
}

module.exports = { getConversations, getMessages, sendMessage, createConversation };
