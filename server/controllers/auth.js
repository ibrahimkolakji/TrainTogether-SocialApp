const db = require("../connect.js"); // sqlite3-Verbindung
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // JWT für Authentifizierung

const register = (req, res) => { // Check if username and email are provided
    const q = "SELECT * FROM users WHERE username = ?"; // Check if username already exists

    db.get(q, [req.body.username], (err, row) => { // Check if there was an error
        if (err) return res.status(500).json(err); // Check if username already exists
        if (row) return res.status(409).json("User already exists"); 

        const salt = bcrypt.genSaltSync(10);// Generate a salt for hashing
        const hash = bcrypt.hashSync(req.body.password, salt); // Hash the password

        const insertQuery = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"; // Insert the new user into the database
        db.run(insertQuery, [req.body.username, req.body.email, hash], function (err) { // Check if there was an error
            if (err) return res.status(500).json(err); // Check if the user was created successfully
            return res.status(201).json("User has been created"); // Return success message
        });
    });
};

module.exports = { register };

const login = (req, res) => {
    const q = "SELECT * FROM users WHERE username = ?";
    db.get(q, [req.body.username], (err, row) => {
        if (err) return res.status(500).json(err);
        if (!row) return res.status(404).json("User not found");

        const isPasswordCorrect = bcrypt.compareSync(req.body.password, row.password);
        if (!isPasswordCorrect) return res.status(400).json("Wrong password or username");

        const token = jwt.sign({ id : row.id },"secretkey");

        const { password, ...others } = row; // Exclude the password from the user object
        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).json(others); // Send the user data back to the client
    });
}; 


const logout = (req, res)=>{
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true
    }).status(200).json("User has been logged out"); // Clear the cookie and send a response 
};
module.exports = { login, register, logout };