const profileStepOrder = require('../data/profileStepOrder');
const { getUserById } = require('./usersStore');

const accounts = new Map();
const profiles = new Map();

let nextId = 1;

// ── Events mock data ──
const events = [
  {
    id: 'e1',
    title: 'Intern Sushi Night',
    description: 'All-you-can-eat sushi with fellow interns in the city!',
    time: '7:00 PM',
    date: '2026-05-15',
    location: '123 Broadway, New York, NY',
    privacy: 'public',
    createdBy: 'u1',
  },
  {
    id: 'e2',
    title: 'Central Park Picnic',
    description: 'Bring a blanket and snacks — let\'s hang out in the park.',
    time: '12:00 PM',
    date: '2026-05-18',
    location: 'Sheep Meadow, Central Park, NY',
    privacy: 'public',
    createdBy: 'u2',
  },
  {
    id: 'e3',
    title: 'Rooftop Game Night',
    description: 'Board games, card games, and good vibes on a rooftop.',
    time: '8:00 PM',
    date: '2026-05-20',
    location: '456 W 42nd St, New York, NY',
    privacy: 'public',
    createdBy: 'u1',
  },
  {
    id: 'e4',
    title: 'Coffee & Code',
    description: 'Casual co-working session at a cafe. Bring your laptop!',
    time: '10:00 AM',
    date: '2026-05-22',
    location: 'Blue Bottle Coffee, Williamsburg, NY',
    privacy: 'public',
    createdBy: 'u3',
  },
  {
    id: 'e5',
    title: 'Sunset Run Club',
    description: 'Easy 3-mile run along the Hudson River at sunset.',
    time: '6:30 PM',
    date: '2026-05-25',
    location: 'Hudson River Park, Pier 40, NY',
    privacy: 'public',
    createdBy: 'u2',
  },
  {
    id: 'e6',
    title: 'Intern Karaoke Night',
    description: 'Sing your heart out — no judgment zone!',
    time: '9:00 PM',
    date: '2026-05-28',
    location: '789 St Marks Pl, New York, NY',
    privacy: 'public',
    createdBy: 'u3',
  },
];
let nextEventId = 7;

const userEvents = {
  hosting: [
    { id: 'h1', title: 'Sushi Night', date: 'June 12' },
    { id: 'h2', title: 'Movie Night', date: 'June 19' },
  ],
  attending: [
    { id: 'a1', title: 'Central Park Picnic', date: 'June 15' },
    { id: 'a2', title: 'Rooftop Happy Hour', date: 'June 22' },
  ],
  private: [
    { id: 'p1', title: 'Alex & Friends Dinner', host: 'Alex Chen', date: 'June 14' },
    { id: 'p2', title: 'Priya Study Session', host: 'Priya S.', date: 'June 17' },
  ],
  suggested: [
    { id: 's1', title: 'Intern Mixer NYC', date: 'June 20' },
    { id: 's2', title: 'Tech Talk @ WeWork', date: 'June 25' },
    { id: 's3', title: 'Brooklyn Foodie Tour', date: 'June 28' },
  ],
};

// ── Swipe mock data ──
const swipeProfiles = [
  {
    id: 1,
    name: 'Sarah',
    age: 21,
    major: 'Data Science @ UC Berkeley',
    internshipFull: 'Data Science Intern @ Google',
    locationFull: 'San Francisco, CA | May – Aug 2026',
    about: 'I love data, coffee, and exploring new neighborhoods. Excited to meet other interns this summer!',
    pronouns: 'she/her',
    image: 'https://picsum.photos/seed/profile1/400/500',
    interests: ['Music', 'Food', 'Reading', 'Art'],
    drinks: 'Socially',
  },
  {
    id: 2,
    name: 'Jessica',
    age: 22,
    major: 'Computer Science @ Stanford',
    internshipFull: 'Software Engineer Intern @ Meta',
    locationFull: 'San Francisco, CA | May – Aug 2026',
    about: 'Full-stack developer, startup enthusiast, love hiking and trying new restaurants around the Bay.',
    pronouns: 'she/her',
    image: 'https://picsum.photos/seed/profile2/400/500',
    interests: ['Sports', 'Party', 'Creation', 'Cafes'],
    drinks: 'Yes',
  },
  {
    id: 3,
    name: 'Alex',
    age: 23,
    major: 'Electrical Engineering @ MIT',
    internshipFull: 'Product Manager Intern @ Apple',
    locationFull: 'San Francisco, CA | May – Aug 2026',
    about: "I love building products that matter. When I'm not working, you can find me at concerts or reading sci-fi.",
    pronouns: 'they/them',
    image: 'https://picsum.photos/seed/profile3/400/500',
    interests: ['Music', 'Creation', 'Reading', 'Swimming'],
    drinks: 'No',
  },
  {
    id: 4,
    name: 'Elena',
    age: 20,
    major: 'UX/UI Design @ Cal Poly',
    internshipFull: 'UX Designer Intern @ Adobe',
    locationFull: 'San Francisco, CA | May – Aug 2026',
    about: 'Design lover and coffee enthusiast. I enjoy sketching, photography, and meeting creative people!',
    pronouns: 'she/her',
    image: 'https://picsum.photos/seed/profile4/400/500',
    interests: ['Food', 'Creation', 'Drinks', 'Photography'],
    drinks: 'Socially',
  },
  {
    id: 5,
    name: 'Morgan',
    age: 22,
    major: 'Computer Science @ UCSC',
    internshipFull: 'Backend Engineer Intern @ Stripe',
    locationFull: 'San Francisco, CA | May – Aug 2026',
    about: 'Backend optimization nerd, weekend athlete, and always down for a good game night.',
    pronouns: 'he/him',
    image: 'https://picsum.photos/seed/profile5/400/500',
    interests: ['Sports', 'Reading', 'Music', 'Gaming'],
    drinks: 'Socially',
  },
];

const swipeLikes = [];
const swipePasses = [];

const receivedRequests = [
  { id: 1, fromUserId: '3', fromUser: { name: 'Priya S.', role: 'Design Intern @ Figma', image: 'https://picsum.photos/seed/priya/100/100' } },
  { id: 2, fromUserId: '4', fromUser: { name: 'Jordan K.', role: 'PM Intern @ Stripe', image: 'https://picsum.photos/seed/jordan/100/100' } },
];
let nextSwipeRequestId = 3;

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

// ── Events functions ──
function getEvents() {
  return events;
}

function getEventById(id) {
  return events.find(e => e.id === id) || null;
}

function getUserEvents() {
  return userEvents;
}

function createEvent({ title, description, location, date, time, privacy }) {
  const newEvent = {
    id: 'e' + nextEventId++,
    title,
    description: description || '',
    location: location || '',
    date: date || '',
    time: time || '',
    privacy: privacy || 'public',
    createdBy: 'u1',
  };
  events.unshift(newEvent);
  return newEvent;
}

// ── Swipe functions ──
function getSwipeProfiles() {
  return swipeProfiles;
}

function likeProfile(profileId) {
  const profile = swipeProfiles.find(p => p.id === profileId);
  const sentRequest = {
    id: nextSwipeRequestId++,
    toUserId: profileId,
    toUser: profile ? { name: profile.name, role: profile.major, image: profile.image } : null,
  };
  swipeLikes.push(sentRequest);
  return { liked: profileId };
}

function passProfile(profileId) {
  swipePasses.push(profileId);
  return { passed: profileId };
}

function getSwipeRequests() {
  return { received: receivedRequests, sent: swipeLikes };
}

function acceptSwipeRequest(requestId) {
  const idx = receivedRequests.findIndex(r => r.id === requestId);
  if (idx === -1) return null;
  return receivedRequests.splice(idx, 1)[0];
}

function rejectSwipeRequest(requestId) {
  const idx = receivedRequests.findIndex(r => r.id === requestId);
  if (idx === -1) return null;
  return receivedRequests.splice(idx, 1)[0];
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
  getEvents,
  getEventById,
  getUserEvents,
  createEvent,
  getSwipeProfiles,
  likeProfile,
  passProfile,
  getSwipeRequests,
  acceptSwipeRequest,
  rejectSwipeRequest,
  getConversations,
  getMessages,
  sendMessage,
  createConversation,
};
