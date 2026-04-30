const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Connection = require('../models/Connection');
require('dotenv').config();

const seedUsers = [
  {
    email: 'lisa@seed.com',
    name: 'Lisa Chen',
    role: 'SWE Intern',
    school: 'Stanford University',
    company: 'Airbnb',
    city: 'San Francisco, CA',
    image: 'https://picsum.photos/seed/lisa/100/100',
    swipeImage: 'https://picsum.photos/seed/lisa/400/500',
    major: 'Computer Science @ Stanford',
    internship: 'SWE Intern @ Airbnb',
    location: 'San Francisco, CA | May 2026 - Aug 2026',
    about: 'Full-stack intern who loves coffee shops, design systems, and weekend hikes.',
    pronouns: 'she/her',
    interests: ['☕ Cafes', '✈️ Travel', '🎵 Concerts'],
  },
  {
    email: 'john@seed.com',
    name: 'John Green',
    role: 'SWE Intern',
    school: 'University of Waterloo',
    company: 'Google',
    city: 'New York, NY',
    image: 'https://picsum.photos/seed/john/100/100',
    swipeImage: 'https://picsum.photos/seed/john/400/500',
    major: 'Software Engineering @ Waterloo',
    internship: 'SWE Intern @ Google',
    location: 'New York, NY | Jun 2026 - Sep 2026',
    about: 'Backend intern into distributed systems, basketball, and late-night pizza.',
    pronouns: 'he/him',
    interests: ['🍕 Foodie', '🎮 Gaming', '📚 Reading'],
  },
  {
    email: 'priya@seed.com',
    name: 'Priya Shah',
    role: 'Design Intern',
    school: 'NYU',
    company: 'Figma',
    city: 'New York, NY',
    image: 'https://picsum.photos/seed/priya/100/100',
    swipeImage: 'https://picsum.photos/seed/priya/400/500',
    major: 'Design @ NYU',
    internship: 'Design Intern @ Figma',
    location: 'New York, NY | May 2026 - Aug 2026',
    about: 'Product design intern. Always down for galleries, cafes, and photo walks.',
    pronouns: 'she/her',
    interests: ['🎨 Art', '📷 Photography', '☕ Cafes'],
  },
  {
    email: 'jordan@seed.com',
    name: 'Jordan Kim',
    role: 'PM Intern',
    school: 'MIT',
    company: 'Stripe',
    city: 'Boston, MA',
    image: 'https://picsum.photos/seed/jordan/100/100',
    swipeImage: 'https://picsum.photos/seed/jordan/400/500',
    major: 'Computer Science + Econ @ MIT',
    internship: 'PM Intern @ Stripe',
    location: 'Boston, MA | May 2026 - Aug 2026',
    about: 'PM intern interested in fintech, startups, and good ramen spots.',
    pronouns: 'they/them',
    interests: ['🍕 Foodie', '🎤 Karaoke', '📚 Reading'],
  },
  {
    email: 'sarah@seed.com',
    name: 'Sarah Lee',
    role: 'Data Science Intern',
    school: 'UIUC',
    company: 'Google',
    city: 'Chicago, IL',
    image: 'https://picsum.photos/seed/sarah/100/100',
    swipeImage: 'https://picsum.photos/seed/sarah/400/500',
    major: 'Data Science @ UIUC',
    internship: 'Data Science Intern @ Google',
    location: 'Chicago, IL | May 2026 - Aug 2026',
    about: 'Data intern who likes coffee, concerts, and exploring new neighborhoods.',
    pronouns: 'she/her',
    interests: ['🎵 Concerts', '☕ Cafes', '📚 Reading'],
  },
  {
    email: 'alex@seed.com',
    name: 'Alex Rivera',
    role: 'Backend Intern',
    school: 'UC Berkeley',
    company: 'Stripe',
    city: 'San Francisco, CA',
    image: 'https://picsum.photos/seed/alex/100/100',
    swipeImage: 'https://picsum.photos/seed/alex/400/500',
    major: 'Computer Science @ UC Berkeley',
    internship: 'Backend Intern @ Stripe',
    location: 'San Francisco, CA | Jun 2026 - Sep 2026',
    about: 'Backend optimization nerd. Also into climbing, gaming, and run clubs.',
    pronouns: 'he/him',
    interests: ['🧗 Climbing', '🎮 Gaming', '🎾 Tennis'],
  },
];

const acceptedConnections = [
  ['lisa', 'john'],
  ['lisa', 'priya'],
  ['john', 'jordan'],
  ['john', 'sarah'],
  ['priya', 'jordan'],
  ['sarah', 'alex'],
];

const pendingConnections = [
  ['alex', 'lisa'],
  ['jordan', 'alex'],
];

function firstKey(name) {
  return name.split(' ')[0].toLowerCase();
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Connection.deleteMany({});
    await Profile.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared users, profiles, and connections');

    const usersToInsert = seedUsers.map((u) => ({
      email: u.email,
      verified: true,
      verifiedAt: new Date(),
      onboardingCompleted: true,
      image: u.image,
      swipeImage: u.swipeImage,
      interests: u.interests || [],
      connections: [],
    }));

    const insertedUsers = await User.insertMany(usersToInsert);
    console.log(`Seeded ${insertedUsers.length} users`);

    const idMap = {};
    insertedUsers.forEach((user, i) => {
      const key = firstKey(seedUsers[i].name);
      idMap[key] = user._id;
      console.log(`${seedUsers[i].name}: ${user._id}`);
    });

    const profileDocs = insertedUsers.map((user, i) => {
      const seed = seedUsers[i];

      return {
        userId: user._id,
        name: seed.name,
        about: seed.about,
        city: seed.city,
        completed: true,
        completedAt: new Date(),
        currentStep: 'resume',
        connections: 0,
        interests: seed.interests || [],
        meetupTypes: [],
        attendingEvents: [],
        hostingEvents: [],
        major: seed.major,
        internship: seed.internship,
        location: seed.location,
        pronouns: seed.pronouns || '',
      };
    });

    await Profile.insertMany(profileDocs);
    console.log(`Seeded ${profileDocs.length} profiles`);

    const connectionDocs = [];

    for (const [fromKey, toKey] of acceptedConnections) {
      connectionDocs.push({
        fromUserId: String(idMap[fromKey]),
        toUserId: String(idMap[toKey]),
        status: 'accepted',
        acceptedAt: new Date(),
      });
    }

    for (const [fromKey, toKey] of pendingConnections) {
      connectionDocs.push({
        fromUserId: String(idMap[fromKey]),
        toUserId: String(idMap[toKey]),
        status: 'pending',
      });
    }

    await Connection.insertMany(connectionDocs);
    console.log(`Seeded ${connectionDocs.length} connection records`);

    const acceptedMap = {};

    for (const [fromKey, toKey] of acceptedConnections) {
      const fromId = String(idMap[fromKey]);
      const toId = String(idMap[toKey]);

      if (!acceptedMap[fromId]) acceptedMap[fromId] = new Set();
      if (!acceptedMap[toId]) acceptedMap[toId] = new Set();

      acceptedMap[fromId].add(toId);
      acceptedMap[toId].add(fromId);
    }

    for (const [userId, connectionSet] of Object.entries(acceptedMap)) {
      const connectionIds = [...connectionSet];

      await User.findByIdAndUpdate(userId, {
        $set: { connections: connectionIds },
      });

      await Profile.findOneAndUpdate(
        { userId },
        { $set: { connections: connectionIds.length } }
      );
    }

    console.log('Updated User.connections and Profile.connections counts');

    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();