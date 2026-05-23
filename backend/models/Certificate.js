const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
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
    certificateHash: {
        type: String,
        required: true,
        unique: true
    },
    hoursCredited: {
        type: Number,
        required: true
    },
    issuedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    issuedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model("Certificate", certificateSchema);
