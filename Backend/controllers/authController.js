const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// ✅ Generate JWT Tokens (Access and Refresh Tokens)
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },  // ✅ Ensure role is included
    process.env.JWT_SECRET,
    { expiresIn: "15m" } 
  );

  const refreshToken = jwt.sign(
    { id: user._id, version: user.tokenVersion }, 
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// ✅ Register User
exports.registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body; // Accept role from frontend
    console.log("🟡 Registering user:", email, "Role:", role);

    let user = await User.findOne({ email });
    if (user) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ email, password: hashedPassword, role: role || "User" }); // Default role is "User"
    await user.save();

    console.log("✅ User registered successfully:", email);
    res.json({ message: "User registered successfully" });

  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🟡 Login attempt for email:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("✅ User found:", email, "Role:", user.role);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Incorrect password:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("🔑 Password matched, generating tokens...");
    const { accessToken, refreshToken } = generateTokens(user);
    console.log("🟢 Tokens generated successfully");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.json({ token: accessToken, role: user.role }); // ✅ Return role to frontend

  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Refresh Token (to generate a new accessToken)
exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(403).json({ message: "Refresh token missing" });

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("🔄 Refreshing token for:", user.email);

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.json({ token: accessToken, role: user.role });

  } catch (error) {
    console.error("❌ Refresh Token Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Logout User (Clears Cookies)
exports.logoutUser = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  console.log("🟢 User logged out");
  res.json({ message: "Logged out successfully" });
};

// ✅ Middleware: Authenticate User
exports.authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🛡️ Authenticated User:", decoded);
    
    req.user = decoded; // Attach user info to request
    next();

  } catch (error) {
    console.error("❌ Authentication Error:", error);
    res.status(401).json({ message: "Invalid/expired token" });
  }
};

// ✅ Middleware: Admin Only Access
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "Admin") {
    console.log("🚫 Access denied for non-admin:", req.user.role);
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};
