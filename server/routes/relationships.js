const express = require('express');
const { getRelationships } = require('../controllers/relationship.js');
const router = express.Router();

router.get("/", getRelationships); // Define the GET route for relationships

module.exports = router;
