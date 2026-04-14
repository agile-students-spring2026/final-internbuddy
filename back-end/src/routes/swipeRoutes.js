const express = require('express');
const router = express.Router();
const { getProfiles } = require('../controllers/swipeController');

router.get('/profiles', getProfiles);

module.exports = router;
