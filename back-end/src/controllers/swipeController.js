const Swipe = require('../models/Swipe');
const { getSwipeProfiles } = require('../services/usersStore');

async function getProfiles(req, res, next) {
  try {
    const userId = req.auth.userId;

    const swipes = await Swipe.find({ userId }).lean();
    const swipedIds = new Set(swipes.map((s) => s.targetProfileId));

    const allProfiles = await getSwipeProfiles(userId);
    const unseen = allProfiles.filter((p) => !swipedIds.has(String(p.id)));

    return res.status(200).json(unseen);
  } catch (err) {
    return next(err);
  }
}

async function recordSwipe(req, res, next, action) {
  try {
    const userId = req.auth.userId;
    const { profileId } = req.body;

    const swipe = await Swipe.findOneAndUpdate(
      { userId, targetProfileId: String(profileId) },
      { userId, targetProfileId: String(profileId), action },
      { returnDocument: 'after', upsert: true, runValidators: true }
    );

    return res.status(200).json({
      id: String(swipe._id),
      userId: String(swipe.userId),
      targetProfileId: swipe.targetProfileId,
      action: swipe.action,
    });
  } catch (err) {
    return next(err);
  }
}

function likeProfile(req, res, next) {
  return recordSwipe(req, res, next, 'like');
}

function passProfile(req, res, next) {
  return recordSwipe(req, res, next, 'pass');
}

async function undoSwipe(req, res, next) {
  try {
    const userId = req.auth.userId;
    const { profileId } = req.params;
    const deleted = await Swipe.findOneAndDelete({ userId, targetProfileId: String(profileId) });
    if (!deleted) {
      return res.status(404).json({ error: 'Swipe not found' });
    }
    return res.status(200).json({ removed: deleted.targetProfileId });
  } catch (err) {
    return next(err);
  }
}

async function getStats(req, res, next) {
  try {
    const userId = req.auth.userId;
    const [likes, passes] = await Promise.all([
      Swipe.countDocuments({ userId, action: 'like' }),
      Swipe.countDocuments({ userId, action: 'pass' }),
    ]);
    return res.status(200).json({ likes, passes, total: likes + passes });
  } catch (err) {
    return next(err);
  }
}

async function getHistory(req, res, next) {
  try {
    const userId = req.auth.userId;
    const swipes = await Swipe.find({ userId }).sort({ createdAt: -1 }).lean();
    return res.status(200).json(
      swipes.map((s) => ({
        id: String(s._id),
        targetProfileId: s.targetProfileId,
        action: s.action,
        createdAt: s.createdAt,
      }))
    );
  } catch (err) {
    return next(err);
  }
}

module.exports = { getProfiles, likeProfile, passProfile, getHistory, getStats, undoSwipe };
