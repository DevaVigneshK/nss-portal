const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const certificateRoutes = require("./routes/certificateRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Connect on demand so the Express app works both locally and as a Vercel Function.
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        next(error);
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/certificates", certificateRoutes);

app.get("/", (req, res) => {
    res.send("NSS Portal Backend Running");
});

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ message: "Database connection failed" });
});

if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    connectDB()
        .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
        .catch(() => {
            process.exitCode = 1;
        });
}

module.exports = app;
