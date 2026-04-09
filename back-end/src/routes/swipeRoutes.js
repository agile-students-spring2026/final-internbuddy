const express = require('express');
const router = express.Router();
const { getProfiles, likeProfile, passProfile, getRequests } = require('../controllers/swipeController');

router.get('/profiles', getProfiles);
router.post('/like', likeProfile);
router.post('/pass', passProfile);
router.get('/requests', getRequests);

module.exports = router;
