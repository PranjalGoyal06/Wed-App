const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');

// All routes are admin-protected
router.get('/dashboard', adminAuth, adminController.getDashboardStats);
router.get('/users', adminAuth, adminController.getAllUsers);
router.put('/users/role', adminAuth, adminController.updateUserRole);
router.delete('/users/:id', adminAuth, adminController.deleteUser);
router.get('/analytics', adminAuth, adminController.getAnalytics);
router.post('/broadcast-notification', adminAuth, adminController.broadcastNotification);

module.exports = router;
