const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        default: ""
    },
    venue: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ["Blood Donation", "Tree Plantation", "Awareness Rally", "Cleaning Campaign", "Social Service", "Medical Camp", "Educational", "Other"]
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    participantLimit: {
        type: Number,
        default: 100
    },
    registeredStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    posterImage: {
        type: String,
        default: "" // Store image URL (Cloudinary or local fallback)
    },
    status: {
        type: String,
        enum: ["Upcoming", "Active", "Completed"],
        default: "Upcoming"
    },
    volunteerRequirements: {
        type: String,
        default: "Active participation and NSS uniform"
    },
    hoursCredited: {
        type: Number,
        default: 3 // Default volunteer hours earned by attending this event
    },
    attendanceCode: {
        type: String,
        default: ""
    },
    attendanceCodeExpiresAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
