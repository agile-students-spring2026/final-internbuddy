const mongoose = require('mongoose');

const swipeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetProfileId: {
      type: String,
      required: true,
      trim: true,
    },
    action: {
      type: String,
      enum: ['like', 'pass'],
      required: true,
    },
  },
  { timestamps: true }
);

swipeSchema.index({ userId: 1, targetProfileId: 1 }, { unique: true });

module.exports = mongoose.model('Swipe', swipeSchema);
