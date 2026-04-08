const path = require('path');
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const eventsRoutes = require('./routes/eventsRoutes');
const swipeRoutes = require('./routes/swipeRoutes');
const messagesRoutes = require('./routes/messagesRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandlers');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'internbuddy-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/swipe', swipeRoutes);
app.use('/api/messages', messagesRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
