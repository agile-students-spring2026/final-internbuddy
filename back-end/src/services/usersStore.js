//const { use } = require("react");
//Both search and swipe read from here now
const Connection = require('../models/Connection');

// mock user profiles for connections UI
const users = new Map([
  // these are not swipable cuz they're already connected (and lisa is us) so i didn't add all the new info for them bc time consuming, but in production we would have all the fields for all users yeah
  ['1', { id: '1', name: 'Lisa', role: 'SWE Intern', school: 'Stanford University', company: 'Airbnb', city: 'San Francisco, CA', image: 'https://picsum.photos/seed/user1/100/100', connections: ['2', '3'] }],
  ['2', { id: '2', name: 'John Green', role: 'SWE Intern', school: 'University of Waterloo', company: 'Google', city: 'New York, NY', image: 'https://picsum.photos/seed/user2/100/100', connections: ['1', '3', '4', '101'] }],
  ['3', { id: '3', name: 'Priya S.', role: 'Design Intern', school: 'NYU', company: 'Figma', city: 'New York, NY', image: 'https://picsum.photos/seed/user3/100/100', connections: ['1', '2', '104'] }],
  ['4', { id: '4', name: 'Jordan K.', role: 'PM Intern', school: 'MIT', company: 'Stripe', city: 'Boston, MA', image: 'https://picsum.photos/seed/user4/100/100', connections: ['2', '101'] }],
  ['101', { id: '101', name: 'Sarah', role: 'Data Science Intern', school: 'UIUC', company: 'Google', city: 'Chicago, IL', image: 'https://picsum.photos/seed/profile1/100/100', swipeImage: 'https://picsum.photos/seed/profile1/400/500', connections: ['2', '4', '102', '103'], age: 21, major: 'Data Science @ UIUC', internshipFull: 'Data Science Intern @ Google', locationFull: 'Chicago, IL | May – Aug 2026', about: 'I love data, coffee, and exploring new neighborhoods. Excited to meet other interns this summer!', pronouns: 'she/her', interests: ['Music', 'Food', 'Reading', 'Art'], drinks: 'Socially' }],
  ['102', { id: '102', name: 'Jessica', role: 'SWE Intern', school: 'Georgia Tech', company: 'Meta', city: 'New York, NY', image: 'https://picsum.photos/seed/profile2/100/100', swipeImage: 'https://picsum.photos/seed/profile2/400/500', connections: ['101', '103'], age: 22, major: 'Computer Science @ Georgia Tech', internshipFull: 'Software Engineer Intern @ Meta', locationFull: 'New York, NY | May – Aug 2026', about: 'Full-stack developer, startup enthusiast, love hiking and trying new restaurants around the Bay.', pronouns: 'she/her', interests: ['Sports', 'Party', 'Creation', 'Cafes'], drinks: 'Yes' }],
  ['103', { id: '103', name: 'Alex', role: 'PM Intern', school: 'Harvard University', company: 'Apple', city: 'Boston, MA', image: 'https://picsum.photos/seed/profile3/100/100', swipeImage: 'https://picsum.photos/seed/profile3/400/500', connections: ['101', '102'], age: 23, major: 'Electrical Engineering @ Harvard', internshipFull: 'Product Manager Intern @ Apple', locationFull: 'Boston, MA | May – Aug 2026', about: "I love building products that matter. When I'm not working, you can find me at concerts or reading sci-fi.", pronouns: 'they/them', interests: ['Music', 'Creation', 'Reading', 'Swimming'], drinks: 'No' }],
  ['104', { id: '104', name: 'Elena', role: 'UX Design Intern', school: 'RISD', company: 'Adobe', city: 'New York, NY', image: 'https://picsum.photos/seed/profile4/100/100', swipeImage: 'https://picsum.photos/seed/profile4/400/500', connections: ['3', '105'], age: 20, major: 'UX/UI Design @ RISD', internshipFull: 'UX Designer Intern @ Adobe', locationFull: 'New York, NY | May – Aug 2026', about: 'Design lover and coffee enthusiast. I enjoy sketching, photography, and meeting creative people!', pronouns: 'she/her', interests: ['Food', 'Creation', 'Drinks', 'Photography'], drinks: 'Socially' }],
  ['105', { id: '105', name: 'Morgan', role: 'Backend Intern', school: 'UC Berkeley', company: 'Stripe', city: 'San Francisco, CA', image: 'https://picsum.photos/seed/profile5/100/100', swipeImage: 'https://picsum.photos/seed/profile5/400/500', connections: ['104'], age: 22, major: 'Computer Science @ UC Berkeley', internshipFull: 'Backend Engineer Intern @ Stripe', locationFull: 'San Francisco, CA | May – Aug 2026', about: 'Backend optimization nerd, weekend athlete, and always down for a good game night.', pronouns: 'he/him', interests: ['Sports', 'Reading', 'Music', 'Gaming'], drinks: 'Socially' }],
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
    degree: currentUserId ? getConnectionDegree(currentUserId, user.id) : null,
    mutualCount: currentUserId ? getMutualCount(currentUserId, user.id) : 0,
    connected: relationship === 'accepted',
    connectionStatus: relationship,
  };
}

// returns swipe-ready profiles, filtered by connection status
async function getSwipeProfiles(currentUserId) {
  const swipeCandidates = Array.from(users.values())
    .filter((u) => u.swipeImage)
    .filter((u) => u.id !== currentUserId);

  const enriched = await Promise.all(
    swipeCandidates.map(async (user) => ({
      user,
      relationship: await getRelationship(currentUserId, user.id),
    }))
  );

  return enriched
    .filter((item) => item.relationship !== 'accepted' && item.relationship !== 'pending-outgoing')
    .map((item) => item.user);
}

module.exports = { getUserById, searchUsers, getAllUsers, getConnectionDegree, getMutualCount, enrichUser, getSwipeProfiles }
