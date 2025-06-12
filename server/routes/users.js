const express = require("express");
const {
  getUser,
  searchUsers,
  updateUser,
  uploadProfilePic,
  upload,
  getSuggestions,
} = require("../controllers/user.js");

const router = express.Router();

router.get("/find/:userId", getUser);
router.get("/search", searchUsers);
router.put("/update", updateUser);
router.post("/upload", upload.single("file"), uploadProfilePic); // ✅ neue Route
router.get("/suggestions", getSuggestions); // Route to fetch user suggestions

module.exports = router;
