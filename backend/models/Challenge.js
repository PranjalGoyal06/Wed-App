const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['photo', 'social', 'team', 'individual'],
    required: true
  },
  requirements: {
    type: String
  },
  points: {
    type: Number,
    default: 50
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'verified'],
      default: 'pending'
    },
    submission: {
      type: String // URL or text
    },
    completedAt: Date
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  deadline: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Challenge', challengeSchema);
