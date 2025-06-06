const moment = require("moment/moment.js");
const db = require("../connect.js");
const jwt = require("jsonwebtoken"); // JWT für Authentifizierung

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
  if (!token) {
    console.log("Kein Token gefunden!");
    return res.status(401).json("You are not logged in");
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid");
    }

    const q = `INSERT INTO posts (sport_type, title, description, created_at, user_id) VALUES (?, ?, ?, ?, ?)`;
    const values = [
      req.body.sport_type,
      req.body.title,
      req.body.description,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id
    ];

    db.run(q, values, function (err) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(201).json({
        message: "Post has been created successfully",
        postId: this.lastID // SQLite: last inserted row ID
      });
    });
  });
};
module.exports = { getPosts, addPost };