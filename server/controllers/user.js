const db = require("../connect.js");
const jwt = require("jsonwebtoken");

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

module.exports = { getUser };