const express = require('express');
const { body } = require('express-validator');
const {
  sendRequest,
  getPending,
  getSent,
  getAccepted,
  acceptRequest,
  rejectRequest,
  deleteConnection
} = require('../controllers/connectionsController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/request',
  requireAuth,
  [body('toUserId').notEmpty().withMessage('toUserId is required')],
  validateRequest,
  sendRequest
);
router.get('/:userId/pending', requireAuth, getPending);
router.get('/:userId/sent', requireAuth, getSent);
router.get('/:userId', requireAuth, getAccepted);
router.post('/:requestId/accept', requireAuth, acceptRequest);
router.post('/:requestId/reject', requireAuth, rejectRequest);
router.delete('/:requestId', requireAuth, deleteConnection);

module.exports = router;
