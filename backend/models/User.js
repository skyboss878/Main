const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true
  },
  credits: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['trial', 'active', 'inactive', 'cancelled'],
    default: 'trial'
  },
  trialEnds: {
    type: Date,
    default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from creation
  },
  paypalSubscriptionId: String,
  currentPeriodEnd: Date,
  videosUsed: {
    type: Number,
    default: 0
  },
  videoLimit: {
    type: Number,
    default: 1
  },
  teamMembers: [
    {
      email: String,
      role: String,
      joinedAt: Date
    }
  ],
  profile: {
    avatar: String,
    company: String,
    industry: String,
    phone: String
  },
  preferences: {
    defaultStyle: String,
    preferredMusic: [String],
    brandColors: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Password hashing before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password check method
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Check if trial is active
userSchema.methods.isTrialActive = function () {
  return this.status === 'trial' && new Date() < this.trialEnds;
};

// Check if user can generate video based on subscription status and usage limits
userSchema.methods.canGenerateVideo = function () {
  return (
    (this.status === 'active' || this.status === 'trial') &&
    this.videosUsed < this.videoLimit
  );
};

module.exports = mongoose.model('User', userSchema);
