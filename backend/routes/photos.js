const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadLimiter, apiLimiter } = require('../middleware/rateLimiter');

// Protected routes
router.post('/upload', uploadLimiter, auth, upload.single('photo'), photoController.uploadPhoto);
router.get('/', apiLimiter, photoController.getAllPhotos);
router.get('/:id', apiLimiter, photoController.getPhotoById);
router.post('/filter-by-face', apiLimiter, auth, photoController.filterPhotosByFace);
router.post('/add-face-descriptor', apiLimiter, auth, photoController.addFaceDescriptor);
router.post('/:id/like', apiLimiter, auth, photoController.likePhoto);
router.post('/:id/comment', apiLimiter, auth, photoController.addComment);
router.delete('/:id', apiLimiter, auth, photoController.deletePhoto);

module.exports = router;
