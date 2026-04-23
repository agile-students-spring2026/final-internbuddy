const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    passwordHash: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      trim: true
    },
    company: {
      type: String,
      trim: true
    },
    school: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    image: {
      type: String,
    },
    swipeImage: {
      type: String,
    },
    age: {
      type: String,
      trim: true
    },
    major: {
      type: String,
      trim: true
    },
    internshipFull: {
      type: String
    },
    locationFull: {
      type: String
    },
    about: {
      type: String
    },
    pronouns: {
      type: String
    },
    interests: [{
      type: String
    }],
    drinks: {
      type: String
    },
    connections: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
  },
  { timestamps: true }
);

userSchema.methods.setPassword = async function (password) {
  this.passwordHash = await bcrypt.hash(password, 12);
};

userSchema.methods.checkPassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
