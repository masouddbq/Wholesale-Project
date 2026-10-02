const bcrypt = require("bcryptjs");
const User = require("./src/models/User");

const ensureAdmin = async () => {
  const phone = process.env.ADMIN_PHONE;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";

  if (!phone || !password) {
    return;
  }

  const existing = await User.findOne({ phone });

  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
      console.log("Existing user promoted to admin");
    }
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await User.create({
    name,
    phone,
    passwordHash,
    role: "admin",
  });

  console.log("Admin user created");
};

module.exports = ensureAdmin;
