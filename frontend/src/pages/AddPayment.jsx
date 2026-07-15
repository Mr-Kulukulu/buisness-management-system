import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout.jsx";

export default function AddPayment() {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();
  const [form, setForm] = useState({ customer_id: "", amount: "", payment_method: "Cash" });

  useEffect(() => {
    api.get("/customers").then((res) => setCustomers(res.data));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await api.post("/payments", form);
    navigate("/payments");
  }

  return (
    <Layout>
      <div className="card col-md-5 mx-auto p-4">
        <h4 className="mb-3">Record Due Payment</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Select Customer</label>
            <select name="customer_id" className="form-control" value={form.customer_id} onChange={handleChange} required>
              <option value="">-- Choose Customer --</option>
              {customers.map((c) => (
                <option key={c.customer_id} value={c.customer_id}>
                  {c.customer_name} | Due: ${Number(c.due_amount || 0).toFixed(2)}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Amount Paid ($)</label>
            <input type="number" step="0.01" name="amount" className="form-control" value={form.amount} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Payment Method</label>
            <select name="payment_method" className="form-control" value={form.payment_method} onChange={handleChange} required>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Card">Card</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success w-100">Submit Payment</button>
        </form>
      </div>
    </Layout>
  );
}
