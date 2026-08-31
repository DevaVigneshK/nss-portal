const mongoose = require("mongoose");

const connectDB = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000,
            socketTimeoutMS: 10000,
            maxPoolSize: 10
        });

        console.log("MongoDB Connected");

    } catch (error) {

        console.error(`MongoDB connection failed: ${error.message}`);
        throw error;

    }
};

module.exports = connectDB;