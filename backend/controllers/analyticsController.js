const Event = require("../models/Event");
const User = require("../models/User");
const Attendance = require("../models/Attendance");

exports.getDashboardStats = async (req, res) => {
    try {
        const totalEvents = await Event.countDocuments();
        const upcomingEvents = await Event.countDocuments({ status: "Upcoming" });
        const activeEvents = await Event.countDocuments({ status: "Active" });
        const completedEvents = await Event.countDocuments({ status: "Completed" });

        const totalVolunteers = await User.countDocuments({ role: "student" });
        const totalOrganizers = await User.countDocuments({ role: "organizer" });

        // Calculate total volunteer hours across all students
        const students = await User.find({ role: "student" });
        const totalHours = students.reduce((acc, curr) => acc + (curr.volunteerHours || 0), 0);

        // Fetch leaderboard (top volunteers)
        const leaderboard = await User.find({ role: "student" })
            .sort({ volunteerHours: -1 })
            .limit(10)
            .select("name email department rollNumber volunteerHours");

        // Department-wise counts for analytics
        const deptStats = await User.aggregate([
            { $match: { role: "student" } },
            { $group: { _id: "$department", count: { $sum: 1 }, totalHours: { $sum: "$volunteerHours" } } }
        ]);

        // Category-wise event distributions
        const categoryStats = await Event.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            metrics: {
                totalEvents,
                upcomingEvents,
                activeEvents,
                completedEvents,
                totalVolunteers,
                totalOrganizers,
                totalHours
            },
            leaderboard,
            deptStats,
            categoryStats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
