const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const MONGO_URI = "mongodb+srv://Devavignesh:Deva%402005@devavignesh.jktmks4.mongodb.net/test";

const reset = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        const hashedPassword = await bcrypt.hash("admin123", 10);
        
        // Update or create admin@nec.com
        const admin = await User.findOneAndUpdate(
            { email: "admin@nec.com" },
            { 
                name: "Admin",
                password: hashedPassword,
                role: "admin",
                status: "Active"
            },
            { upsert: true, new: true }
        );

        console.log(`Admin user successfully updated/created:`);
        console.log(`Email: ${admin.email}`);
        console.log(`Password reset to: admin123`);

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error resetting admin password:", err);
    }
};

reset();
