const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);
router.post('/face-descriptor', auth, authController.uploadFaceDescriptor);
router.get('/notifications', auth, authController.getNotifications);
router.put('/notifications/:notificationId/read', auth, authController.markNotificationRead);

module.exports = router;
