const { createAccount, verifyAccount, getAccount } = require('../services/mockStore');

function signup(req, res) {
  const { email, phone } = req.body;

  if (!email || !phone) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['email', 'phone']
    });
  }

  const account = createAccount({ email, phone });

  return res.status(201).json({
    message: 'Signup created (mock)',
    account,
    next: '/api/auth/verify'
  });
}

function verify(req, res) {
  const { userId, code } = req.body;

  if (!userId || !code) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['userId', 'code']
    });
  }

  const account = verifyAccount(userId);

  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }

  return res.status(200).json({
    message: 'Account verified (mock)',
    account,
    next: '/api/profile/:userId/step'
  });
}

function me(req, res) {
  const { userId } = req.params;
  const account = getAccount(userId);

  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }

  return res.status(200).json({ account });
}

module.exports = {
  signup,
  verify,
  me
};
