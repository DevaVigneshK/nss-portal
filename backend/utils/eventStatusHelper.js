const Event = require("../models/Event");

const getEventEndDateTime = (dateStr, timeStr) => {
    if (!dateStr) return new Date(0);
    const [year, month, day] = dateStr.split("-").map(Number);
    let hours = 23;
    let minutes = 59;
    let seconds = 59;

    if (timeStr) {
        const cleanTime = timeStr.trim().toUpperCase();
        // Match formats like "10:00 AM", "10:00 PM", "10:00AM", "14:30"
        const match = cleanTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/);
        if (match) {
            let h = parseInt(match[1], 10);
            const m = parseInt(match[2], 10);
            const ampm = match[3];

            if (ampm) {
                if (ampm === "PM" && h < 12) h += 12;
                if (ampm === "AM" && h === 12) h = 0;
            }
            if (h >= 0 && h < 24 && m >= 0 && m < 60) {
                hours = h;
                minutes = m;
                seconds = 0;
            }
        }
    }

    return new Date(year, month - 1, day, hours, minutes, seconds);
};

const checkAndUpdateEventStatuses = async () => {
    try {
        const now = new Date();
        const events = await Event.find({ status: { $ne: "Completed" } });
        
        for (const event of events) {
            const eventEnd = getEventEndDateTime(event.date, event.time);
            if (eventEnd < now) {
                event.status = "Completed";
                await event.save();
            }
        }
    } catch (error) {
        console.error("Error updating event statuses automatically:", error);
    }
};

module.exports = {
    getEventEndDateTime,
    checkAndUpdateEventStatuses
};
