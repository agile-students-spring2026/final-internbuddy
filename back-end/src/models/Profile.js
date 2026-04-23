const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    // profile setup steps
    name: { type: String, trim: true },
    dob: { type: Date },
    location: { type: String, trim: true },
    city: { type: String, trim: true },
    pronouns: { type: String, trim: true },
    gender: { type: String, trim: true },
    friendPreference: { type: String, trim: true },

    internship: { type: String, trim: true },
    jobTitle: { type: String, trim: true },
    company: { type: String, trim: true },

    school: { type: String, trim: true },
    degree: { type: String, trim: true },
    major: { type: String, trim: true },

    lifestyle: { type: String, trim: true },
    drinks: { type: String, trim: true },

    meetupTypes: [{ type: String }],
    interests: [{ type: String }],

    about: { type: String, trim: true },

    image: { type: String },
    swipeImage: { type: String },
    resumeFileName: { type: String, trim: true },
    resumeUploadedAt: { type: Date },
    resumeText: { type: String, trim: true },

    // 🔥 NEW FIELDS
    personality: { type: String, trim: true },

    connections: {
      type: Number,
      default: 0,
    },

    hostingEvents: [
      {
        type: String, // later you can change this to ObjectId ref 'Event'
      },
    ],

    attendingEvents: [
      {
        type: String, // same here, can upgrade later
      },
    ],

    // tracks onboarding progress
    currentStep: { type: String, default: 'resume' },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
