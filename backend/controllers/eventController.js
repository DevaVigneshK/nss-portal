const Event = require("../models/Event");

exports.createEvent = async (req, res) => {

    try {

        const event = await Event.create(req.body);

        res.status(201).json({
            message: "Event Created",
            event
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

exports.getEvents = async (req, res) => {

    try {

        const events = await Event.find();

        res.status(200).json(events);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};