const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');
const { apiLimiter, createLimiter } = require('../middleware/rateLimiter');

// All routes are admin-protected with rate limiting
router.get('/dashboard', apiLimiter, adminAuth, adminController.getDashboardStats);
router.get('/users', apiLimiter, adminAuth, adminController.getAllUsers);
router.put('/users/role', createLimiter, adminAuth, adminController.updateUserRole);
router.delete('/users/:id', createLimiter, adminAuth, adminController.deleteUser);
router.get('/analytics', apiLimiter, adminAuth, adminController.getAnalytics);
router.post('/broadcast-notification', createLimiter, adminAuth, adminController.broadcastNotification);

module.exports = router;
