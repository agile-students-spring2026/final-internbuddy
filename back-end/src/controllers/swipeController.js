const mockStore = require('../services/mockStore');

function getProfiles(req, res) {
  const profiles = mockStore.getSwipeProfiles();
  res.json(profiles);
}

function likeProfile(req, res) {
  const { profileId } = req.body;
  if (!profileId) {
    return res.status(400).json({ error: 'profileId is required' });
  }
  const result = mockStore.likeProfile(profileId);
  res.json(result);
}

function passProfile(req, res) {
  const { profileId } = req.body;
  if (!profileId) {
    return res.status(400).json({ error: 'profileId is required' });
  }
  const result = mockStore.passProfile(profileId);
  res.json(result);
}

function getRequests(req, res) {
  const requests = mockStore.getSwipeRequests();
  res.json(requests);
}

module.exports = { getProfiles, likeProfile, passProfile, getRequests };
