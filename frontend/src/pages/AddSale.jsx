import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout.jsx";

export default function AddSale() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    product_id: "",
    customer_name: "",
    customer_phone: "",
    quantity: "",
    negotiated_price: "",
    due_amount: 0
  });

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/sales", form);
      navigate("/sales");
    } catch (err) {
      setError(err.response?.data?.error || "Could not record sale");
    }
  }

  return (
    <Layout>
      <h2 className="mb-4">Add New Sale</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Product</label>
          <select name="product_id" className="form-select" value={form.product_id} onChange={handleChange} required>
            <option value="">Select a Product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.product_name} - ${p.sell_price} (Cost: ${p.cost_price})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Customer Name</label>
          <input type="text" name="customer_name" className="form-control" value={form.customer_name} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Customer Phone</label>
          <input type="text" name="customer_phone" className="form-control" value={form.customer_phone} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Quantity</label>
          <input type="number" name="quantity" className="form-control" min="1" value={form.quantity} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Negotiated Price</label>
          <input type="number" step="0.01" name="negotiated_price" className="form-control" value={form.negotiated_price} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Due Amount (if customer owes extra)</label>
          <input type="number" step="0.01" name="due_amount" className="form-control" value={form.due_amount} onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-primary">Record Sale</button>
      </form>
    </Layout>
  );
}
