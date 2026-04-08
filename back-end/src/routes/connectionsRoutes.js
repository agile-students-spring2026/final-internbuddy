const express = require('express');
const {
  sendRequest,
  getPending,
  getAccepted
} = require('../controllers/connectionsController');

const router = express.Router();

// placeholder route to make sure wiring works
router.get('/ping', (req, res) => {
  res.json({ message: 'connections route is alive' });
});

router.post('/request', sendRequest);
router.get('/:userId/pending', getPending);
router.get('/:userId', getAccepted);

module.exports = router;
