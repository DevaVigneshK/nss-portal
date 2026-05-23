const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/analyticsController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/stats", authMiddleware, getDashboardStats);

module.exports = router;
