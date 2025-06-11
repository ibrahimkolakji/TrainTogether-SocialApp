const express = require('express');
const { getFriends } = require('../controllers/friend.js');
const router = express.Router();

router.get("/:userId", getFriends);


module.exports = router;