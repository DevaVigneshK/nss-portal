const mongoose = require("mongoose");
const User = require("./models/User");

const MONGO_URI = "mongodb+srv://Devavignesh:Deva%402005@devavignesh.jktmks4.mongodb.net/test";

const query = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        const admins = await User.find({ role: "admin" });
        console.log("Admins found:");
        admins.forEach(admin => {
            console.log(`Name: ${admin.name}, Email: ${admin.email}, Role: ${admin.role}, PasswordHash: ${admin.password}`);
        });

        const organizers = await User.find({ role: "organizer" });
        console.log("Organizers found:");
        organizers.forEach(org => {
            console.log(`Name: ${org.name}, Email: ${org.email}, Role: ${org.role}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

query();
