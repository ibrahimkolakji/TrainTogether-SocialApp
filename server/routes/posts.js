const express = require('express');
const multer = require('multer');
const path = require('path');
const { getPosts, addPost, deletePost } = require('../controllers/post.js');

const router = express.Router();

// Ensure uploads/posts folder exists and is public
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/posts");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get('/', getPosts);
router.post('/create', upload.single("file"), addPost); // Ensure multer handles the file upload
router.delete('/:id', deletePost); // Ensure the route matches the expected endpoint

module.exports = router;
