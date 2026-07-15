const express = require("express");
const Product = require("../models/Product");
const requireAuth = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// GET /api/products?search=
router.get("/", async (req, res) => {
  const search = (req.query.search || "").trim();
  const filter = search
    ? { product_name: { $regex: search, $options: "i" } }
    : {};

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

// POST /api/products
router.post("/", async (req, res) => {
  const { product_name, category, cost_price, sell_price, stock_quantity } = req.body;

  if (!product_name || cost_price == null || sell_price == null || stock_quantity == null) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const product = await Product.create({
    product_name,
    category,
    cost_price: parseFloat(cost_price),
    sell_price: parseFloat(sell_price),
    stock_quantity: parseInt(stock_quantity)
  });

  res.status(201).json(product);
});

// PUT /api/products/:id
router.put("/:id", async (req, res) => {
  const { product_name, category, cost_price, sell_price, stock_quantity } = req.body;

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      product_name,
      category,
      cost_price: parseFloat(cost_price),
      sell_price: parseFloat(sell_price),
      stock_quantity: parseInt(stock_quantity)
    },
    { new: true, runValidators: true }
  );

  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

// DELETE /api/products/:id
router.delete("/:id", async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json({ message: "Product deleted" });
});

module.exports = router;
