const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['quiz', 'photo-booth', 'guess-the-couple', 'memory-match', 'trivia'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  questions: [{
    question: String,
    options: [String],
    correctAnswer: String,
    points: { type: Number, default: 10 }
  }],
  leaderboard: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: Number,
    completedAt: { type: Date, default: Date.now }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Game', gameSchema);
