const express = require('express');
const {
  getProfileByUserId,
  saveStep,
  finish
} = require('../controllers/profileController');

const router = express.Router();

router.get('/:userId', getProfileByUserId);
router.post('/:userId/step', saveStep);
router.post('/:userId/complete', finish);

module.exports = router;
