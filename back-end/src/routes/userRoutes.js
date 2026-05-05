const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  searchUsersHandler,
  getUserProfileHandler,
} = require('../controllers/userController');

router.get('/search', requireAuth, searchUsersHandler);

router.get('/:id', requireAuth, getUserProfileHandler);

module.exports = router;
