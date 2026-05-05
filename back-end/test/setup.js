// Tests must never touch a real MongoDB. Wipe any MONGO_URI inherited from
// .env / the shell before .env.test is applied, then force the in-memory fallback.
delete process.env.MONGO_URI;
require('dotenv').config({ path: '.env.test', override: true });
process.env.ALLOW_IN_MEMORY_DB = 'true';

const mongoose = require('mongoose');
const { connectDB } = require('../src/db');

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'internbuddy-test-secret';
}

exports.mochaHooks = {
  async beforeAll() {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }
  },
  async afterAll() {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  },
};
