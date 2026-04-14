const { getSwipeProfiles } = require('../services/usersStore');

function getProfiles(req, res) {
  const currentUserId = req.headers['x-current-user-id'] || '1';
  const profiles = getSwipeProfiles(currentUserId);
  res.json(profiles);
}

module.exports = { getProfiles };
