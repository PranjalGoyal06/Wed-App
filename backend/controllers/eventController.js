const Event = require('../models/Event');
const User = require('../models/User');

// Create event (Admin only)
exports.createEvent = async (req, res) => {
  try {
    const { title, description, eventType, startTime, endTime, location, notifyBefore, attendees } = req.body;
    
    const event = new Event({
      title,
      description,
      eventType,
      startTime,
      endTime,
      location,
      notifyBefore,
      attendees
    });
    
    await event.save();
    
    // Notify all attendees
    if (attendees && attendees.length > 0) {
      await User.updateMany(
        { _id: { $in: attendees } },
        {
          $push: {
            notifications: {
              message: `New event: ${title} scheduled for ${new Date(startTime).toLocaleString()}`,
              type: 'event',
              read: false
            }
          }
        }
      );
    }
    
    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const { upcoming, past } = req.query;
    const now = new Date();
    
    let query = {};
    if (upcoming === 'true') {
      query.startTime = { $gte: now };
    } else if (past === 'true') {
      query.startTime = { $lt: now };
    }
    
    const events = await Event.find(query)
      .populate('attendees', 'name email')
      .sort({ startTime: 1 });
    
    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('attendees', 'name email');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json({ event });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update event (Admin only)
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Notify attendees of update
    if (event.attendees && event.attendees.length > 0) {
      await User.updateMany(
        { _id: { $in: event.attendees } },
        {
          $push: {
            notifications: {
              message: `Event "${event.title}" has been updated`,
              type: 'event',
              read: false
            }
          }
        }
      );
    }
    
    res.json({ message: 'Event updated successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete event (Admin only)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// RSVP to event
exports.rsvpEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user already RSVP'd
    const alreadyRSVP = event.attendees.includes(req.userId);
    
    if (alreadyRSVP) {
      // Remove RSVP
      event.attendees = event.attendees.filter(
        attendee => attendee.toString() !== req.userId
      );
    } else {
      // Add RSVP
      event.attendees.push(req.userId);
    }
    
    await event.save();
    
    res.json({
      message: alreadyRSVP ? 'RSVP removed' : 'RSVP confirmed',
      event
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Send event notifications (scheduled job or manual trigger)
exports.sendEventNotifications = async (req, res) => {
  try {
    const now = new Date();
    const futureTime = new Date(now.getTime() + 60 * 60 * 1000); // Next hour
    
    // Find events starting soon that haven't sent notifications
    const upcomingEvents = await Event.find({
      startTime: { $gte: now, $lte: futureTime },
      notificationsSent: false
    });
    
    for (const event of upcomingEvents) {
      const notifyTime = new Date(event.startTime.getTime() - event.notifyBefore * 60 * 1000);
      
      if (now >= notifyTime) {
        // Send notifications to all attendees
        await User.updateMany(
          { _id: { $in: event.attendees } },
          {
            $push: {
              notifications: {
                message: `Reminder: "${event.title}" starts in ${event.notifyBefore} minutes!`,
                type: 'event-reminder',
                read: false
              }
            }
          }
        );
        
        event.notificationsSent = true;
        await event.save();
      }
    }
    
    res.json({ message: 'Event notifications processed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
