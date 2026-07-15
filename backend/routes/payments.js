const express = require("express");
const Payment = require("../models/Payment");
const Customer = require("../models/Customer");
const requireAuth = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// GET /api/payments
router.get("/", async (req, res) => {
  const payments = await Payment.find()
    .populate("customer_id", "customer_name")
    .sort({ _id: -1 });

  const data = payments.map((p) => ({
    id: p._id,
    customer_name: p.customer_id ? p.customer_id.customer_name : "Unknown",
    amount: p.amount,
    payment_date: p.payment_date
  }));

  res.json(data);
});

// POST /api/payments  (used by both "add_payment" and "add_due_payment" forms)
router.post("/", async (req, res) => {
  const { customer_id, amount, payment_method } = req.body;

  if (!customer_id || amount == null || !payment_method) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const pay = parseFloat(amount);

  const customer = await Customer.findById(customer_id);
  if (!customer) return res.status(404).json({ error: "Customer not found" });

  const payment = await Payment.create({
    customer_id,
    amount: pay,
    payment_method
  });

  customer.due_amount = (customer.due_amount || 0) - pay;
  await customer.save();

  res.status(201).json(payment);
});

// DELETE /api/payments/:id
router.delete("/:id", async (req, res) => {
  const payment = await Payment.findByIdAndDelete(req.params.id);
  if (!payment) return res.status(404).json({ error: "Payment not found" });
  res.json({ message: "Payment deleted" });
});

module.exports = router;
