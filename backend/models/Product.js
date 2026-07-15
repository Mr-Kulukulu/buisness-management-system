const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product_name: { type: String, required: true, trim: true },
  category: { type: String, default: "" },
  cost_price: { type: Number, required: true, default: 0 },
  sell_price: { type: Number, required: true, default: 0 },
  stock_quantity: { type: Number, required: true, default: 0 }
}, { timestamps: { createdAt: "created_at", updatedAt: false } });

module.exports = mongoose.model("Product", productSchema);
