// in-memory store for friend connections
// each connection looks like:
// { id, fromUserId, toUserId, status, createdAt }
// status is one of: 'pending', 'accepted', 'rejected'

const { getUserById } = require('./usersStore');

const connections = new Map();

let nextId = 1;

function addRequest(fromUserId, toUserId) {
  const id = String(nextId++);
  const record = {
    id,
    fromUserId,
    toUserId,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  connections.set(id, record);
  return record;
}

function getPendingForUser(userId) {
  const results = [];
  for (const record of connections.values()) {
    if (record.toUserId === userId && record.status === 'pending') {
      results.push({
        ...record,
        fromUser: getUserById(record.fromUserId)
      });
    }
  }
  return results;
}

function getAcceptedForUser(userId) {
  const results = [];
  for (const record of connections.values()) {
    if (record.status !== 'accepted') continue;
    if (record.fromUserId === userId || record.toUserId === userId) {
      const otherUserId = record.fromUserId === userId ? record.toUserId : record.fromUserId;
      results.push({
        ...record,
        otherUser: getUserById(otherUserId)
      });
    }
  }
  return results;
}

function acceptRequestById(id) {
  const record = connections.get(id);
  if (!record) {
    return null;
  }
  record.status = 'accepted';
  record.acceptedAt = new Date().toISOString();
  return record;
}

function getSentForUser(userId) {
  const results = [];
  for (const record of connections.values()) {
    if (record.fromUserId === userId && record.status === 'pending') {
      results.push({
        ...record,
        toUser: getUserById(record.toUserId)
      });
    }
  }
  return results;
}

function seedConnections() {
  // user "3" sent a request to user "1" - incoming pending for user 1
  addRequest('3', '1');
  // user "4" sent a request to user "1" - another incoming pending
  addRequest('4', '1');
  // user "1" and user "2" are already friends
  const req = addRequest('1', '2');
  acceptRequestById(req.id);
}

seedConnections();

function rejectRequestById(id) {
  const record = connections.get(id);
  if (!record) return null;
  record.status = 'rejected';
  return record;
}

function deleteConnectionById(id) {
  const record = connections.get(id);
  if (!record) return null;
  connections.delete(id);
  return record;
}

module.exports = {
  connections,
  addRequest,
  getPendingForUser,
  getSentForUser,
  getAcceptedForUser,
  acceptRequestById,
  rejectRequestById,
  deleteConnectionById,
  seedConnections
};
