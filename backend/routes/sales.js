const express = require("express");
const Sale = require("../models/Sale");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const requireAuth = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// GET /api/sales
router.get("/", async (req, res) => {
  const sales = await Sale.find()
    .populate("product_id", "product_name")
    .populate("customer_id", "customer_name")
    .sort({ sale_date: -1 });

  const data = sales.map((s) => ({
    id: s._id,
    invoice_id: s.invoice_id,
    quantity: s.quantity,
    total_price: s.total_price,
    profit: s.profit,
    sale_date: s.sale_date,
    product_name: s.product_id ? s.product_id.product_name : "Unknown",
    customer_name: s.customer_id ? s.customer_id.customer_name : "Unknown"
  }));

  res.json(data);
});

// POST /api/sales  (mirrors add_sale logic: find-or-create customer by phone, decrement stock)
router.post("/", async (req, res) => {
  const {
    product_id,
    quantity,
    negotiated_price,
    due_amount,
    customer_name,
    customer_phone
  } = req.body;

  if (!product_id || !quantity || negotiated_price == null || !customer_name || !customer_phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const qty = parseInt(quantity);
  const price = parseFloat(negotiated_price);
  const due = parseFloat(due_amount || 0);

  const product = await Product.findById(product_id);
  if (!product) return res.status(404).json({ error: "Product not found" });

  if (qty > product.stock_quantity) {
    return res.status(400).json({ error: "Not enough stock" });
  }

  let customer = await Customer.findOne({ phone: customer_phone });

  if (!customer) {
    customer = await Customer.create({
      customer_name,
      phone: customer_phone,
      due_amount: due
    });
  } else {
    customer.due_amount = (customer.due_amount || 0) + due;
    await customer.save();
  }

  const unit_cost = product.cost_price;
  const total_price = price * qty;
  const profit = (price - unit_cost) * qty;
  const invoice_id = `INV-${Date.now()}`;

  const sale = await Sale.create({
    product_id,
    customer_id: customer._id,
    quantity: qty,
    unit_cost,
    actual_selling_price: price,
    total_price,
    profit,
    invoice_id
  });

  product.stock_quantity -= qty;
  await product.save();

  res.status(201).json(sale);
});

module.exports = router;
