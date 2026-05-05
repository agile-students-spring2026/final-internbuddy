const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Profile = require('../models/Profile');

require('dotenv').config();

const seedUsers = [
  {
    email: 'lisa@seed.com',
    name: 'Lisa Chen',
    city: 'San Francisco, CA',
    major: 'Computer Science @ Stanford',
    internship: 'SWE Intern @ Airbnb',
    location: 'San Francisco, CA | May 2026 - Aug 2026',
    about:
      'Full-stack intern who loves coffee shops, design systems, and weekend hikes.',
    personality: 'ENFJ',
    interests: ['☕ Cafes', '✈️ Travel', '🎵 Concerts'],
  },
  {
    email: 'john@seed.com',
    name: 'John Green',
    city: 'New York, NY',
    major: 'Software Engineering @ Waterloo',
    internship: 'SWE Intern @ Google',
    location: 'New York, NY | Jun 2026 - Sep 2026',
    about:
      'Backend intern into distributed systems, basketball, and late-night pizza.',
    personality: 'INTJ',
    interests: ['🍕 Foodie', '🎮 Gaming', '📚 Reading'],
  },
  {
    email: 'priya@seed.com',
    name: 'Priya Shah',
    city: 'New York, NY',
    major: 'Design @ NYU',
    internship: 'Design Intern @ Figma',
    location: 'New York, NY | May 2026 - Aug 2026',
    about:
      'Product design intern. Always down for galleries, cafes, and photo walks.',
    personality: 'ISFP',
    interests: ['🎨 Art', '📷 Photography', '☕ Cafes'],
  },
];

const DEFAULT_PASSWORD = 'password123';

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 12);

    for (const seed of seedUsers) {
      // USER COLLECTION (small schema)
      const user = await User.findOneAndUpdate(
        { email: seed.email },
        {
          $setOnInsert: {
            email: seed.email,
            passwordHash,
            interests: [],
            connections: [],
          },
          $set: {
            verified: true,
            verifiedAt: new Date(),
            onboardingCompleted: true,
          },
        },
        {
          upsert: true,
          returnDocument: 'after',
          runValidators: true,
        }
      );

      // PROFILE COLLECTION (large schema)
      await Profile.findOneAndUpdate(
        { userId: user._id },
        {
          $setOnInsert: {
            userId: user._id,
            attendingEvents: [],
            hostingEvents: [],
            meetupTypes: [],
          },
          $set: {
            name: seed.name,
            about: seed.about,
            city: seed.city,
            completed: true,
            completedAt: new Date(),
            currentStep: 'resume',
            connections: 0,
            interests: seed.interests,
            major: seed.major,
            internship: seed.internship,
            location: seed.location,
            personality: seed.personality,
          },
        },
        {
          upsert: true,
          returnDocument: 'after',
          runValidators: true,
        }
      );

      console.log(`Seeded ${seed.email}`);
    }

    console.log('Finished seeding users + profiles');
    console.log(`Password for all accounts: ${DEFAULT_PASSWORD}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();