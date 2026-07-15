const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  customer_name: { type: String, required: true, trim: true },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  due_amount: { type: Number, default: 0 }
}, { timestamps: { createdAt: "created_at", updatedAt: false } });

module.exports = mongoose.model("Customer", customerSchema);
