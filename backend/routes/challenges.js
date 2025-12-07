const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');
const { auth, adminAuth } = require('../middleware/auth');

// Public routes
router.get('/', challengeController.getAllChallenges);
router.get('/:id', challengeController.getChallengeById);

// Protected routes
router.post('/:id/join', auth, challengeController.joinChallenge);
router.post('/submit', auth, challengeController.submitChallenge);

// Admin routes
router.post('/', adminAuth, challengeController.createChallenge);
router.put('/:id', adminAuth, challengeController.updateChallenge);
router.delete('/:id', adminAuth, challengeController.deleteChallenge);
router.post('/verify-submission', adminAuth, challengeController.verifySubmission);

module.exports = router;
