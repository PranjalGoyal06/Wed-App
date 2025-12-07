const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { auth, adminAuth } = require('../middleware/auth');
const { apiLimiter, createLimiter } = require('../middleware/rateLimiter');

// Public routes with rate limiting
router.get('/', apiLimiter, eventController.getAllEvents);
router.get('/:id', apiLimiter, eventController.getEventById);

// Protected routes with rate limiting
router.post('/:id/rsvp', apiLimiter, auth, eventController.rsvpEvent);

// Admin routes with rate limiting
router.post('/', createLimiter, adminAuth, eventController.createEvent);
router.put('/:id', createLimiter, adminAuth, eventController.updateEvent);
router.delete('/:id', createLimiter, adminAuth, eventController.deleteEvent);
router.post('/send-notifications', createLimiter, adminAuth, eventController.sendEventNotifications);

module.exports = router;
