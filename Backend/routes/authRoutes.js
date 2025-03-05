//authRoutes.js
const express = require("express");
const passport = require("passport");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

// ✅ Local Authentication
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
  res.redirect("http://localhost:5173/dashboard");
});

// ✅ GitHub OAuth
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/login" }), (req, res) => {
  res.redirect("http://localhost:5173/dashboard");
});

module.exports = router;

