require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const User = require("./models/User");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const customerRoutes = require("./routes/customers");
const salesRoutes = require("./routes/sales");
const paymentRoutes = require("./routes/payments");
const dashboardRoutes = require("./routes/dashboard");
const backupRoutes = require("./routes/backup");

const app = express();

async function ensureAdminUser() {
  try {
    const existing = await User.findOne({ username: "admin" });
    if (existing) return;

    const hash = await bcrypt.hash("admin123", 10);
    await User.create({ username: "admin", password: hash });
    console.log("Default admin user created -> username: admin | password: admin123");
  } catch (err) {
    console.error("Could not auto-create admin user:", err.message);
  }
}

connectDB().then(ensureAdminUser);

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/backup", backupRoutes);

app.get("/", (req, res) => {
  res.json({ status: "Kazi Electric API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));