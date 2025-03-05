//authMiddleware.js
const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid Token" });
  }
};
// authMiddleware.js
exports.validateRoleUpdate = (req, res, next) => {
  const validRoles = ["User", "Manager", "Admin"];
  if (!validRoles.includes(req.body.role)) {
    return res.status(400).json({ message: "Invalid role" });
  }
  next();
};
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "Admin") return res.status(403).json({ message: "Forbidden" });
  next();
};
