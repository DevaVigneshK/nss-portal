const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    status: {
        type: String,
        enum: ["Present", "Absent"],
        default: "Present"
    },
    checkInTime: {
        type: Date,
        default: Date.now
    },
    checkOutTime: {
        type: Date
    },
    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    otpCode: {
        type: String,
        default: ""
    },
    hoursCredited: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Prevent duplicate attendance for the same student-event pair
attendanceSchema.index({ studentId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);