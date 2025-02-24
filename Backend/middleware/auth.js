const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid Token" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "Admin") return res.status(403).json({ message: "Forbidden" });
  next();
};

module.exports = { protect, adminOnly };
