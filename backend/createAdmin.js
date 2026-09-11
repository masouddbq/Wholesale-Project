require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("./src/models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const phone = "09123456789";

    const existingUser = await User.findOne({ phone });

    if (!existingUser) {
      const passwordHash = await bcrypt.hash("12345678", 12);

      const admin = await User.create({
        name: "Admin",
        phone,
        passwordHash,
        role: "admin",
      });

      console.log("Admin created successfully");
      console.log(admin);
    } else {
      existingUser.role = "admin";

      await existingUser.save();

      console.log("Existing user promoted to admin");
    }

    await mongoose.disconnect();

    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Failed to create admin:");
    console.error(error.message);

    process.exit(1);
  }
};

createAdmin();