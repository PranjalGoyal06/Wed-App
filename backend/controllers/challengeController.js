const Challenge = require('../models/Challenge');
const User = require('../models/User');

// Create challenge (Admin only)
exports.createChallenge = async (req, res) => {
  try {
    const { title, description, type, requirements, points, deadline } = req.body;
    
    const challenge = new Challenge({
      title,
      description,
      type,
      requirements,
      points,
      deadline
    });
    
    await challenge.save();
    
    res.status(201).json({
      message: 'Challenge created successfully',
      challenge
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all challenges
exports.getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ isActive: true })
      .populate('participants.user', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ challenges });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get challenge by ID
exports.getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate('participants.user', 'name email');
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    res.json({ challenge });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Join challenge
exports.joinChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    // Check if user already joined
    const alreadyJoined = challenge.participants.some(
      p => p.user.toString() === req.userId
    );
    
    if (alreadyJoined) {
      return res.status(400).json({ message: 'Already joined this challenge' });
    }
    
    challenge.participants.push({
      user: req.userId,
      status: 'pending'
    });
    
    await challenge.save();
    
    res.json({ message: 'Joined challenge successfully', challenge });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit challenge
exports.submitChallenge = async (req, res) => {
  try {
    const { challengeId, submission } = req.body;
    
    const challenge = await Challenge.findById(challengeId);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    // Find user's participation
    const participation = challenge.participants.find(
      p => p.user.toString() === req.userId
    );
    
    if (!participation) {
      return res.status(400).json({ message: 'Not enrolled in this challenge' });
    }
    
    participation.submission = submission;
    participation.status = 'completed';
    participation.completedAt = new Date();
    
    await challenge.save();
    
    res.json({
      message: 'Challenge submission successful',
      challenge
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Verify challenge submission (Admin only)
exports.verifySubmission = async (req, res) => {
  try {
    const { challengeId, userId, verified } = req.body;
    
    const challenge = await Challenge.findById(challengeId);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    const participation = challenge.participants.find(
      p => p.user.toString() === userId
    );
    
    if (!participation) {
      return res.status(400).json({ message: 'Participation not found' });
    }
    
    if (verified) {
      participation.status = 'verified';
      
      // Award points to user
      await User.findByIdAndUpdate(userId, {
        $push: {
          gameScores: {
            game: challenge.title,
            score: challenge.points
          }
        }
      });
    } else {
      participation.status = 'pending';
    }
    
    await challenge.save();
    
    res.json({ message: 'Submission verification updated', challenge });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update challenge (Admin only)
exports.updateChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    res.json({ message: 'Challenge updated successfully', challenge });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete challenge (Admin only)
exports.deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    res.json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
