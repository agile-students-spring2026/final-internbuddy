const profileStepOrder = require('../data/profileStepOrder');

const accounts = new Map();
const profiles = new Map();

let nextId = 1;

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

module.exports = {
  createAccount,
  getAccount,
  verifyAccount,
  saveProfileStep,
  getProfile,
  completeProfile
};
