const { addRequest } = require('../services/connectionsStore');

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

module.exports = {
  sendRequest
};
