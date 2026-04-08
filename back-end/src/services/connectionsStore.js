// in-memory store for friend connections
// each connection looks like:
// { id, fromUserId, toUserId, status, createdAt }
// status is one of: 'pending', 'accepted', 'rejected'

const connections = new Map();

let nextId = 1;

module.exports = {
  connections,
  nextId
};
