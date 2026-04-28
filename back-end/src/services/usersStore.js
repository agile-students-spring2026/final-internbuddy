const Connection = require('../models/Connection');
const User = require('../models/User');
const Profile = require('../models/Profile');

async function getUserById(id) {
  const [user, profile] = await Promise.all([
    User.findById(id).lean(),
    Profile.findOne({ userId: id }).lean(),
  ]);

  if (!user && !profile) {
    return { id: String(id), name: 'Unknown User', role: '', image: '', connections: [] };
  }

  return {
    ...(user || {}),
    ...(profile || {}),
    id: String(id),
    userId: String(id),
    name: profile?.name || user?.name || user?.email || 'Unknown User',
    role: profile?.internship || user?.role || '',
    company: user?.company || '',
    school: profile?.major || user?.school || '',
    city: profile?.city || user?.city || '',
    image: user?.image || `https://picsum.photos/seed/${id}/100/100`,
    connections: user?.connections || [],
  };
}

async function getAllUsers() {
  const profiles = await Profile.find({ completed: true }).lean();

  return profiles.map(p => ({
    id: p.userId.toString(),
    profileId: p._id.toString(),
    name: p.name || 'Unknown User',
    role: p.internship || '',
    company: '',
    school: p.major || '',
    city: p.city || p.location || '',
    about: p.about || '',
    interests: p.interests || [],
    image: `https://picsum.photos/seed/${p.userId}/100/100`,
    connections: [],
  }));
}

async function searchUsers({ q, city } = {}) {
  const query = { completed: true };

  if (q) {
    query.$or = [
      { name: new RegExp(q, 'i') },
      { major: new RegExp(q, 'i') },
      { internship: new RegExp(q, 'i') },
      { location: new RegExp(q, 'i') },
      { city: new RegExp(q, 'i') },
      { about: new RegExp(q, 'i') },
      { interests: new RegExp(q, 'i') },
      { meetupTypes: new RegExp(q, 'i') },
    ];
  }

  if (city) {
    query.city = new RegExp(city, 'i');
  }

  const profiles = await Profile.find(query).lean();

  return profiles.map(p => ({
    id: p.userId.toString(),
    profileId: p._id.toString(),
    name: p.name || 'Unknown User',
    role: p.internship || '',
    company: '',
    school: p.major || '',
    city: p.city || p.location || '',
    about: p.about || '',
    interests: p.interests || [],
    image: `https://picsum.photos/seed/${p.userId}/100/100`,
    connections: [],
  }));
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

async function getConnectionDegree(userId, targetId, maxHops = 3) {
  if (!userId || !targetId) return null;
  if (String(userId) === String(targetId)) return 0;

  const visited = new Set([String(userId)]);
  let frontier = [String(userId)];

  for (let hop = 1; hop <= maxHops; hop++) {
    const nextFrontier = [];

    for (const nodeId of frontier) {
      const node = await getUserById(nodeId);

      for (const neighbourId of node.connections || []) {
        const nId = neighbourId.toString();

        if (nId === String(targetId)) return hop;

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
  const [user, target] = await Promise.all([
    getUserById(userId),
    getUserById(targetId),
  ]);

  const userSet = new Set((user.connections || []).map(id => id.toString()));

  return (target.connections || []).filter(id =>
    userSet.has(id.toString())
  ).length;
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

async function getSwipeProfiles(currentUserId) {
  const profiles = await Profile.find({
    userId: { $ne: currentUserId },
  }).lean();

  const candidates = profiles.map(p => ({
    id: p.userId.toString(),
    profileId: p._id.toString(),
    name: p.name || 'Unknown User',
    role: p.internship || '',
    company: '',
    school: p.major || '',
    city: p.city || p.location || '',
    about: p.about || '',
    interests: p.interests || [],
    image: `https://picsum.photos/seed/${p.userId}/100/100`,
    connections: [],
  }));

  const enriched = await Promise.all(
    candidates.map(async user => ({
      user,
      relationship: await getRelationship(currentUserId, user.id),
    }))
  );

  return enriched
    .filter(item => item.relationship !== 'accepted' && item.relationship !== 'pending-outgoing')
    .map(item => item.user);
}

module.exports = {
  getUserById,
  searchUsers,
  getAllUsers,
  getConnectionDegree,
  getMutualCount,
  enrichUser,
  getSwipeProfiles,
};
