require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

const firstNameByLetter = {
  a: 'Audrey',
  b: 'Brandon',
  c: 'Cameron',
  d: 'Dylan',
  e: 'Emma',
  f: 'Felix',
  g: 'Grace',
  h: 'Hannah',
  i: 'Isaac',
  j: 'Jasmine',
  k: 'Kevin',
  l: 'Liam',
  m: 'Maya',
  n: 'Noah',
  o: 'Olivia',
  p: 'Priya',
  q: 'Quinn',
  r: 'Ryan',
  s: 'Sophia',
  t: 'Tyler',
  u: 'Uma',
  v: 'Victoria',
  w: 'William',
  x: 'Xavier',
  y: 'Yasmin',
  z: 'Zoe',
};

const lastNames = [
  'Anderson', 'Brown', 'Chang', 'Davis', 'Edwards', 'Flores', 'Garcia', 'Hughes',
  'Ibrahim', 'Johnson', 'Kim', 'Lopez', 'Martinez', 'Nguyen', 'Owens', 'Patel',
  'Quintero', 'Robinson', 'Singh', 'Taylor', 'Usman', 'Vasquez', 'Williams', 'Xu',
  'Young', 'Zimmerman'
];

const mbtiTypes = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

const activityPool = [
  'Coffee Chats', 'Group Lunches', 'Basketball', 'Tennis', 'Running', 'Hiking',
  'Karaoke', 'Board Games', 'Movie Nights', 'Photography Walks', 'Coding Meetups',
  'Museum Visits', 'Brunch', 'Live Music', 'Gym Sessions', 'Volunteering'
];

const interestPool = [
  'Music', 'Food', 'Travel', 'Gaming', 'Photography', 'Reading', 'Fitness', 'Tech',
  'Design', 'Art', 'Startups', 'Finance', 'Movies', 'Hiking', 'Sports', 'Cooking'
];

const majorPool = [
  'Computer Science', 'Data Science', 'Information Systems', 'Electrical Engineering',
  'Mechanical Engineering', 'Business Analytics', 'Economics', 'Design',
  'Product Design', 'Statistics'
];

const rolePool = [
  'Software Engineer Intern',
  'Product Manager Intern',
  'Data Science Intern',
  'UX Design Intern',
  'Frontend Engineer Intern',
  'Backend Engineer Intern',
  'Security Engineer Intern',
  'Cloud Engineer Intern'
];

const companyPool = [
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Stripe', 'Airbnb', 'NVIDIA',
  'Salesforce', 'Adobe', 'Uber', 'LinkedIn'
];

const cityPool = [
  { city: 'New York', state: 'NY' },
  { city: 'San Francisco', state: 'CA' },
  { city: 'Seattle', state: 'WA' },
  { city: 'Los Angeles', state: 'CA' },
  { city: 'Chicago', state: 'IL' },
  { city: 'Austin', state: 'TX' },
  { city: 'Boston', state: 'MA' },
  { city: 'Atlanta', state: 'GA' },
  { city: 'Washington', state: 'DC' },
  { city: 'Denver', state: 'CO' },
  { city: 'Miami', state: 'FL' },
  { city: 'Dallas', state: 'TX' }
];

const internshipWindows = [
  'May - Aug 2026',
  'Jun - Aug 2026',
  'May - Sep 2026',
  'Jan - Apr 2026',
  'Sep - Dec 2026',
  'Feb - May 2026'
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSubset(arr, minCount, maxCount) {
  const clone = [...arr];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }

  const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
  return clone.slice(0, count);
}

function buildPair(letter) {
  return `${letter}${letter}`;
}

async function findAlphabetUser(pair) {
  return User.findOne({ email: { $in: [`${pair}@nyu.edu`, `${pair}@nyu`] } });
}

async function randomizeAlphabetAccounts() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required to run this script.');
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  let updated = 0;
  let skipped = 0;

  for (const letter of LETTERS) {
    const pair = buildPair(letter);
    const user = await findAlphabetUser(pair);

    if (!user) {
      console.log(`Skipped ${pair}: account not found`);
      skipped += 1;
      continue;
    }

    const firstName = firstNameByLetter[letter] || 'Intern';
    const lastName = randomItem(lastNames);
    const fullName = `${pair} ${firstName} ${lastName}`;

    const role = randomItem(rolePool);
    const company = randomItem(companyPool);
    const cityObj = randomItem(cityPool);
    const timeline = randomItem(internshipWindows);
    const mbti = randomItem(mbtiTypes);
    const interests = randomSubset(interestPool, 3, 5);
    const meetupTypes = randomSubset(activityPool, 3, 5);
    const major = `${randomItem(majorPool)} @ NYU`;
    const cityLabel = `${cityObj.city}, ${cityObj.state}`;

    user.email = `${pair}@nyu.edu`;
    user.name = fullName;
    user.role = role;
    user.company = company;
    user.school = 'NYU';
    user.city = cityLabel;
    user.major = major;
    user.internshipFull = `${role} @ ${company}`;
    user.locationFull = `${cityLabel} | ${timeline}`;
    user.about = `Hi! I'm ${firstName}, interning at ${company} in ${cityObj.city}. Looking to meet other interns for fun events.`;
    user.pronouns = randomItem(['she/her', 'he/him', 'they/them']);
    user.interests = interests;
    user.drinks = randomItem(['No', 'Socially', 'Yes']);
    user.image = `https://picsum.photos/seed/${pair}-avatar/100/100`;
    user.swipeImage = `https://picsum.photos/seed/${pair}-swipe/400/500`;
    user.onboardingCompleted = true;
    user.verified = true;
    user.verifiedAt = user.verifiedAt || new Date();

    await user.save();

    await Profile.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        name: fullName,
        location: `${cityLabel} | ${timeline}`,
        city: cityLabel,
        pronouns: user.pronouns,
        internship: `${role} @ ${company}`,
        jobTitle: role,
        company,
        school: 'NYU',
        degree: randomItem(['BS', 'BA', 'MS']),
        major,
        lifestyle: randomItem(['Balanced', 'Adventurous', 'Chill', 'Social']),
        drinks: user.drinks,
        meetupTypes,
        interests,
        about: user.about,
        image: user.image,
        swipeImage: user.swipeImage,
        personality: mbti,
        currentStep: 'resume',
        completed: true,
        completedAt: new Date(),
      },
      {
        upsert: true,
        returnDocument: 'after',
        runValidators: true,
      }
    );

    console.log(`Updated ${pair}: ${fullName} | ${role} @ ${company} | ${cityLabel}`);
    updated += 1;
  }

  console.log(`Done. Updated: ${updated}, Skipped: ${skipped}`);
}

randomizeAlphabetAccounts()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('Failed to randomize alphabet accounts:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  });
