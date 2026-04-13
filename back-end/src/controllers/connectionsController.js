const {
  addRequest,
  getPendingForUser,
  getSentForUser,
  getAcceptedForUser,
  acceptRequestById,
  rejectRequestById,
  deleteConnectionById
} = require('../services/connectionsStore');
const { getUserById } = require('../services/usersStore');
const { createConversation } = require('../services/mockStore');

function sendRequest(req, res) {
  const { fromUserId, toUserId } = req.body;

  if (!fromUserId || !toUserId) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['fromUserId', 'toUserId']
    });
  }

  const record = addRequest(fromUserId, toUserId);

  return res.status(201).json({
    message: 'Connection request sent (mock)',
    request: { ...record, toUser: getUserById(toUserId) }
  });
}

function getPending(req, res) {
  const { userId } = req.params;
  const pending = getPendingForUser(userId);
  return res.status(200).json({ pending });
}

function getAccepted(req, res) {
  const { userId } = req.params;
  const accepted = getAcceptedForUser(userId);
  return res.status(200).json({ accepted });
}

function getSent(req, res) {
  const { userId } = req.params;
  const sent = getSentForUser(userId);
  return res.status(200).json({ sent });
}

function acceptRequest(req, res) {
  const { requestId } = req.params;
  const record = acceptRequestById(requestId);

  if (!record) {
    return res.status(404).json({ error: 'Connection request not found' });
  }

  const conversation = createConversation(record.toUserId, record.fromUserId);

  return res.status(200).json({
    message: 'Connection request accepted (mock)',
    request: record,
    conversation,
  });
}

function rejectRequest(req, res) {
  const { requestId } = req.params;
  const record = rejectRequestById(requestId);

  if (!record) {
    return res.status(404).json({ error: 'Connection request not found' });
  }

  return res.status(200).json({
    message: 'Connection request rejected (mock)',
    request: record
  });
}

function deleteConnection(req, res) {
  const { requestId } = req.params;
  const record = deleteConnectionById(requestId);

  if (!record) {
    return res.status(404).json({ error: 'Connection not found' });
  }

  return res.status(200).json({
    message: 'Connection deleted (mock)',
    deleted: record
  });
}

module.exports = {
  sendRequest,
  getPending,
  getSent,
  getAccepted,
  acceptRequest,
  rejectRequest,
  deleteConnection
};
