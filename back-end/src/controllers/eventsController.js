const mongoose = require('mongoose');
const Event = require('../models/Event');

function serializeEvent(event) {
  return {
    id: String(event._id),
    title: event.title,
    description: event.description,
    location: event.location,
    date: event.date,
    time: event.time,
    privacy: event.privacy,
    createdBy: event.createdBy ? String(event.createdBy) : null,
    attendees: (event.attendees || []).map(String),
    createdAt: event.createdAt,
  };
}

async function getAllEvents(req, res, next) {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const skip = Math.max(parseInt(req.query.skip, 10) || 0, 0);
    const events = await Event.find({ privacy: 'public' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    return res.status(200).json(events.map(serializeEvent));
  } catch (err) {
    return next(err);
  }
}

async function getEventById(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = await Event.findById(id).lean();
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    return res.status(200).json(serializeEvent(event));
  } catch (err) {
    return next(err);
  }
}

async function getUserEvents(req, res, next) {
  try {
    const userId = req.auth.userId;

    const [hosting, attending, privateEvents, suggested] = await Promise.all([
      Event.find({ createdBy: userId }).sort({ createdAt: -1 }).lean(),
      Event.find({
        attendees: userId,
        createdBy: { $ne: userId },
        privacy: 'public',
      }).sort({ createdAt: -1 }).lean(),
      Event.find({
        privacy: 'private',
        attendees: userId,
        createdBy: { $ne: userId },
      }).sort({ createdAt: -1 }).lean(),
      Event.find({
        privacy: 'public',
        createdBy: { $ne: userId },
        attendees: { $ne: userId },
      }).sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    return res.status(200).json({
      hosting: hosting.map(serializeEvent),
      attending: attending.map(serializeEvent),
      private: privateEvents.map(serializeEvent),
      suggested: suggested.map(serializeEvent),
    });
  } catch (err) {
    return next(err);
  }
}

async function createEvent(req, res, next) {
  try {
    const userId = req.auth.userId;
    const { title, description, location, date, time, privacy } = req.body;

    const event = await Event.create({
      title,
      description: description || '',
      location: location || '',
      date: date || '',
      time: time || '',
      privacy: privacy || 'public',
      createdBy: userId,
      attendees: [userId],
    });

    return res.status(201).json(serializeEvent(event));
  } catch (err) {
    return next(err);
  }
}

module.exports = { getAllEvents, getEventById, getUserEvents, createEvent };
