const express = require("express");
const multer = require("multer");
const ExcelJS = require("exceljs");
const requireAuth = require("../middleware/auth");

const Customer = require("../models/Customer");
const Product = require("../models/Product");
const Sale = require("../models/Sale");
const Payment = require("../models/Payment");

const router = express.Router();
router.use(requireAuth);

const upload = multer({ storage: multer.memoryStorage() });

// GET /api/backup/export -> downloads an .xlsx snapshot of the whole database
router.get("/export", async (req, res) => {
  const customers = await Customer.find().lean();
  const products = await Product.find().lean();
  const sales = await Sale.find().populate("product_id", "product_name").lean();
  const payments = await Payment.find().populate("customer_id", "customer_name").lean();

  const wb = new ExcelJS.Workbook();

  // ---- Dashboard summary ----
  const total_revenue = sales.reduce((s, x) => s + x.total_price, 0);
  const total_profit = sales.reduce((s, x) => s + x.profit, 0);
  const total_due = customers.reduce((s, c) => s + (c.due_amount || 0), 0);
  const total_stock_value = products.reduce((s, p) => s + p.stock_quantity * p.cost_price, 0);

  const wsSummary = wb.addWorksheet("Dashboard");
  wsSummary.addRows([
    ["Business Summary"],
    [],
    ["Total Revenue", total_revenue],
    ["Total Profit", total_profit],
    ["Total Customer Due", total_due],
    ["Total Inventory Value", total_stock_value],
    ["Total Products", products.length],
    ["Total Customers", customers.length]
  ]);

  // ---- Customers ----
  const wsCust = wb.addWorksheet("Customers");
  wsCust.addRow([
    "ID", "Customer Name", "Phone", "Address", "Due Amount", "Created At"
  ]);
  customers.forEach((c) => {
    wsCust.addRow([
      c._id.toString(), c.customer_name, c.phone, c.address, c.due_amount, c.created_at
    ]);
  });

  // ---- Products (Inventory) ----
  const wsStock = wb.addWorksheet("Products");
  wsStock.addRow([
    "ID", "Product Name", "Category", "Cost Price", "Sell Price", "Stock Quantity", "Created At"
  ]);
  products.forEach((p) => {
    wsStock.addRow([
      p._id.toString(), p.product_name, p.category, p.cost_price, p.sell_price, p.stock_quantity, p.created_at
    ]);
  });

  // ---- Sales ----
  const wsSales = wb.addWorksheet("Sales");
  wsSales.addRow([
    "ID", "Invoice ID", "Product ID", "Product Name", "Customer ID",
    "Quantity", "Total Price", "Profit", "Sale Date"
  ]);
  sales.forEach((s) => {
    wsSales.addRow([
      s._id.toString(), s.invoice_id, s.product_id?._id?.toString() || "",
      s.product_id?.product_name || "", s.customer_id?.toString() || "",
      s.quantity, s.total_price, s.profit, s.sale_date
    ]);
  });

  // ---- Payments ----
  const wsPay = wb.addWorksheet("Payments");
  wsPay.addRow([
    "ID", "Customer ID", "Customer Name", "Amount", "Payment Method", "Payment Date"
  ]);
  payments.forEach((p) => {
    wsPay.addRow([
      p._id.toString(), p.customer_id?._id?.toString() || "",
      p.customer_id?.customer_name || "", p.amount, p.payment_method, p.payment_date
    ]);
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=FULL_BUSINESS_BACKUP.xlsx"
  );

  await wb.xlsx.write(res);
  res.end();
});

// POST /api/backup/restore -> upload an .xlsx (same shape as export) to re-import data.
// Restores by MongoDB _id when present in the sheet, otherwise inserts fresh rows.
router.post("/restore", upload.single("backup_file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Please upload a backup file" });
  }

  try {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(req.file.buffer);

    const idMap = { customers: {}, products: {} };

    const custSheet = wb.getWorksheet("Customers");
    if (custSheet) {
      for (let i = 2; i <= custSheet.rowCount; i++) {
        const row = custSheet.getRow(i);
        if (!row.getCell(2).value) continue;

        const doc = {
          customer_name: row.getCell(2).value,
          phone: row.getCell(3).value || "",
          address: row.getCell(4).value || "",
          due_amount: parseFloat(row.getCell(5).value) || 0
        };

        const saved = await Customer.create(doc);
        idMap.customers[row.getCell(1).value] = saved._id;
      }
    }

    const prodSheet = wb.getWorksheet("Products");
    if (prodSheet) {
      for (let i = 2; i <= prodSheet.rowCount; i++) {
        const row = prodSheet.getRow(i);
        if (!row.getCell(2).value) continue;

        const doc = {
          product_name: row.getCell(2).value,
          category: row.getCell(3).value || "",
          cost_price: parseFloat(row.getCell(4).value) || 0,
          sell_price: parseFloat(row.getCell(5).value) || 0,
          stock_quantity: parseInt(row.getCell(6).value) || 0
        };

        const saved = await Product.create(doc);
        idMap.products[row.getCell(1).value] = saved._id;
      }
    }

    const salesSheet = wb.getWorksheet("Sales");
    if (salesSheet) {
      for (let i = 2; i <= salesSheet.rowCount; i++) {
        const row = salesSheet.getRow(i);
        if (!row.getCell(2).value) continue;

        const oldProductId = row.getCell(3).value;
        const product_id = idMap.products[oldProductId];
        if (!product_id) continue;

        const qty = parseInt(row.getCell(6).value) || 0;
        const total_price = parseFloat(row.getCell(7).value) || 0;
        const profit = parseFloat(row.getCell(8).value) || 0;

        const productDoc = await Product.findById(product_id);
        const unit_cost = productDoc ? productDoc.cost_price : 0;
        const selling_price = qty ? total_price / qty : 0;

        // Find a matching customer via the sales sheet's original customer_id column
        const oldCustomerId = row.getCell(5).value;
        const customer_id = idMap.customers[oldCustomerId];
        if (!customer_id) continue;

        await Sale.create({
          product_id,
          customer_id,
          quantity: qty,
          unit_cost,
          actual_selling_price: selling_price,
          total_price,
          profit,
          invoice_id: row.getCell(2).value,
          sale_date: row.getCell(9).value || new Date()
        });
      }
    }

    const paySheet = wb.getWorksheet("Payments");
    if (paySheet) {
      for (let i = 2; i <= paySheet.rowCount; i++) {
        const row = paySheet.getRow(i);
        if (!row.getCell(4).value) continue;

        const oldCustomerId = row.getCell(2).value;
        const customer_id = idMap.customers[oldCustomerId];
        if (!customer_id) continue;

        await Payment.create({
          customer_id,
          amount: parseFloat(row.getCell(4).value) || 0,
          payment_method: row.getCell(5).value || "Cash",
          payment_date: row.getCell(6).value || new Date()
        });
      }
    }

    res.json({ message: "Backup restored successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Error restoring backup: ${err.message}` });
  }
});

module.exports = router;
