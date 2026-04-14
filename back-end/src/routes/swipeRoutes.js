const express = require('express');
const router = express.Router();
const { getProfiles, likeProfile, passProfile, getRequests, acceptRequest, rejectRequest } = require('../controllers/swipeController');

router.get('/profiles', getProfiles);
router.post('/like', likeProfile);
router.post('/pass', passProfile);
router.get('/requests', getRequests);
router.post('/requests/:id/accept', acceptRequest);
router.post('/requests/:id/reject', rejectRequest);

module.exports = router;
