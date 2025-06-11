const db = require("../connect.js");
const moment = require("moment/moment.js");
const jwt = require("jsonwebtoken");

// GET comments for a specific post
const getComments = (req, res) => {
  const q = `
    SELECT c.*, u.id AS userId, u.username, u.profile_picture 
    FROM comments AS c 
    JOIN users AS u ON u.id = c.user_id 
    WHERE c.post_id = ?
    ORDER BY c.created_at DESC
  `;

  db.all(q, [req.query.postId], (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(data);
  });
};

// ADD a comment and create a notification
const addComment = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json("You are not logged in");
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid");
    }

    const commentText = req.body.comment;
    const postId = req.body.postId;
    const userId = userInfo.id;
    const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");

    const q = `INSERT INTO comments (comment, created_at, user_id, post_id) VALUES (?, ?, ?, ?)`;
    const values = [commentText, createdAt, userId, postId];

    // Insert comment
    db.run(q, values, function (err) {
      if (err) return res.status(500).json(err);

      const commentId = this.lastID;

      // Notify post owner if commenter is not the post owner
      db.get(
        `SELECT user_id FROM posts WHERE id = ?`,
        [postId],
        (err, post) => {
          if (!err && post && post.user_id !== userId) {
            const nQuery = `
              INSERT INTO notifications (recipient_id, sender_id, post_id, comment_id, type, created_at)
              VALUES (?, ?, ?, ?, 'comment', ?)
            `;
            const nValues = [
              post.user_id,
              userId,
              postId,
              commentId,
              createdAt
            ];
            db.run(nQuery, nValues);
          }
        }
      );

      return res.status(201).json({
        message: "Comment created",
        commentId,
      });
    });
  });
};

module.exports = { getComments, addComment };
