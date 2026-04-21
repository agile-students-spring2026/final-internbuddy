const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signAuthToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set in environment variables');
  }

  return jwt.sign(
    {
      sub: String(user._id),
      email: user.email,
    },
    secret,
    { expiresIn: '7d' }
  );
}

async function register(req, res, next) {
  try {
    const { email, phone, password } = req.body;

    if (!email || !phone || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['email', 'phone', 'password'],
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: 'Account with this email already exists' });
    }

    const user = new User({ email: normalizedEmail, phone, verified: true, verifiedAt: new Date() });
    await user.setPassword(password);
    await user.save();

    const token = signAuthToken(user);

    return res.status(201).json({
      message: 'Account created',
      token,
      user: {
        id: String(user._id),
        email: user.email,
        phone: user.phone,
        verified: user.verified,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['email', 'password'],
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = await user.checkPassword(password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signAuthToken(user);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: String(user._id),
        email: user.email,
        phone: user.phone,
        verified: user.verified,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (err) {
    return next(err);
  }
}

async function meAuthenticated(req, res, next) {
  try {
    const user = await User.findById(req.auth.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      user: {
        id: String(user._id),
        email: user.email,
        phone: user.phone,
        verified: user.verified,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  register,
  login,
  meAuthenticated,
};
