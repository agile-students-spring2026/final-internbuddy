const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedUsers = [
  {
    email: 'lisa@seed.com',
    name: 'Lisa',
    role: 'SWE Intern',
    school: 'Stanford University',
    company: 'Airbnb',
    city: 'San Francisco, CA',
    image: 'https://picsum.photos/seed/user1/100/100',
  },
  {
    email: 'john@seed.com',
    name: 'John Green',
    role: 'SWE Intern',
    school: 'University of Waterloo',
    company: 'Google',
    city: 'New York, NY',
    image: 'https://picsum.photos/seed/user2/100/100',
  },
  {
    email: 'priya@seed.com',
    name: 'Priya S.',
    role: 'Design Intern',
    school: 'NYU',
    company: 'Figma',
    city: 'New York, NY',
    image: 'https://picsum.photos/seed/user3/100/100',
  },
  {
    email: 'jordan@seed.com',
    name: 'Jordan K.',
    role: 'PM Intern',
    school: 'MIT',
    company: 'Stripe',
    city: 'Boston, MA',
    image: 'https://picsum.photos/seed/user4/100/100',
  },
  {
    email: 'sarah@seed.com',
    name: 'Sarah',
    role: 'Data Science Intern',
    school: 'UIUC',
    company: 'Google',
    city: 'Chicago, IL',
    image: 'https://picsum.photos/seed/profile1/100/100',
    swipeImage: 'https://picsum.photos/seed/profile1/400/500',
    age: 21,
    major: 'Data Science @ UIUC',
    internshipFull: 'Data Science Intern @ Google',
    locationFull: 'Chicago, IL | May – Aug 2026',
    about: 'I love data, coffee, and exploring new neighborhoods. Excited to meet other interns this summer!',
    pronouns: 'she/her',
    interests: ['Music', 'Food', 'Reading', 'Art'],
    drinks: 'Socially',
  },
  {
    email: 'jessica@seed.com',
    name: 'Jessica',
    role: 'SWE Intern',
    school: 'Georgia Tech',
    company: 'Meta',
    city: 'New York, NY',
    image: 'https://picsum.photos/seed/profile2/100/100',
    swipeImage: 'https://picsum.photos/seed/profile2/400/500',
    age: 22,
    major: 'Computer Science @ Georgia Tech',
    internshipFull: 'Software Engineer Intern @ Meta',
    locationFull: 'New York, NY | May – Aug 2026',
    about: 'Full-stack developer, startup enthusiast, love hiking and trying new restaurants around the Bay.',
    pronouns: 'she/her',
    interests: ['Sports', 'Party', 'Creation', 'Cafes'],
    drinks: 'Yes',
  },
  {
    email: 'alex@seed.com',
    name: 'Alex',
    role: 'PM Intern',
    school: 'Harvard University',
    company: 'Apple',
    city: 'Boston, MA',
    image: 'https://picsum.photos/seed/profile3/100/100',
    swipeImage: 'https://picsum.photos/seed/profile3/400/500',
    age: 23,
    major: 'Electrical Engineering @ Harvard',
    internshipFull: 'Product Manager Intern @ Apple',
    locationFull: 'Boston, MA | May – Aug 2026',
    about: "I love building products that matter. When I'm not working, you can find me at concerts or reading sci-fi.",
    pronouns: 'they/them',
    interests: ['Music', 'Creation', 'Reading', 'Swimming'],
    drinks: 'No',
  },
  {
    email: 'elena@seed.com',
    name: 'Elena',
    role: 'UX Design Intern',
    school: 'RISD',
    company: 'Adobe',
    city: 'New York, NY',
    image: 'https://picsum.photos/seed/profile4/100/100',
    swipeImage: 'https://picsum.photos/seed/profile4/400/500',
    age: 20,
    major: 'UX/UI Design @ RISD',
    internshipFull: 'UX Designer Intern @ Adobe',
    locationFull: 'New York, NY | May – Aug 2026',
    about: 'Design lover and coffee enthusiast. I enjoy sketching, photography, and meeting creative people!',
    pronouns: 'she/her',
    interests: ['Food', 'Creation', 'Drinks', 'Photography'],
    drinks: 'Socially',
  },
  {
    email: 'morgan@seed.com',
    name: 'Morgan',
    role: 'Backend Intern',
    school: 'UC Berkeley',
    company: 'Stripe',
    city: 'San Francisco, CA',
    image: 'https://picsum.photos/seed/profile5/100/100',
    swipeImage: 'https://picsum.photos/seed/profile5/400/500',
    age: 22,
    major: 'Computer Science @ UC Berkeley',
    internshipFull: 'Backend Engineer Intern @ Stripe',
    locationFull: 'San Francisco, CA | May – Aug 2026',
    about: 'Backend optimization nerd, weekend athlete, and always down for a good game night.',
    pronouns: 'he/him',
    interests: ['Sports', 'Reading', 'Music', 'Gaming'],
    drinks: 'Socially',
  },
];

const connectionMap = {
  lisa:    ['john', 'priya'],
  john:    ['lisa', 'priya', 'jordan', 'sarah'],
  priya:   ['lisa', 'john', 'elena'],
  jordan:  ['john', 'sarah'],
  sarah:   ['john', 'jordan', 'jessica', 'alex'],
  jessica: ['sarah', 'alex'],
  alex:    ['sarah', 'jessica'],
  elena:   ['priya', 'morgan'],
  morgan:  ['elena'],
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    console.log('Cleared existing users');

    const inserted = await User.insertMany(seedUsers);
    console.log(`Seeded ${inserted.length} users`);

    const idMap = {};
    inserted.forEach(u => {
      const key = u.name.split(' ')[0].toLowerCase();
      idMap[key] = u._id;
      console.log(`${u.name}: ${u._id}`);
    });

    for (const [key, connNames] of Object.entries(connectionMap)) {
      const connIds = connNames.map(n => idMap[n]).filter(Boolean);
      await User.updateOne({ _id: idMap[key] }, { $set: { connections: connIds } });
    }
    console.log('Connections wired up!');

    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();