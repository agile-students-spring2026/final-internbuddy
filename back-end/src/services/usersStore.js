//const { use } = require("react");
//Both search and swipe read from here now
const Connection = require('../models/Connection');
const User = require('../models/User');

async function getUserById(id) {
  const user = await User.findById(id).lean();
  if (!user) return { id, name: 'Unknown User', role: '', image: '' };
  return { ...user, id: user._id.toString() };
}

async function getAllUsers() {
  const users = await User.find().lean();
  return users.map(u => ({ ...u, id: u._id.toString() }));
}

async function searchUsers({ q, company, school, role, city } = {}) {
  const query = {};
  if (q) query.$text = { $search: q };
  if (company) query.company = new RegExp(company, 'i');
  if (school) query.school = new RegExp(school, 'i');
  if (role) query.role = new RegExp(role, 'i');
  if (city) query.city = new RegExp(city, 'i');
  const users = await User.find(query).lean();
  return users.map(u => ({ ...u, id: u._id.toString() }));
}

// connection helpers
async function getConnectionDegree(userId, targetId, maxHops = 3) {
  if (userId === targetId) return 0;
  const visited = new Set([userId]);
  let frontier = [userId];

  for (let hop = 1; hop <= maxHops; hop++) {
    const nextFrontier = [];
    for (const nodeId of frontier) {
      const node = await getUserById(nodeId);
      if (!node) continue;
      for (const neighbourId of (node.connections || [])) {
        const nId = neighbourId.toString();
        if (nId === targetId) return hop;
        if (!visited.has(nId)) {
          visited.add(nId);
          nextFrontier.push(nId);
        }
      }
    }
    frontier = nextFrontier;
    if (frontier.length === 0) break;
  }
  return null;
}

async function getMutualCount(userId, targetId) {
  const [user, target] = await Promise.all([getUserById(userId), getUserById(targetId)]);
  if (!user || !target) return 0;
  const userSet = new Set((user.connections || []).map(id => id.toString()));
  return (target.connections || []).filter(id => userSet.has(id.toString())).length;
}

async function getRelationship(currentUserId, otherUserId) {
  const relationship = await Connection.findOne({
    $or: [
      { fromUserId: String(currentUserId), toUserId: String(otherUserId) },
      { fromUserId: String(otherUserId), toUserId: String(currentUserId) },
    ],
  }).lean();

  if (!relationship) return null;
  if (relationship.status === 'accepted') return 'accepted';
  if (relationship.status === 'pending') {
    return relationship.toUserId === String(currentUserId)
      ? 'pending-incoming'
      : 'pending-outgoing';
  }
  return null;
}

async function enrichUser(user, currentUserId) {
  const { connections, ...publicUser } = user;
  const relationship = currentUserId
    ? await getRelationship(currentUserId, user.id)
    : null;
  return {
    ...publicUser,
    degree: currentUserId ? await getConnectionDegree(currentUserId, user.id) : null,
    mutualCount: currentUserId ? await getMutualCount(currentUserId, user.id) : 0,
    connected: relationship === 'accepted',
    connectionStatus: relationship,
  };
}

// returns swipe-ready profiles, filtered by connection status
async function getSwipeProfiles(currentUserId) {
  const users = await User.find({ _id: { $ne: currentUserId }, swipeImage: { $exists: true } }).lean();
  const candidates = users.map(u => ({ ...u, id: u._id.toString() }));

  const enriched = await Promise.all(
    candidates.map(async (user) => ({
      user,
      relationship: await getRelationship(currentUserId, user.id),
    }))
  );

  return enriched
    .filter(item => item.relationship !== 'accepted' && item.relationship !== 'pending-outgoing')
    .map(item => item.user);
}

module.exports = { getUserById, searchUsers, getAllUsers, getConnectionDegree, getMutualCount, enrichUser, getSwipeProfiles }
