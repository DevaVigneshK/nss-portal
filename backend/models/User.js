const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["student", "admin", "organizer"],
        default: "student"
    },
    rollNumber: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    department: {
        type: String,
        default: ""
    },
    volunteerHours: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["Active", "Pending", "Suspended"],
        default: "Active"
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);