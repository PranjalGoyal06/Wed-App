const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { auth, adminAuth } = require('../middleware/auth');

// Public routes
router.get('/', gameController.getAllGames);
router.get('/:id', gameController.getGameById);
router.get('/:gameId/leaderboard', gameController.getLeaderboard);

// Protected routes
router.post('/submit-score', auth, gameController.submitScore);

// Admin routes
router.post('/', adminAuth, gameController.createGame);
router.put('/:id', adminAuth, gameController.updateGame);
router.delete('/:id', adminAuth, gameController.deleteGame);

module.exports = router;
