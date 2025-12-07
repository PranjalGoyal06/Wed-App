const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Protected routes
router.post('/upload', auth, upload.single('photo'), photoController.uploadPhoto);
router.get('/', photoController.getAllPhotos);
router.get('/:id', photoController.getPhotoById);
router.post('/filter-by-face', auth, photoController.filterPhotosByFace);
router.post('/add-face-descriptor', auth, photoController.addFaceDescriptor);
router.post('/:id/like', auth, photoController.likePhoto);
router.post('/:id/comment', auth, photoController.addComment);
router.delete('/:id', auth, photoController.deletePhoto);

module.exports = router;
