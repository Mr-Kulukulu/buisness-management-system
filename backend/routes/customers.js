const express = require("express");
const mongoose = require("mongoose");
const Customer = require("../models/Customer");
const Sale = require("../models/Sale");
const requireAuth = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// GET /api/customers?search=  -> list with totals + most recent sale
router.get("/", async (req, res) => {
  const search = (req.query.search || "").trim();

  const match = search
    ? {
        $or: [
          { customer_name: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } }
        ]
      }
    : {};

  const customers = await Customer.find(match).sort({ createdAt: -1 }).lean();

  const results = await Promise.all(
    customers.map(async (c) => {
      const sales = await Sale.find({ customer_id: c._id }).sort({ sale_date: -1 });

      const total_price = sales.reduce((sum, s) => sum + s.total_price, 0);
      const profit = sales.reduce((sum, s) => sum + s.profit, 0);
      const recent = sales[0];

      let recentInfo = {};
      if (recent) {
        const product = await mongoose.model("Product").findById(recent.product_id);
        recentInfo = {
          invoice_id: recent.invoice_id,
          product_name: product ? product.product_name : "Unknown",
          quantity: recent.quantity,
          sale_date: recent.sale_date
        };
      }

      return {
        customer_id: c._id,
        customer_name: c.customer_name,
        phone: c.phone,
        address: c.address,
        due_amount: c.due_amount,
        total_price,
        profit,
        ...recentInfo
      };
    })
  );

  res.json(results);
});

// GET /api/customers/:id
router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).json({ error: "Customer not found" });
  res.json(customer);
});

// POST /api/customers
router.post("/", async (req, res) => {
  const { customer_name, phone, address } = req.body;

  if (!customer_name) {
    return res.status(400).json({ error: "Customer name is required" });
  }

  const customer = await Customer.create({ customer_name, phone, address });
  res.status(201).json(customer);
});

// PUT /api/customers/:id
router.put("/:id", async (req, res) => {
  const { customer_name, phone, address, due_amount } = req.body;

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { customer_name, phone, address, due_amount: parseFloat(due_amount || 0) },
    { new: true, runValidators: true }
  );

  if (!customer) return res.status(404).json({ error: "Customer not found" });
  res.json(customer);
});

// DELETE /api/customers/:id
router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) return res.status(404).json({ error: "Customer not found" });
  res.json({ message: "Customer deleted" });
});

module.exports = router;
