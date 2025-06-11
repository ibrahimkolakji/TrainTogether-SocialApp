const db = require("../connect.js");
const jwt = require("jsonwebtoken"); // JWT für Authentifizierung
const getNotifications = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token invalid");

    const q = `
    SELECT 
  n.*, 
  u.username, 
  u.profile_picture, 
  p.description AS post_description, 
  p.image,
  c.comment AS comment_text
FROM notifications AS n
JOIN users AS u ON n.sender_id = u.id
JOIN posts AS p ON n.post_id = p.id
LEFT JOIN comments AS c ON n.comment_id = c.id
WHERE n.recipient_id = ?
ORDER BY n.created_at DESC
LIMIT 20;
    `;

    db.all(q, [userInfo.id], (err, rows) => {
      if (err) return res.status(500).json(err);
      res.status(200).json(rows);
    });
  });
};
module.exports = { getNotifications };
