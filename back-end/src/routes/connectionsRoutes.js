const express = require('express');
const { sendRequest } = require('../controllers/connectionsController');

const router = express.Router();

// placeholder route to make sure wiring works
router.get('/ping', (req, res) => {
  res.json({ message: 'connections route is alive' });
});

router.post('/request', sendRequest);

module.exports = router;
