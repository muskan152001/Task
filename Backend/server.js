require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const Keycloak = require("keycloak-connect");
const cookieParser = require("cookie-parser");
const https = require("https");
const fs = require("fs");

// Load Keycloak configuration
const keycloakConfig = require("./config/keycloakConfig.js");

// Initialize Keycloak
const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

// Passport configuration
require("./config/passport");

// Routes
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors({
  origin: "http://localhost:5174",
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type"]
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

// Keycloak middleware
app.use(keycloak.middleware());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);

// Public Route
app.get("/", (req, res) => {
  res.json({ message: "Public Route - No Auth Needed" });
});

// Protected Route with Keycloak
app.get("/protected", keycloak.protect(), (req, res) => {
  res.json({ message: "Protected Route - Authenticated!" });
});

// Secure Route with mTLS
app.get("/secure", (req, res) => {
  if (!req.socket.authorized) {
    return res.status(403).send("Access Denied - Invalid Certificate");
  }
  res.send("🔒 Hello, Mutual TLS Authenticated User!");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Load TLS Certificates for HTTPS/mTLS
const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.crt"),
  ca: fs.readFileSync("rootCA.pem"),
  requestCert: true,
  rejectUnauthorized: true, // Reject unauthenticated clients
};

// Start HTTP Server (for non-secure API)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 HTTP Server running on port ${PORT}`));

// Start HTTPS Server (for secure mTLS endpoints)
https.createServer(options, app).listen(443, () => {
  console.log("🔒 Secure mTLS server running on port 443");
});
