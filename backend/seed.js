// Creates a default admin user. Run once with: npm run seed
require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");

async function seed() {
  await connectDB();

  const existing = await User.findOne({ username: "admin" });
  if (existing) {
    console.log("Admin user already exists.");
    process.exit(0);
  }

  const hash = await bcrypt.hash("admin123", 10);
  await User.create({ username: "admin", password: hash });

  console.log("Created default admin user -> username: admin | password: admin123");
  process.exit(0);
}

seed();
