const express = require("express");
const router = express.Router();
const { getNotifications, markAsRead, createSystemNotification } = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getNotifications);
router.put("/read", authMiddleware, markAsRead);
router.post("/", authMiddleware, createSystemNotification);

module.exports = router;
