const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { getMyProfile, saveProfile } = require('../controllers/profileController');

router.get('/me', requireAuth, getMyProfile);
router.post('/', requireAuth, saveProfile);

module.exports = router;
