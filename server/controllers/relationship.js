const db = require("../connect.js");

const getRelationships = (req, res) => {
  const userId = req.query.userId; // Ensure userId is passed in the query

  if (!userId) {
    return res.status(400).json({ error: "Missing userId parameter" });
  }

  const q = `
    SELECT u.id, u.username, u.profile_picture 
    FROM relationships AS r
    JOIN users AS u ON u.id = r.followedUserId
    WHERE r.followerUserId = ?
  `;

  db.all(q, [userId], (err, data) => {
    if (err) {
      console.error("Database error:", err); // Log the error for debugging
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!data || data.length === 0) {
      return res.status(200).json([]); // Return an empty array if no relationships are found
    }
    return res.status(200).json(data);
  });
};

module.exports = { getRelationships };
