const express = require('express');

const router = express.Router();

// placeholder route to make sure wiring works
router.get('/ping', (req, res) => {
  res.json({ message: 'connections route is alive' });
});

module.exports = router;
