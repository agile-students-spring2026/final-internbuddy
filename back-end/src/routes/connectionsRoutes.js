const express = require('express');
const {
  sendRequest,
  getPending,
  getSent,
  getAccepted,
  acceptRequest,
  rejectRequest,
  deleteConnection
} = require('../controllers/connectionsController');

const router = express.Router();

router.post('/request', sendRequest);
router.get('/:userId/pending', getPending);
router.get('/:userId/sent', getSent);
router.get('/:userId', getAccepted);
router.post('/:requestId/accept', acceptRequest);
router.post('/:requestId/reject', rejectRequest);
router.delete('/:requestId', deleteConnection);

module.exports = router;
