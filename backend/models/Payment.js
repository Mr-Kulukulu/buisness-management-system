const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  amount: { type: Number, required: true },
  payment_method: { type: String, required: true },
  payment_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", paymentSchema);
