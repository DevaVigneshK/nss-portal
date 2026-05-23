const express = require("express");
const router = express.Router();

const {
    markAttendance,
    getAttendance,
    generateAttendanceCode,
    selfCheckIn
} = require("../controllers/attendanceController");

const authMiddleware = require("../middleware/authMiddleware");

// Role authorization helpers
const staffOnly = (req, res, next) => {
    if (req.user && (req.user.role === "organizer" || req.user.role === "admin")) {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Organizer or Admin role required." });
    }
};

// Route definitions
router.get("/", authMiddleware, getAttendance);
router.post("/", authMiddleware, staffOnly, markAttendance);
router.post("/generate-qr", authMiddleware, staffOnly, generateAttendanceCode);
router.post("/check-in", authMiddleware, selfCheckIn);

module.exports = router;