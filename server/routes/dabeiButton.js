const express = require('express');
const { getLikes, addLike, deleteLike} = require('../controllers/dabeiButton.js');
const router = express.Router();

router.get('/', getLikes)
router.post('/', addLike)
router.delete('/', deleteLike);
module.exports = router;
