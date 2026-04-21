const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    acceptedAt: { type: Date },
  },
  { timestamps: true }
);

connectionSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

module.exports = mongoose.model('Connection', connectionSchema);
