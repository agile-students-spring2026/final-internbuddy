const profileStepOrder = require('../data/profileStepOrder');
const { getUserById } = require('./usersStore');

const accounts = new Map();
const profiles = new Map();

let nextId = 1;

// ── Messages mock data ──
const conversations = [
  {
    id: 'c1',
    otherUser: {
      id: '2',
      name: 'John Green',
      username: 'jgreen',
      avatar: 'https://picsum.photos/seed/jgreen/100/100',
      subtitle: 'SWE Intern @ Google',
    },
    lastMessage: "Sounds good, let's figure something out this week.",
    timestamp: '2h',
    unreadCount: 1,
  },
  {
    id: 'c2',
    otherUser: {
      id: '200',
      name: 'Elon Musk',
      username: 'emusk',
      avatar: 'https://picsum.photos/seed/emusk/100/100',
      subtitle: 'PM Intern @ Amazon',
    },
    lastMessage: "I'm down to grab coffee after work.",
    timestamp: '1d',
    unreadCount: 0,
  },
  {
    id: 'c3',
    otherUser: {
      id: '201',
      name: 'Andy Jassy',
      username: 'ajassy',
      avatar: 'https://picsum.photos/seed/ajassy/100/100',
      subtitle: 'CS @ NYU',
    },
    lastMessage: 'Are you going to the intern meetup?',
    timestamp: '3d',
    unreadCount: 0,
  },
];

let nextConversationId = 4;

const messagesByConversation = {
  c1: [
    { id: 1, sender: 'them', text: 'Hey! Are you free later this week?' },
    { id: 2, sender: 'me', text: "Yeah probably, what's up?" },
    { id: 3, sender: 'them', text: 'Wanted to grab coffee and talk internships.' },
    { id: 4, sender: 'me', text: "I'm down." },
    { id: 5, sender: 'them', text: "Sounds good, let's figure something out this week." },
  ],
  c2: [
    { id: 1, sender: 'them', text: 'Hey! Saw you are interning in NYC too.' },
    { id: 2, sender: 'me', text: 'Yeah! Where are you working?' },
    { id: 3, sender: 'them', text: "I'm down to grab coffee after work." },
  ],
  c3: [
    { id: 1, sender: 'them', text: 'Are you going to the intern meetup?' },
  ],
};

function createAccount({ email, phone }) {
  const userId = String(nextId++);
  const account = {
    userId,
    email,
    phone,
    verified: false,
    createdAt: new Date().toISOString()
  };

  const profileDraft = {
    userId,
    steps: {},
    completed: false,
    updatedAt: new Date().toISOString()
  };

  accounts.set(userId, account);
  profiles.set(userId, profileDraft);

  return account;
}

function getAccount(userId) {
  return accounts.get(userId) || null;
}

function verifyAccount(userId) {
  const account = accounts.get(userId);
  if (!account) {
    return null;
  }

  account.verified = true;
  account.verifiedAt = new Date().toISOString();
  return account;
}

function findAccountByEmail(email) {
  for (const account of accounts.values()) {
    if (account.email.toLowerCase() === email.toLowerCase()) {
      return account;
    }
  }
  return null;
}

function saveProfileStep(userId, step, value) {
  const profile = profiles.get(userId);
  if (!profile) {
    return null;
  }

  profile.steps[step] = value;
  profile.updatedAt = new Date().toISOString();

  const currentStepIndex = profileStepOrder.indexOf(step);
  const nextStep = currentStepIndex >= 0 ? profileStepOrder[currentStepIndex + 1] || null : null;

  return {
    profile,
    nextStep
  };
}

function getProfile(userId) {
  return profiles.get(userId) || null;
}

function completeProfile(userId) {
  const profile = profiles.get(userId);
  if (!profile) {
    return null;
  }

  profile.completed = true;
  profile.completedAt = new Date().toISOString();
  return profile;
}

// ── Messages functions ──
function getConversations() {
  return conversations;
}

function getMessages(conversationId) {
  const convo = conversations.find(c => c.id === conversationId);
  if (!convo) return null;
  return {
    conversation: convo,
    messages: messagesByConversation[conversationId] || [],
  };
}

function sendMessage(conversationId, text) {
  if (!messagesByConversation[conversationId]) {
    messagesByConversation[conversationId] = [];
  }
  const msgs = messagesByConversation[conversationId];
  const newMsg = {
    id: msgs.length + 1,
    sender: 'me',
    text,
  };
  msgs.push(newMsg);

  const convo = conversations.find(c => c.id === conversationId);
  if (convo) {
    convo.lastMessage = text;
    convo.timestamp = 'now';
  }
  return newMsg;
}

function createConversation(currentUserId, otherUserId) {
  const existing = conversations.find(c => c.otherUser.id === otherUserId);
  if (existing) return existing;

  const userInfo = getUserById(otherUserId);
  const convoId = `c${nextConversationId++}`;
  const newConvo = {
    id: convoId,
    otherUser: {
      id: otherUserId,
      name: userInfo.name,
      username: userInfo.name.toLowerCase().replaceAll(' ', ''),
      avatar: userInfo.image,
      subtitle: userInfo.role,
    },
    lastMessage: '',
    timestamp: 'now',
    unreadCount: 0,
  };

  conversations.push(newConvo);
  messagesByConversation[convoId] = [];
  return newConvo;
}

module.exports = {
  createAccount,
  getAccount,
  findAccountByEmail,
  verifyAccount,
  saveProfileStep,
  getProfile,
  completeProfile,
  getConversations,
  getMessages,
  sendMessage,
  createConversation,
};
