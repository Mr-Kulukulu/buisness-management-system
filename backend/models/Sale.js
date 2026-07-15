const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  quantity: { type: Number, required: true },
  unit_cost: { type: Number, required: true },
  actual_selling_price: { type: Number, required: true },
  total_price: { type: Number, required: true },
  profit: { type: Number, required: true },
  invoice_id: { type: String, required: true },
  sale_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Sale", saleSchema);
