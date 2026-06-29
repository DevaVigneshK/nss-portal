const express = require("express");
const router = express.Router();

const {
    register,
    createStaffCoordinator,
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

const staffOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === "admin" || req.user.role === "organizer")) {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Staff or Admin role required." });
    }
};

router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

// Admin-only endpoints
router.post("/staff", authMiddleware, adminOnly, createStaffCoordinator);
router.get("/users", authMiddleware, staffOrAdmin, getAllUsers);
router.put("/users/:id", authMiddleware, adminOnly, updateUserStatus);

module.exports = router;
