const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const Profile = require('../models/Profile');

async function buildOtherUserSummary(otherUserId) {
  const [user, profile] = await Promise.all([
    User.findById(otherUserId).lean(),
    Profile.findOne({ userId: otherUserId }).lean(),
  ]);

  if (!user) {
    return {
      id: String(otherUserId),
      name: 'Unknown User',
      username: '',
      avatar: `https://picsum.photos/seed/${otherUserId}/100/100`,
      subtitle: '',
    };
  }

  const displayName =
    (profile && profile.name) || (user.email ? user.email.split('@')[0] : 'User');
  const subtitleParts = [];
  if (profile) {
    if (profile.jobTitle || profile.company) {
      subtitleParts.push(
        [profile.jobTitle, profile.company].filter(Boolean).join(' @ ')
      );
    } else if (profile.school) {
      subtitleParts.push(profile.school);
    }
  }

  return {
    id: String(user._id),
    name: displayName,
    username: user.email ? user.email.split('@')[0] : '',
    avatar: (profile && (profile.image || profile.swipeImage)) ||
      `https://picsum.photos/seed/${user._id}/100/100`,
    subtitle: subtitleParts.join(' · '),
  };
}

function formatTimestamp(date) {
  if (!date) return '';
  const now = Date.now();
  const diffMs = now - new Date(date).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'now';
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d`;
}

async function getConversations(req, res, next) {
  try {
    const userId = req.auth.userId;
    const myObjectId = new mongoose.Types.ObjectId(userId);

    const convos = await Conversation.find({ participants: myObjectId })
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .lean();

    const results = await Promise.all(
      convos.map(async (c) => {
        const otherUserId = (c.participants || []).find(
          (p) => String(p) !== String(userId)
        );
        const otherUser = await buildOtherUserSummary(otherUserId);
        return {
          id: String(c._id),
          otherUser,
          lastMessage: c.lastMessage || '',
          timestamp: formatTimestamp(c.lastMessageAt || c.updatedAt),
          unreadCount: 0,
        };
      })
    );

    return res.status(200).json(results);
  } catch (err) {
    return next(err);
  }
}

async function getMessages(req, res, next) {
  try {
    const userId = req.auth.userId;
    const { conversationId } = req.params;

    if (!mongoose.isValidObjectId(conversationId)) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const convo = await Conversation.findById(conversationId).lean();
    if (!convo) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const isParticipant = (convo.participants || []).some(
      (p) => String(p) === String(userId)
    );
    if (!isParticipant) {
      return res.status(403).json({ error: 'Not a participant in this conversation' });
    }

    const otherUserId = (convo.participants || []).find(
      (p) => String(p) !== String(userId)
    );
    const otherUser = await buildOtherUserSummary(otherUserId);

    const messages = (convo.messages || []).map((m) => ({
      id: String(m._id),
      sender: String(m.sender) === String(userId) ? 'me' : 'them',
      text: m.text,
      createdAt: m.createdAt,
    }));

    return res.status(200).json({
      conversation: {
        id: String(convo._id),
        otherUser,
        lastMessage: convo.lastMessage || '',
        timestamp: formatTimestamp(convo.lastMessageAt || convo.updatedAt),
        unreadCount: 0,
      },
      messages,
    });
  } catch (err) {
    return next(err);
  }
}

async function sendMessage(req, res, next) {
  try {
    const userId = req.auth.userId;
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!mongoose.isValidObjectId(conversationId)) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const convo = await Conversation.findById(conversationId);
    if (!convo) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const isParticipant = (convo.participants || []).some(
      (p) => String(p) === String(userId)
    );
    if (!isParticipant) {
      return res.status(403).json({ error: 'Not a participant in this conversation' });
    }

    const message = {
      sender: userId,
      text,
    };
    convo.messages.push(message);
    convo.lastMessage = text;
    convo.lastMessageAt = new Date();
    await convo.save();

    const saved = convo.messages[convo.messages.length - 1];

    return res.status(201).json({
      id: String(saved._id),
      sender: 'me',
      text: saved.text,
      createdAt: saved.createdAt,
    });
  } catch (err) {
    return next(err);
  }
}

async function createConversation(req, res, next) {
  try {
    const userId = req.auth.userId;
    const { otherUserId } = req.body;

    if (String(otherUserId) === String(userId)) {
      return res.status(400).json({ error: 'Cannot create a conversation with yourself' });
    }

    if (!mongoose.isValidObjectId(otherUserId)) {
      return res.status(400).json({ error: 'Invalid otherUserId' });
    }

    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ error: 'Other user not found' });
    }

    const myObjectId = new mongoose.Types.ObjectId(userId);
    const otherObjectId = new mongoose.Types.ObjectId(otherUserId);

    let convo = await Conversation.findOne({
      participants: { $all: [myObjectId, otherObjectId], $size: 2 },
    });

    if (!convo) {
      convo = await Conversation.create({
        participants: [myObjectId, otherObjectId],
        messages: [],
      });
    }

    const otherUserSummary = await buildOtherUserSummary(otherObjectId);

    return res.status(201).json({
      id: String(convo._id),
      otherUser: otherUserSummary,
      lastMessage: convo.lastMessage || '',
      timestamp: formatTimestamp(convo.lastMessageAt || convo.updatedAt || convo.createdAt),
      unreadCount: 0,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getConversations,
  getMessages,
  sendMessage,
  createConversation,
};
