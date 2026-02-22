const mongoose = require("mongoose");
const User = require("./models/user_model");
require("dotenv").config({ path: "./config/config.env" }); 

const createAdmin = async () => {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI); 

    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("Admin already exists!");
      process.exit(0);
    }

    const admin = await User.create({
      fullName: "DaisyBrew Admin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    });

    console.log("Admin created successfully:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();