const mongoose = require("mongoose");

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error("Error: MONGO_URI is not defined in .env".red.bold);
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`.green.bold);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`.red.bold);
        process.exit(1);
    }
};

module.exports = connectDB;
