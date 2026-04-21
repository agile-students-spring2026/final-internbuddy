const Profile = require('../models/Profile');
const User = require('../models/User');

async function getMyProfile(req, res, next) {
  try {
    const userId = req.auth.userId;

    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    return res.status(200).json({ profile });
  } catch (err) {
    return next(err);
  }
}

async function saveProfile(req, res, next) {
  try {
    const userId = req.auth.userId;

    const profile = await Profile.findOneAndUpdate(
      { userId },
      {
        userId,
        ...req.body,
        completed: true,
        completedAt: new Date(),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    await User.findByIdAndUpdate(userId, {
      onboardingCompleted: true,
    });

    return res.status(200).json({
      message: 'Profile saved',
      profile,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getMyProfile,
  saveProfile,
};
