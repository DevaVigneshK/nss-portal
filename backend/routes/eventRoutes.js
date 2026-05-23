const express = require("express");
const router = express.Router();

const {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    registerForEvent
} = require("../controllers/eventController");

const authMiddleware = require("../middleware/authMiddleware");

// Role authorization helper middleware
const staffOnly = (req, res, next) => {
    if (req.user && (req.user.role === "organizer" || req.user.role === "admin")) {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Organizer or Admin role required." });
    }
};

router.get("/", getEvents);
router.get("/:id", getEventById);

// Staff only event CRUD
router.post("/", authMiddleware, staffOnly, createEvent);
router.put("/:id", authMiddleware, staffOnly, updateEvent);
router.delete("/:id", authMiddleware, staffOnly, deleteEvent);

// Student registration
router.post("/:id/register", authMiddleware, registerForEvent);

module.exports = router;