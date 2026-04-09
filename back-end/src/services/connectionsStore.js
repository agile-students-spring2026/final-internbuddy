// in-memory store for friend connections
// each connection looks like:
// { id, fromUserId, toUserId, status, createdAt }
// status is one of: 'pending', 'accepted', 'rejected'

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
      results.push(record);
    }
  }
  return results;
}

function getAcceptedForUser(userId) {
  const results = [];
  for (const record of connections.values()) {
    if (record.status !== 'accepted') continue;
    if (record.fromUserId === userId || record.toUserId === userId) {
      results.push(record);
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

module.exports = {
  connections,
  addRequest,
  getPendingForUser,
  getAcceptedForUser,
  acceptRequestById
};
