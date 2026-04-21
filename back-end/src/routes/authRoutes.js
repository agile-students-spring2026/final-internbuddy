const express = require('express');
const { signup, verify, me } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/verify', verify);
router.get('/:userId', me);

module.exports = router;
