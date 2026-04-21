const express = require('express');
const { body } = require('express-validator');
const { signup, verify, me, register, login, meAuthenticated } = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

router.post(
	'/register',
	[
		body('email').isEmail().withMessage('Valid email is required'),
		body('phone').trim().notEmpty().withMessage('Phone is required'),
		body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
	],
	validateRequest,
	register
);

router.post(
	'/login',
	[
		body('email').isEmail().withMessage('Valid email is required'),
		body('password').notEmpty().withMessage('Password is required'),
	],
	validateRequest,
	login
);

router.get('/me', requireAuth, meAuthenticated);

router.post('/signup', signup);
router.post('/verify', verify);
router.get('/:userId', me);

module.exports = router;
