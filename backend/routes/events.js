const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { auth, adminAuth } = require('../middleware/auth');

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// Protected routes
router.post('/:id/rsvp', auth, eventController.rsvpEvent);

// Admin routes
router.post('/', adminAuth, eventController.createEvent);
router.put('/:id', adminAuth, eventController.updateEvent);
router.delete('/:id', adminAuth, eventController.deleteEvent);
router.post('/send-notifications', adminAuth, eventController.sendEventNotifications);

module.exports = router;
