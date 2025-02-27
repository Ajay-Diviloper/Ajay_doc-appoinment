const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectdb = require("./confing/db");
const path = require("path");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectdb();

const app = express();

// Middleware
app.use(express.json()); // Enable JSON parsing for API requests
app.use(morgan("dev")); // Logging middleware

// API Routes
app.use("/api", require("./routes/userroutes"));
app.use("/api/admin", require("./routes/adminroutes"));
app.use("/api/doctor", require("./routes/Doctorroutes"));

app.use("/api/otp", require("./routes/otpRoutes")); // ✅ This is the correct OTP route

// Serve frontend (React build folder)
app.use(express.static(path.join(__dirname, "../client/build")));

// Serve frontend for any unmatched routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// Default home route
app.get("/", (req, res) => {
  return res.status(200).send("Welcome to our application!");
});

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
