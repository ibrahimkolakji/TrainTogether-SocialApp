const db = require("../connect.js");
const jwt = require("jsonwebtoken");

// Likes abrufen
const getLikes = (req, res) => {
  const postId = req.query.postId;
  if (!postId) return res.status(400).json("postId fehlt");

  const q = `SELECT userId FROM dabei WHERE postId = ?`;
  db.all(q, [postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((like) => like.userId));
  });
};

const addLike = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("You are not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const userId = userInfo.id;
    const postId = req.body.postId;

    const checkQuery = `SELECT 1 FROM dabei WHERE userId = ? AND postId = ?`;
    db.get(checkQuery, [userId, postId], (err, row) => {
      if (err) return res.status(500).json(err);
      if (row) return res.status(400).json("Already liked");

      const insertQuery = `INSERT INTO dabei (userId, postId) VALUES (?, ?)`;
      db.run(insertQuery, [userId, postId], function (err) {
        if (err) return res.status(500).json(err);

        // After successfully liking, insert notification
        db.get(
          `SELECT user_id FROM posts WHERE id = ?`,
          [postId],
          (err, post) => {
            if (!err && post && post.user_id !== userId) {
              const nQuery = `
                INSERT INTO notifications (recipient_id, sender_id, post_id, type, created_at)
                VALUES (?, ?, ?, 'like', ?)
              `;
              db.run(nQuery, [post.user_id, userId, postId, new Date().toISOString()]);
            }
          }
        );

        // ✅ Final response only once
        return res.status(201).json({ message: "Like added", id: this.lastID });
      });
    });
  });
};

// Like entfernen
const deleteLike = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("You are not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const postId = req.query.postId;
    const userId = userInfo.id;

    const q = `DELETE FROM dabei WHERE userId = ? AND postId = ?`;
    const values = [userId, postId];

    db.run(q, values, function (err) {
      if (err) return res.status(500).json(err);
      return res.status(200).json({ message: "Like deleted" });
    });
  });
};

module.exports = { getLikes, addLike, deleteLike };
