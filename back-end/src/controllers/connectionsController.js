const {
  addRequest,
  getPendingForUser,
  getAcceptedForUser,
  acceptRequestById
} = require('../services/connectionsStore');

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
    request: record
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

function acceptRequest(req, res) {
  const { requestId } = req.params;
  const record = acceptRequestById(requestId);

  if (!record) {
    return res.status(404).json({ error: 'Connection request not found' });
  }

  return res.status(200).json({
    message: 'Connection request accepted (mock)',
    request: record
  });
}

module.exports = {
  sendRequest,
  getPending,
  getAccepted,
  acceptRequest
};
