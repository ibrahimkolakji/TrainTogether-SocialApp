const db = require("../connect.js");
const jwt = require("jsonwebtoken"); // JWT für Authentifizierung

const getFriends = (req, res) => {
  const userId = req.params.userId;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  const q = `
    SELECT u.id, u.username, u.profile_picture 
    FROM relationships AS r
    JOIN users AS u ON u.id = r.followedUserId
    WHERE r.followerUserId = ?
  `;

  db.all(q, [userId], (err, data) => {
    if (err) return res.status(500).json({ error: "Internal server error" });
    res.status(200).json(data || []);
  });
};


module.exports = { getFriends };