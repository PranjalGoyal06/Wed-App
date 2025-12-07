const Game = require('../models/Game');
const User = require('../models/User');

// Create game (Admin only)
exports.createGame = async (req, res) => {
  try {
    const { name, type, description, questions, startTime, endTime } = req.body;
    
    const game = new Game({
      name,
      type,
      description,
      questions,
      startTime,
      endTime
    });
    
    await game.save();
    
    res.status(201).json({
      message: 'Game created successfully',
      game
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all games
exports.getAllGames = async (req, res) => {
  try {
    const games = await Game.find({ isActive: true })
      .sort({ createdAt: -1 });
    
    res.json({ games });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get game by ID
exports.getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
      .populate('leaderboard.user', 'name email');
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    res.json({ game });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit game score
exports.submitScore = async (req, res) => {
  try {
    const { gameId, score, answers } = req.body;
    
    const game = await Game.findById(gameId);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    // Calculate actual score based on correct answers
    let actualScore = 0;
    if (answers && game.questions) {
      answers.forEach((answer, index) => {
        if (game.questions[index] && answer === game.questions[index].correctAnswer) {
          actualScore += game.questions[index].points || 10;
        }
      });
    } else {
      actualScore = score;
    }
    
    // Add to leaderboard
    game.leaderboard.push({
      user: req.userId,
      score: actualScore
    });
    
    await game.save();
    
    // Update user's game scores
    await User.findByIdAndUpdate(req.userId, {
      $push: {
        gameScores: {
          game: game.name,
          score: actualScore
        }
      }
    });
    
    res.json({
      message: 'Score submitted successfully',
      score: actualScore,
      game
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const { gameId } = req.params;
    
    const game = await Game.findById(gameId)
      .populate('leaderboard.user', 'name email');
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    // Sort leaderboard by score
    const sortedLeaderboard = game.leaderboard.sort((a, b) => b.score - a.score);
    
    res.json({ leaderboard: sortedLeaderboard });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update game (Admin only)
exports.updateGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    res.json({ message: 'Game updated successfully', game });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete game (Admin only)
exports.deleteGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
