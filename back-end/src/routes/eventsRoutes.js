const express = require('express');
const router = express.Router();
const { getAllEvents, getEventById, getUserEvents, createEvent } = require('../controllers/eventsController');

router.get('/', getAllEvents);
router.get('/me', getUserEvents);
router.get('/:id', getEventById);
router.post('/', createEvent);

module.exports = router;
