const mockStore = require('../services/mockStore');

function getAllEvents(req, res) {
  const events = mockStore.getEvents();
  res.json(events);
}

function getEventById(req, res) {
  const event = mockStore.getEventById(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  res.json(event);
}

function getUserEvents(req, res) {
  const data = mockStore.getUserEvents();
  res.json(data);
}

function createEvent(req, res) {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const event = mockStore.createEvent(req.body);
  res.status(201).json(event);
}

module.exports = { getAllEvents, getEventById, getUserEvents, createEvent };
