const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/users.js');
const postRoutes = require('./routes/posts.js');
const commentRoutes = require('./routes/comments.js');
const dabeiButtonRoutes = require('./routes/dabeiButton.js');
const relationshipRoutes = require('./routes/relationships.js'); // Ensure the route is imported correctly
const friendRoutes = require('./routes/friends.js'); // Import the friends route if needed
const notificationRoutes = require('./routes/notifications.js'); // Import the notifications route
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Setze Access-Control-Allow-Credentials explizit
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API ist erreichbar.");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes); // Ensure the route is registered correctly
app.use("/api/comments", commentRoutes);
app.use("/api/dabeiButton", dabeiButtonRoutes);
app.use("/api/relationships", relationshipRoutes); // Ensure the route is registered correctly
app.use("/api/friends", friendRoutes); 
app.use("/uploads", express.static("uploads")); // Serve uploaded files statically
app.use("/api/notifications", notificationRoutes);
// Start the server
app.listen(8800, () => {
  console.log("API Working on http://localhost:8800");
});
