const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');
const { auth, adminAuth } = require('../middleware/auth');
const { apiLimiter, createLimiter } = require('../middleware/rateLimiter');

// Public routes with rate limiting
router.get('/', apiLimiter, challengeController.getAllChallenges);
router.get('/:id', apiLimiter, challengeController.getChallengeById);

// Protected routes with rate limiting
router.post('/:id/join', apiLimiter, auth, challengeController.joinChallenge);
router.post('/submit', apiLimiter, auth, challengeController.submitChallenge);

// Admin routes with rate limiting
router.post('/', createLimiter, adminAuth, challengeController.createChallenge);
router.put('/:id', createLimiter, adminAuth, challengeController.updateChallenge);
router.delete('/:id', createLimiter, adminAuth, challengeController.deleteChallenge);
router.post('/verify-submission', createLimiter, adminAuth, challengeController.verifySubmission);

module.exports = router;
