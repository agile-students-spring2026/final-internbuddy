const Connection = require('../models/Connection');
const mongoose = require('mongoose');
const { getUserById } = require('../services/usersStore');
const Conversation = require('../models/Conversation');

function mapConnectionRecord(record) {
  return {
    id: String(record._id),
    fromUserId: record.fromUserId,
    toUserId: record.toUserId,
    status: record.status,
    createdAt: record.createdAt,
    acceptedAt: record.acceptedAt,
  };
}

async function sendRequest(req, res, next) {
  const { fromUserId: rawFromUserId, toUserId: rawToUserId } = req.body;
  const fromUserId = String(rawFromUserId || '').trim();
  const toUserId = String(rawToUserId || '').trim();

  if (!fromUserId || !toUserId) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['fromUserId', 'toUserId']
    });
  }

  if (fromUserId === toUserId) {
    return res.status(400).json({ error: 'Cannot connect to yourself' });
  }

  try {
    const existing = await Connection.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existing) {
      if (existing.status === 'accepted') {
        return res.status(409).json({ error: 'Users are already connected' });
      }
      if (existing.status === 'pending') {
        return res.status(409).json({ error: 'A pending connection request already exists' });
      }
    }

    const created = await Connection.create({
      fromUserId,
      toUserId,
      status: 'pending',
    });

    const request = mapConnectionRecord(created);
    const toUser = await getUserById(toUserId);

    return res.status(201).json({
      message: 'Connection request sent',
      request: { ...request, toUser }
    });
  } catch (err) {
    return next(err);
  }
}

async function getPending(req, res, next) {
  const { userId } = req.params;

  try {
    const rows = await Connection.find({
      toUserId: String(userId),
      status: 'pending',
    }).sort({ createdAt: -1 });

    const pending = await Promise.all(
      rows.map(async (row) => {
        const record = mapConnectionRecord(row);
        return {
          ...record,
          fromUser: await getUserById(record.fromUserId),
        };
      })
    );

    return res.status(200).json({ pending });
  } catch (err) {
    return next(err);
  }
}

async function getAccepted(req, res, next) {
  const { userId } = req.params;

  try {
    const rows = await Connection.find({
      status: 'accepted',
      $or: [{ fromUserId: String(userId) }, { toUserId: String(userId) }],
    }).sort({ acceptedAt: -1, createdAt: -1 });

    const accepted = await Promise.all(
      rows.map(async (row) => {
        const record = mapConnectionRecord(row);
        const otherUserId = record.fromUserId === String(userId) ? record.toUserId : record.fromUserId;
        return {
          ...record,
          otherUser: await getUserById(otherUserId),
        };
      })
    );

    return res.status(200).json({ accepted });
  } catch (err) {
    return next(err);
  }
}

async function getSent(req, res, next) {
  const { userId } = req.params;

  try {
    const rows = await Connection.find({
      fromUserId: String(userId),
      status: 'pending',
    }).sort({ createdAt: -1 });

    const sent = await Promise.all(
      rows.map(async (row) => {
        const record = mapConnectionRecord(row);
        return {
          ...record,
          toUser: await getUserById(record.toUserId),
        };
      })
    );

    return res.status(200).json({ sent });
  } catch (err) {
    return next(err);
  }
}

async function acceptRequest(req, res, next) {
  const { requestId } = req.params;

  if (!mongoose.isValidObjectId(requestId)) {
    return res.status(404).json({ error: 'Connection request not found' });
  }

  try {
    const record = await Connection.findByIdAndUpdate(
      requestId,
      { status: 'accepted', acceptedAt: new Date() },
      { returnDocument: 'after' }
    );

    if (!record) {
      return res.status(404).json({ error: 'Connection request not found' });
    }

    const mapped = mapConnectionRecord(record);

    const fromId = new mongoose.Types.ObjectId(mapped.fromUserId);
    const toId = new mongoose.Types.ObjectId(mapped.toUserId);
    let conversation = await Conversation.findOne({
      participants: { $all: [fromId, toId], $size: 2 },
    }).lean();
    if (!conversation) {
      conversation = await Conversation.create({ participants: [fromId, toId], messages: [] });
      conversation = conversation.toObject();
    }

    return res.status(200).json({
      message: 'Connection request accepted',
      request: mapped,
      conversation: { id: String(conversation._id) },
    });
  } catch (err) {
    return next(err);
  }
}

async function rejectRequest(req, res, next) {
  const { requestId } = req.params;

  if (!mongoose.isValidObjectId(requestId)) {
    return res.status(404).json({ error: 'Connection request not found' });
  }

  try {
    const record = await Connection.findByIdAndUpdate(
      requestId,
      { status: 'rejected', acceptedAt: null },
      { returnDocument: 'after' }
    );

    if (!record) {
      return res.status(404).json({ error: 'Connection request not found' });
    }

    return res.status(200).json({
      message: 'Connection request rejected',
      request: mapConnectionRecord(record)
    });
  } catch (err) {
    return next(err);
  }
}

async function deleteConnection(req, res, next) {
  const { requestId } = req.params;

  if (!mongoose.isValidObjectId(requestId)) {
    return res.status(404).json({ error: 'Connection not found' });
  }

  try {
    const record = await Connection.findByIdAndDelete(requestId);

    if (!record) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    return res.status(200).json({
      message: 'Connection deleted',
      deleted: mapConnectionRecord(record)
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  sendRequest,
  getPending,
  getSent,
  getAccepted,
  acceptRequest,
  rejectRequest,
  deleteConnection
};
