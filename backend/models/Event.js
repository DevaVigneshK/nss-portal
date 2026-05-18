const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    date: {
        type: String
    },

    venue: {
        type: String
    },

    category: {
        type: String
    },

    organizer: {
        type: String
    }

}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);