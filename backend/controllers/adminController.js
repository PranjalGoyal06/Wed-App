const User = require('../models/User');
const Photo = require('../models/Photo');
const Game = require('../models/Game');
const Challenge = require('../models/Challenge');
const Event = require('../models/Event');

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPhotos = await Photo.countDocuments();
    const totalGames = await Game.countDocuments();
    const totalChallenges = await Challenge.countDocuments();
    const totalEvents = await Event.countDocuments();
    
    // Recent activities
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('-password');
    
    const recentPhotos = await Photo.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('uploadedBy', 'name email');
    
    // Active games
    const activeGames = await Game.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Upcoming events
    const upcomingEvents = await Event.find({
      startTime: { $gte: new Date() }
    })
      .sort({ startTime: 1 })
      .limit(5);
    
    res.json({
      stats: {
        totalUsers,
        totalPhotos,
        totalGames,
        totalChallenges,
        totalEvents
      },
      recentUsers,
      recentPhotos,
      activeGames,
      upcomingEvents
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role } = req.query;
    
    const query = role ? { role } : {};
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user role (Admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Also delete user's photos
    await Photo.deleteMany({ uploadedBy: req.params.id });
    
    res.json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get system analytics
exports.getAnalytics = async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    const days = parseInt(period) || 7;
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    // User registrations over time
    const userRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Photo uploads over time
    const photoUploads = await Photo.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Game participation
    const gameParticipation = await Game.aggregate([
      {
        $match: {
          'leaderboard.0': { $exists: true }
        }
      },
      {
        $project: {
          name: 1,
          participantCount: { $size: '$leaderboard' }
        }
      }
    ]);
    
    res.json({
      userRegistrations,
      photoUploads,
      gameParticipation
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Broadcast notification to all users (Admin only)
exports.broadcastNotification = async (req, res) => {
  try {
    const { message, type } = req.body;
    
    await User.updateMany(
      {},
      {
        $push: {
          notifications: {
            message,
            type: type || 'announcement',
            read: false
          }
        }
      }
    );
    
    res.json({ message: 'Notification broadcasted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
