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

module.exports = {
  connections,
  addRequest
};
