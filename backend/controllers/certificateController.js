const Certificate = require("../models/Certificate");
const Attendance = require("../models/Attendance");
const Event = require("../models/Event");
const crypto = require("crypto");

exports.generateCertificate = async (req, res) => {
    try {
        const { eventId } = req.body;
        const studentId = req.user.id;

        // Verify that the student actually attended the event
        const attendance = await Attendance.findOne({ studentId, eventId, status: "Present" });
        if (!attendance) {
            return res.status(400).json({ message: "You did not attend this event or attendance has not been logged" });
        }

        // Verify if a certificate is already generated
        const existingCertificate = await Certificate.findOne({ studentId, eventId });
        if (existingCertificate) {
            return res.status(200).json({
                message: "Certificate already exists",
                certificate: existingCertificate
            });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Generate a cryptographically secure verification hash
        const certHash = crypto
            .createHash("sha256")
            .update(`${studentId}-${eventId}-${Date.now()}`)
            .digest("hex")
            .substring(0, 16)
            .toUpperCase();

        const certificate = await Certificate.create({
            studentId,
            eventId,
            certificateHash: certHash,
            hoursCredited: attendance.hoursCredited || event.hoursCredited || 3,
            issuedBy: event.organizer
        });

        res.status(201).json({
            message: "Certificate generated successfully",
            certificate
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find({ studentId: req.user.id })
            .populate("eventId", "title date category venue organizer status hoursCredited")
            .populate("issuedBy", "name email");

        res.status(200).json(certificates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyCertificate = async (req, res) => {
    try {
        const { hash } = req.params;
        const certificate = await Certificate.findOne({ certificateHash: hash })
            .populate("studentId", "name email rollNumber department")
            .populate("eventId", "title date category venue status hoursCredited")
            .populate("issuedBy", "name role");

        if (!certificate) {
            return res.status(404).json({ message: "Invalid certificate verification hash" });
        }

        res.status(200).json({
            valid: true,
            certificate
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
