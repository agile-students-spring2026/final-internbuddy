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
    const image = typeof req.body.image === 'string' ? req.body.image : undefined;

    const profile = await Profile.findOneAndUpdate(
      { userId },
      {
        userId,
        ...req.body,
        completed: true,
        completedAt: new Date(),
      },
      {
        returnDocument: 'after',
        upsert: true,
        runValidators: true,
      }
    );

    const userUpdates = {
      onboardingCompleted: true,
    };

    if (typeof image !== 'undefined') {
      userUpdates.image = image;
    }

    await User.findByIdAndUpdate(userId, userUpdates);

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
