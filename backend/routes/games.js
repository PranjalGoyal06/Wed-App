const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { auth, adminAuth } = require('../middleware/auth');
const { apiLimiter, createLimiter } = require('../middleware/rateLimiter');

// Public routes with rate limiting
router.get('/', apiLimiter, gameController.getAllGames);
router.get('/:id', apiLimiter, gameController.getGameById);
router.get('/:gameId/leaderboard', apiLimiter, gameController.getLeaderboard);

// Protected routes with rate limiting
router.post('/submit-score', apiLimiter, auth, gameController.submitScore);

// Admin routes with rate limiting
router.post('/', createLimiter, adminAuth, gameController.createGame);
router.put('/:id', createLimiter, adminAuth, gameController.updateGame);
router.delete('/:id', createLimiter, adminAuth, gameController.deleteGame);

module.exports = router;
