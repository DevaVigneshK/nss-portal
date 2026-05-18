const express = require("express");

const router = express.Router();

const {
    markAttendance,
    getAttendance
} = require("../controllers/attendanceController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, markAttendance);

router.get("/", authMiddleware, getAttendance);

module.exports = router;