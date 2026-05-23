const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(30);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user.id, read: false },
            { $set: { read: true } }
        );
        res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createSystemNotification = async (req, res) => {
    try {
        const { userId, title, message, type } = req.body;
        
        // Only Admins or Organizers can broadcast system alerts
        const notification = await Notification.create({
            userId,
            title,
            message,
            type: type || "info"
        });

        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
