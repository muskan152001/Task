//userRoutes.js
const express = require("express");
const User = require("../models/userModel");
const { verifyAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Get all users (Only Admins can access)
router.get("/users", verifyAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
});

// ✅ Update user role (Only Admins)
router.put("/users/:id", verifyAdmin, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { role: req.body.role });
        res.json({ message: "Role updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating role" });
    }
});

// ✅ Delete user (Only Admins)
router.delete("/users/:id", verifyAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
});

module.exports = router;
