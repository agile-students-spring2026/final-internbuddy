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

function acceptRequest(req, res) {
  const id = Number(req.params.id);
  const record = mockStore.acceptSwipeRequest(id);
  if (!record) {
    return res.status(404).json({ error: 'Request not found' });
  }
  const conversation = record.fromUserId
    ? mockStore.createConversation('1', record.fromUserId)
    : null;
  res.json({ message: 'Request accepted', request: record, conversation });
}

function rejectRequest(req, res) {
  const id = Number(req.params.id);
  const record = mockStore.rejectSwipeRequest(id);
  if (!record) {
    return res.status(404).json({ error: 'Request not found' });
  }
  res.json({ message: 'Request rejected', request: record });
}

module.exports = { getProfiles, likeProfile, passProfile, getRequests, acceptRequest, rejectRequest };
