const moment = require("moment/moment.js");
const db = require("../connect.js");
const jwt = require("jsonwebtoken"); // JWT für Authentifizierung
const multer = require("multer");
const emojiRegex = require("emoji-regex"); // Import emoji-regex library

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/posts");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

const getPosts = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("You are not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const userId = req.query.userId;

    if (userId) {
      const q = `
        SELECT p.*, u.id AS userId, u.username, u.profile_picture 
        FROM posts AS p 
        JOIN users AS u ON u.id = p.user_id 
        WHERE p.user_id = ?
        ORDER BY p.created_at DESC
      `;

      db.all(q, [userId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });

    } else {
  console.log("Authenticated as user:", userInfo.id);

  const q = `
    SELECT p.*, u.id AS userId, u.username, u.profile_picture
    FROM posts AS p
    JOIN users AS u ON u.id = p.user_id
    WHERE p.user_id = ?
       OR p.user_id IN (
         SELECT followedUserId FROM relationships WHERE followerUserId = ?
       )
    ORDER BY p.created_at DESC
  `;

  db.all(q, [userInfo.id, userInfo.id], (err, data) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json(err);
    }

    console.log("Feed posts returned:", data.length); // ✅ Jetzt korrekt
    return res.status(200).json(data);
  });
}
  });
};




const addPost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("You are not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const file = req.file ? `/uploads/posts/${req.file.filename}` : null; // Ensure file path is saved

    const regex = emojiRegex(); // Initialize emoji regex
    const containsEmoji = regex.test(req.body.description); // Check if description contains emojis

    const q = `
      INSERT INTO posts (sport_type, description, created_at, user_id, image, contains_emoji) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      req.body.sport_type,
      req.body.description,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      file,
      containsEmoji ? 1 : 0 // Store whether the description contains emojis
    ];

    db.run(q, values, function (err) {
      if (err) return res.status(500).json(err);
      return res.status(201).json({
        message: "Post created successfully",
        postId: this.lastID,
        image: file,
        containsEmoji: containsEmoji,
      });
    });
  });
};

const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("You are not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const postId = req.params.id;
    console.log("Post ID to delete:", postId); // Debugging log
    console.log("Authenticated user ID:", userInfo.id); // Debugging log

    const q = "DELETE FROM posts WHERE id = ? AND user_id = ?";
    db.run(q, [postId, userInfo.id], function (err) {
      if (err) {
        console.error("Database Error:", err); // Log database errors
        return res.status(500).json(err);
      }
      if (this.changes === 0) {
        console.log("No post found or unauthorized"); // Debugging log
        return res.status(404).json("Post not found or unauthorized");
      }
      console.log("Post deleted successfully"); // Debugging log
      return res.status(200).json("Post deleted successfully");
    });
  });
};

module.exports = { getPosts, addPost, deletePost };
