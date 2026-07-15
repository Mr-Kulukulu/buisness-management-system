import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout.jsx";

export default function AddDuePayment() {
  const [customers, setCustomers] = useState([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ customer_id: "", pay_amount: "", payment_method: "" });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await api.get("/customers");
    setCustomers(res.data.filter((c) => (c.due_amount || 0) > 0));
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await api.post("/payments", {
      customer_id: form.customer_id,
      amount: form.pay_amount,
      payment_method: form.payment_method
    });
    setMessage("Payment recorded and due updated successfully");
    setForm({ customer_id: "", pay_amount: "", payment_method: "" });
    load();
  }

  return (
    <Layout>
      <h2 className="mb-4 fw-bold">Add Due Payment</h2>
      {message && <div className="alert alert-success">{message}</div>}
      <div className="card p-4 shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Customer</label>
            <select name="customer_id" className="form-select" value={form.customer_id} onChange={handleChange} required>
              <option value="" disabled>Select a customer</option>
              {customers.map((c) => (
                <option key={c.customer_id} value={c.customer_id}>
                  {c.customer_name} - Due: ${Number(c.due_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Payment Amount</label>
            <input
              type="number" step="0.01" name="pay_amount" className="form-control"
              placeholder="Enter amount" value={form.pay_amount} onChange={handleChange} required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Payment Method</label>
            <select name="payment_method" className="form-select" value={form.payment_method} onChange={handleChange} required>
              <option value="" disabled>Select method</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Card">Card</option>
            </select>
          </div>

          <button type="submit" className="btn btn-success">Submit Payment</button>
        </form>
      </div>
    </Layout>
  );
}
