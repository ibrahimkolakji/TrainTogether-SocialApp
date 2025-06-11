const express = require("express");
const { getNotifications
} = require("../controllers/notification.js");

const router = express.Router();

router.get("/", getNotifications); // Route to fetch notifications


module.exports = router;
