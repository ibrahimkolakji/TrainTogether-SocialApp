const db = require("../connect.js");
const moment = require("moment/moment.js");
const jwt = require("jsonwebtoken"); 
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
}

const addComment = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    console.log("Kein Token gefunden!");
    return res.status(401).json("You are not logged in");
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid");
    }

    const q = `INSERT INTO comments ( comment, created_at, user_id, post_id) VALUES (?, ?, ?, ?)`;
    const values = [
      req.body.comment,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.postId
    ];

   db.run(q, values, function (err) {
  console.log("SQL:", q);
  console.log("Werte:", values);
  if (err) {
    console.log("SQLite Fehler:", err);  // <<< DAS ist wichtig
    return res.status(500).json(err);
  }
  return res.status(201).json({
    message: "Comment created",
    commentId: this.lastID
  });
});
  });
};

module.exports = { getComments, addComment};