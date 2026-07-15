import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout.jsx";

export default function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ customer_name: "", phone: "", address: "", due_amount: 0 });

  useEffect(() => {
    api.get(`/customers/${id}`).then((res) => setForm(res.data));
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await api.put(`/customers/${id}`, form);
    navigate("/customers");
  }

  return (
    <Layout>
      <h2 className="mb-4 fw-bold">Edit Customer</h2>
      <div className="card p-4 border-0 shadow-sm" style={{ maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Customer Name</label>
            <input type="text" name="customer_name" className="form-control" value={form.customer_name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input type="text" name="phone" className="form-control" value={form.phone} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Address</label>
            <textarea name="address" className="form-control" rows="3" value={form.address} onChange={handleChange}></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Due Amount</label>
            <input type="number" step="0.01" name="due_amount" className="form-control" value={form.due_amount} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-success">Update Customer</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/customers")}>Cancel</button>
        </form>
      </div>
    </Layout>
  );
}
