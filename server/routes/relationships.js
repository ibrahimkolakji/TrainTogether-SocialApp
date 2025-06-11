const express = require('express');
const { getRelationships, addRelationship, deleteRelationship } = require('../controllers/relationship.js');
const router = express.Router();

router.get("/", getRelationships); // Define the GET route for relationships
router.post("/", addRelationship); // Define the POST route to add a relationship
router.delete("/", deleteRelationship); // Define the DELETE route to remove a relationship
module.exports = router;
