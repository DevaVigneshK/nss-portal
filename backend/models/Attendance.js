const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    },

    status: {
        type: String,
        default: "Present"
    },

    checkInTime: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);