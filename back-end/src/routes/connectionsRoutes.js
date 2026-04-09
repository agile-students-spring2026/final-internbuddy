const express = require('express');
const {
  sendRequest,
  getPending,
  getAccepted,
  acceptRequest
} = require('../controllers/connectionsController');

const router = express.Router();

// placeholder route to make sure wiring works
router.get('/ping', (req, res) => {
  res.json({ message: 'connections route is alive' });
});

router.post('/request', sendRequest);
router.get('/:userId/pending', getPending);
router.get('/:userId', getAccepted);
router.post('/:requestId/accept', acceptRequest);

module.exports = router;
