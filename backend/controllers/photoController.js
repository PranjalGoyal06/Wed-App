const Photo = require('../models/Photo');
const User = require('../models/User');

// Upload photo
exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const photo = new Photo({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      uploadedBy: req.userId,
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      event: req.body.event || 'wedding'
    });
    
    await photo.save();
    
    // Add photo to user's photos array
    await User.findByIdAndUpdate(req.userId, {
      $push: { photos: photo._id }
    });
    
    res.status(201).json({
      message: 'Photo uploaded successfully',
      photo
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all photos
exports.getAllPhotos = async (req, res) => {
  try {
    const { page = 1, limit = 20, event, tag } = req.query;
    
    const query = { isPublic: true };
    if (event) query.event = event;
    if (tag) query.tags = tag;
    
    const photos = await Photo.find(query)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Photo.countDocuments(query);
    
    res.json({
      photos,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get photo by ID
exports.getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id)
      .populate('uploadedBy', 'name email')
      .populate('comments.user', 'name email');
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    
    res.json({ photo });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Filter photos by face
exports.filterPhotosByFace = async (req, res) => {
  try {
    const { faceDescriptor } = req.body;
    
    if (!faceDescriptor || !Array.isArray(faceDescriptor)) {
      return res.status(400).json({ message: 'Invalid face descriptor' });
    }
    
    // Get all photos with face descriptors
    const allPhotos = await Photo.find({ 
      'faceDescriptors.0': { $exists: true }
    }).populate('uploadedBy', 'name email');
    
    // Simple similarity check (in production, use proper face recognition library)
    const matchingPhotos = allPhotos.filter(photo => {
      return photo.faceDescriptors.some(face => {
        if (!face.descriptor || face.descriptor.length !== faceDescriptor.length) {
          return false;
        }
        
        // Calculate Euclidean distance
        const distance = Math.sqrt(
          face.descriptor.reduce((sum, val, idx) => {
            return sum + Math.pow(val - faceDescriptor[idx], 2);
          }, 0)
        );
        
        // Threshold for matching (adjust as needed)
        return distance < 0.6;
      });
    });
    
    res.json({
      message: `Found ${matchingPhotos.length} photos`,
      photos: matchingPhotos
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add face descriptor to photo
exports.addFaceDescriptor = async (req, res) => {
  try {
    const { photoId, faceDescriptors } = req.body;
    
    const photo = await Photo.findByIdAndUpdate(
      photoId,
      { faceDescriptors },
      { new: true }
    );
    
    res.json({ message: 'Face descriptors added successfully', photo });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Like photo
exports.likePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    
    const likeIndex = photo.likes.indexOf(req.userId);
    
    if (likeIndex > -1) {
      // Unlike
      photo.likes.splice(likeIndex, 1);
    } else {
      // Like
      photo.likes.push(req.userId);
    }
    
    await photo.save();
    
    res.json({ message: 'Photo like status updated', photo });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add comment to photo
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    const photo = await Photo.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    
    photo.comments.push({
      user: req.userId,
      text
    });
    
    await photo.save();
    await photo.populate('comments.user', 'name email');
    
    res.json({ message: 'Comment added successfully', photo });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete photo
exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    
    // Check if user is owner or admin
    if (photo.uploadedBy.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await photo.deleteOne();
    
    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
