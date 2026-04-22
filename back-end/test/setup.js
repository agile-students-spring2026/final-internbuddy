require('dotenv').config();
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
