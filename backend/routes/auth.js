const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { authLimiter, apiLimiter } = require('../middleware/rateLimiter');

// Public routes with strict rate limiting
router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);

// Protected routes with general rate limiting
router.get('/profile', apiLimiter, auth, authController.getProfile);
router.put('/profile', apiLimiter, auth, authController.updateProfile);
router.post('/face-descriptor', apiLimiter, auth, authController.uploadFaceDescriptor);
router.get('/notifications', apiLimiter, auth, authController.getNotifications);
router.put('/notifications/:notificationId/read', apiLimiter, auth, authController.markNotificationRead);

module.exports = router;
