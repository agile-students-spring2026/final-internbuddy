const {
  getProfile,
  saveProfileStep,
  completeProfile,
  getAccount
} = require('../services/mockStore');

function getProfileByUserId(req, res) {
  const { userId } = req.params;
  const profile = getProfile(userId);

  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  return res.status(200).json({ profile });
}

function saveStep(req, res) {
  const { userId } = req.params;
  const { step, value } = req.body;

  if (!step) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['step', 'value']
    });
  }

  const account = getAccount(userId);
  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }

  const result = saveProfileStep(userId, step, value);
  if (!result) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  return res.status(200).json({
    message: 'Profile step saved (mock)',
    savedStep: step,
    nextStep: result.nextStep,
    profile: result.profile
  });
}

function finish(req, res) {
  const { userId } = req.params;
  const profile = completeProfile(userId);

  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  return res.status(200).json({
    message: 'Profile completed (mock)',
    profile
  });
}

module.exports = {
  getProfileByUserId,
  saveStep,
  finish
};
