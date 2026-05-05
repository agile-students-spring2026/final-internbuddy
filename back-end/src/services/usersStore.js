const Connection = require('../models/Connection');
const User = require('../models/User');
const Profile = require('../models/Profile');

const ROLE_SYNONYMS = {
  'swe intern': ['software', 'engineer', 'developer', 'frontend', 'backend', 'fullstack', 'full-stack'],
  'pm intern': ['product manager', 'product management', 'program manager'],
  'design': ['designer', 'ux', 'ui', 'product design'],
  'data': ['data science', 'data analyst', 'machine learning', 'ml', 'analytics'],
  'finance': ['investment', 'banking', 'accounting', 'quant'],
  'marketing': ['growth', 'brand', 'content', 'social media'],
}

function expandQuery(q) {
  if (!q) return [q]
  const lower = q.toLowerCase().trim()
  for (const [key, synonyms] of Object.entries(ROLE_SYNONYMS)) {
    if (lower === key || synonyms.includes(lower)) {
      return [q, ...synonyms, key]
    }
  }
  return [q]
}

async function getUserById(id) {
  const [user, profile] = await Promise.all([
    User.findById(id).select('-passwordHash').lean(),
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

async function searchUsers({ q, company, school, role, city } = {}) {
  const query = { completed: true };

  if (q) {
    const terms = expandQuery(q)
    const termRegexes = terms.map(t => new RegExp(t, 'i'))

    query.$or = termRegexes.flatMap(regex => [
      { name: regex },
      { major: regex },
      { internship: regex },
      { location: regex },
      { city: regex },
      { about: regex },
      { interests: regex },
      { meetupTypes: regex },
    ])
  }

  if (city) query.city = new RegExp(city, 'i')

  if (company) {
    const companies = company.split(',').map(c => c.trim()).filter(Boolean)
    if (companies.length) query.internship = { $in: companies.map(c => new RegExp(c, 'i')) }
  }

  if (school) {
    const schools = school.split(',').map(s => s.trim()).filter(Boolean)
    if (schools.length) query.major = { $in: schools.map(s => new RegExp(s, 'i')) }
  }

  if (role) {
    const roles = role.split(',').map(r => r.trim()).filter(Boolean)
    const expandedRoles = [...new Set(roles.flatMap(r => expandQuery(r)))]
    const roleRegexes = expandedRoles.map(r => new RegExp(r, 'i'))

    if (!query.$or) {
      query.$or = roleRegexes.map(regex => ({ internship: regex }))
    } else {
      query.$and = [
        { $or: query.$or },
        { $or: roleRegexes.map(regex => ({ internship: regex })) }
      ]
      delete query.$or
    }
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
    major: p.major || '',
    internshipFull: p.internship || '',
    locationFull: p.city || p.location || '',
    about: p.about || '',
    pronouns: p.pronouns || '',
    drinks: p.drinks || '',
    interests: p.interests || [],
    image: p.image || '',
    swipeImage: p.swipeImage || p.image || '',
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