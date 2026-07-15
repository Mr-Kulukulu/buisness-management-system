const express = require("express");
const Sale = require("../models/Sale");
const Product = require("../models/Product");
const requireAuth = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function startOfYear() {
  const d = new Date();
  return new Date(d.getFullYear(), 0, 1);
}

async function sumSalesSince(date) {
  const result = await Sale.aggregate([
    { $match: date ? { sale_date: { $gte: date } } : {} },
    { $group: { _id: null, total: { $sum: "$total_price" } } }
  ]);
  return result[0]?.total || 0;
}

router.get("/", async (req, res) => {
  const revenueAgg = await Sale.aggregate([
    { $group: { _id: null, total: { $sum: "$total_price" } } }
  ]);
  const profitAgg = await Sale.aggregate([
    { $group: { _id: null, total: { $sum: "$profit" } } }
  ]);
  const products = await Product.find();
  const stock_value = products.reduce(
    (sum, p) => sum + p.cost_price * p.stock_quantity,
    0
  );

  const today_sales = await sumSalesSince(startOfToday());
  const month_sales = await sumSalesSince(startOfMonth());
  const year_sales = await sumSalesSince(startOfYear());

  res.json({
    revenue: revenueAgg[0]?.total || 0,
    profit: profitAgg[0]?.total || 0,
    total_stock_value: stock_value,
    today_sales,
    month_sales,
    year_sales
  });
});

module.exports = router;
