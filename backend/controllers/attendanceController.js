const Attendance = require("../models/Attendance");

exports.markAttendance = async (req, res) => {

    try {

        const attendance = await Attendance.create(req.body);

        res.status(201).json({
            message: "Attendance Marked",
            attendance
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

exports.getAttendance = async (req, res) => {

    try {

        const attendance = await Attendance.find()
            .populate("studentId")
            .populate("eventId");

        res.status(200).json(attendance);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};