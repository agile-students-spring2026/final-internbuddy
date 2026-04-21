const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    date: { type: String, trim: true },
    time: { type: String, trim: true },
    privacy: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
