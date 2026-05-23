const Event = require("../models/Event");

exports.createEvent = async (req, res) => {
    try {
        // Automatically inject organizer id if not provided, or verify permissions
        const eventData = {
            ...req.body,
            organizer: req.user.role === "admin" ? (req.body.organizer || req.user.id) : req.user.id
        };

        const event = await Event.create(eventData);

        res.status(201).json({
            message: "Event Created Successfully",
            event
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEvents = async (req, res) => {
    try {
        const { status, category } = req.query;
        let query = {};
        if (status) query.status = status;
        if (category) query.category = category;

        const events = await Event.find(query)
            .populate("organizer", "name email department")
            .populate("registeredStudents", "name email department rollNumber")
            .sort({ createdAt: -1 });

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate("organizer", "name email department phone")
            .populate("registeredStudents", "name email department rollNumber phone");

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Restrict edits to admin or the specific organizer who created it
        if (req.user.role !== "admin" && event.organizer.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to update this event" });
        }

        const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (req.user.role !== "admin" && event.organizer.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this event" });
        }

        await Event.findByIdAndDelete(id);
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Student registration for an event
exports.registerForEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const studentId = req.user.id;

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (event.status === "Completed") {
            return res.status(400).json({ message: "Cannot register for a completed event" });
        }

        // Check if student is already registered
        if (event.registeredStudents.includes(studentId)) {
            return res.status(400).json({ message: "You are already registered for this event" });
        }

        // Check participant limit
        if (event.registeredStudents.length >= event.participantLimit) {
            return res.status(400).json({ message: "Participant limit reached for this event" });
        }

        event.registeredStudents.push(studentId);
        await event.save();

        res.status(200).json({ message: "Successfully registered for event", event });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};