const db = require("../connect.js");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");



const getUser = (req, res) => {
  const userId = req.params.userId;
  console.log("Requested userId:", req.params.userId);
  const q = "SELECT * FROM users WHERE id =? ";
  
db.get(q, [userId], (err, row) => {
  if (err) return res.status(500).json(err);
  if (!row) return res.status(404).json("User not found");

  const { password, ...others } = row;
  return res.status(200).json(others);
});
};
const searchUsers = (req, res) => {
  const { query } = req.query;

  if (!query) return res.status(400).json({ error: "Missing search query" });

  const q = `
    SELECT id, username, profile_picture
    FROM users
    WHERE username LIKE ?
    LIMIT 20
  `;

  db.all(q, [`%${query}%`], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    return res.status(200).json(rows);
  });
};


const updateUser = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is invalid");

    const { bio, profile_picture } = req.body;

    const q = `
      UPDATE users 
      SET bio = ?, profile_picture = ?
      WHERE id = ?
    `;

    db.run(q, [bio, profile_picture, userInfo.id], function (error) {
      if (error) {
        console.error("Update error:", error);
        return res.status(500).json({ error: "Database update failed." });
      }

      return res.status(200).json("Profile updated");
    });
  });
};

// Speicherort und Dateiname konfigurieren
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Stelle sicher, dass der Ordner existiert
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});


const upload = multer({ storage }); // exportierbares Middleware-Objekt

const uploadProfilePic = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is invalid");

    const profile_picture = "/uploads/" + req.file.filename;
    const q = "UPDATE users SET profile_picture = ? WHERE id = ?";

    db.run(q, [profile_picture, userInfo.id], function (error) {
      if (error) {
        console.error("Upload error:", error);
        return res.status(500).json({ error: "Image upload failed" });
      }

      return res.status(200).json({ profile_picture });
    });
  });
};

const getSuggestions = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("You are not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `
      SELECT id, username, profile_picture 
      FROM users 
      WHERE id != ? AND id NOT IN (
        SELECT followedUserId FROM relationships WHERE followerUserId = ?
      )
      LIMIT 5
    `;
    db.all(q, [userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};



module.exports = {
  getUser,
  searchUsers,
  updateUser,
  uploadProfilePic,
  upload,
  getSuggestions, // Add getSuggestions
};