//const { use } = require("react");

// mock user profiles - just enough data to display in the connections UI
const users = new Map([
  ['1', { id: '1', name: 'Lisa', role: 'SWE Intern', school: 'Stanford University', company: 'Airbnb', city: 'San Francisco, CA', image: 'https://picsum.photos/seed/user1/100/100', connections: ['2', '3'] }],
  ['2', { id: '2', name: 'John Green', role: 'SWE Intern', school: 'University of Waterloo', company: 'Google', city: 'New York, NY', image: 'https://picsum.photos/seed/user2/100/100', connections: ['1', '3', '4', '101'] }],
  ['3', { id: '3', name: 'Priya S.', role: 'Design Intern', school: 'NYU', company: 'Figma', city: 'New York, NY', image: 'https://picsum.photos/seed/user3/100/100', connections: ['1', '2', '104'] }],
  ['4', { id: '4', name: 'Jordan K.', role: 'PM Intern', school: 'MIT', company: 'Stripe', city: 'Boston, MA', image: 'https://picsum.photos/seed/user4/100/100', connections: ['2', '101'] }],
  ['101', { id: '101', name: 'Sarah', role: 'Data Science Intern', school: 'UIUC', company: 'Google', city: 'Chicago, IL', image: 'https://picsum.photos/seed/profile1/100/100', connections: ['2', '4', '102', '103'] }],
  ['102', { id: '102', name: 'Jessica', role: 'SWE Intern', school: 'Georgia Tech', company: 'Meta', city: 'New York, NY', image: 'https://picsum.photos/seed/profile2/100/100', connections: ['101', '103'] }],
  ['103', { id: '103', name: 'Alex', role: 'PM Intern', school: 'Harvard University', company: 'Apple', city: 'Boston, MA', image: 'https://picsum.photos/seed/profile3/100/100', connections: ['101', '102'] }],
  ['104', { id: '104', name: 'Elena', role: 'UX Design Intern', school: 'RISD', company: 'Adobe', city: 'New York, NY', image: 'https://picsum.photos/seed/profile4/100/100', connections: ['3', '105'] }],
  ['105', { id: '105', name: 'Morgan', role: 'Backend Intern', school: 'UC Berkeley', company: 'Stripe', city: 'San Francisco, CA', image: 'https://picsum.photos/seed/profile5/100/100', connections: ['104'] }],
]);

function getAllUsers(){
  return users;
}
function getUserById(id) {
  return users.get(id) || { id, name: 'Unknown User', role: '', image: 'https://picsum.photos/seed/unknown/100/100' };
}

function searchUsers({ q, company, school, role, city } = {}) {
  return Array.from(users.values()).filter((u) => {
    if (q) {
      const lower = q.toLowerCase();
      const haystack = `${u.name} ${u.role} ${u.school} ${u.company}`.toLowerCase();
      if (!haystack.includes(lower)) return false;
    }
    if (company && u.company.toLowerCase() !== company.toLowerCase()) return false;
    if (school && u.school.toLowerCase() !== school.toLowerCase()) return false;
    if (role && u.role.toLowerCase() !== role.toLowerCase()) return false;
    if (city && u.city && u.city.toLowerCase() !== city.toLowerCase()) return false;
    return true;
  });
}

// connection helpers
function getConnectionDegree(userId, targetId, maxHops = 3) {
  if (userId === targetId) return 0;
  const visited = new Set([userId]);
  let frontier = [userId];

  for (let hop = 1; hop <= maxHops; hop++) {
    const nextFrontier = [];
    for (const nodeId of frontier) {
      const node = getUserById(nodeId);
      if (!node) continue;
      for (const neighbourId of node.connections) {
        if (neighbourId === targetId) return hop;
        if (!visited.has(neighbourId)) {
          visited.add(neighbourId);
          nextFrontier.push(neighbourId);
        }
      }
    }
    frontier = nextFrontier;
    if (frontier.length === 0) break;
  }
  return null;
}

function getMutualCount(userId, targetId) {
  const user = getUserById(userId);
  const target = getUserById(targetId);
  if (!user || !target) return 0;

  const userSet = new Set(user.connections);
  return target.connections.filter((id) => userSet.has(id)).length;
}

function enrichUser(user, currentUserId) {
  const { getRelationship } = require('./connectionsStore');
  const { connections, ...publicUser } = user;
  const relationship = currentUserId ? getRelationship(currentUserId, user.id) : null;
  return {
    ...publicUser,
    degree: currentUserId ? getConnectionDegree(currentUserId, user.id) : null,
    mutualCount: currentUserId ? getMutualCount(currentUserId, user.id) : 0,
    connected: relationship === 'accepted',
    connectionStatus: relationship,
  };
}

module.exports = { getUserById, searchUsers, getAllUsers, getConnectionDegree, getMutualCount, enrichUser}
