require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('../src/db');

before(async function () {
  this.timeout(20000);
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }
});

after(async function () {
  this.timeout(10000);
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
});
