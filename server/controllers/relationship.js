const db = require("../connect.js");
const jwt = require("jsonwebtoken"); // JWT für Authentifizierung

const getRelationships = (req, res) => {
  const { followerUserId, followedUserId } = req.query;

  if (!followerUserId || !followedUserId) {
    return res.status(400).json({ error: "Missing userId parameters" });
  }

  const q = `SELECT 1 FROM relationships WHERE followerUserId = ? AND followedUserId = ?`;

  db.get(q, [followerUserId, followedUserId], (err, row) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    return res.status(200).json(row ? [true] : []);
  });
};

const addRelationship = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token invalid");

    const q = "INSERT INTO relationships (followerUserId, followedUserId) VALUES (?, ?)";
    db.run(q, [userInfo.id, req.body.userId], function (err) {
      if (err) return res.status(500).json(err);
      res.status(200).json("Followed");
    });
  });
};

const deleteRelationship = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token invalid");

    const q = "DELETE FROM relationships WHERE followerUserId = ? AND followedUserId = ?";
    db.run(q, [userInfo.id, req.query.userId], function (err) {
      if (err) return res.status(500).json(err);
      res.status(200).json("Unfollowed");
    });
  });
};

module.exports = { getRelationships, addRelationship, deleteRelationship };
