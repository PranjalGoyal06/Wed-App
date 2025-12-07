const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    enum: ['ceremony', 'reception', 'cocktail', 'dinner', 'dance', 'game', 'custom'],
    default: 'custom'
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: Date,
  location: {
    venue: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  notifyBefore: {
    type: Number,
    default: 30 // minutes
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  notificationsSent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);
