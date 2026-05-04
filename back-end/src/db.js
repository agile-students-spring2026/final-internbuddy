const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer = null;

async function connectDB() {
  const uri = process.env.MONGO_URI;
  const allowInMemoryFallback = process.env.ALLOW_IN_MEMORY_DB === 'true';
  const connectOptions = {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  };

  if (uri) {
    try {
      await mongoose.connect(uri, connectOptions);
      console.log('MongoDB connected');
      return;
    } catch (err) {
      if (!allowInMemoryFallback) {
        throw new Error(
          `Failed to connect to MONGO_URI. Data persistence requires a working MongoDB connection. ${err.message}`
        );
      }

      if (process.env.NODE_ENV === 'production') {
        throw err;
      }

      console.warn('Primary MongoDB connection failed. Falling back to in-memory MongoDB for development.');
      console.warn(`Reason: ${err.message}`);
    }
  }

  if (!allowInMemoryFallback) {
    throw new Error(
      'MONGO_URI is not set. Set a persistent MongoDB URI to keep data after server restarts.'
    );
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('MONGO_URI is not set or unreachable in production environment');
  }

  console.log('Starting in-memory MongoDB fallback...');
  memoryServer = await MongoMemoryServer.create();
  const memoryUri = memoryServer.getUri();
  await mongoose.connect(memoryUri, connectOptions);
  console.log('In-memory MongoDB connected (development fallback)');
}

async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}

module.exports = { connectDB, disconnectDB };
