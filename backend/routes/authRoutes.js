const express = require("express");
const router = express.Router();

const {
    register,
    login,
    getProfile,
    updateProfile,
    getAllUsers,
    updateUserStatus
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Role authorization helper middlewares
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Admin role required." });
    }
};

router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

// Admin-only endpoints
router.get("/users", authMiddleware, adminOnly, getAllUsers);
router.put("/users/:id", authMiddleware, adminOnly, updateUserStatus);

module.exports = router;