import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout.jsx";

export default function AddCustomer() {
  const [form, setForm] = useState({ customer_name: "", phone: "", address: "" });
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await api.post("/customers", form);
    navigate("/customers");
  }

  return (
    <Layout>
      <div className="card col-md-6 mx-auto p-4 shadow-sm">
        <h4>New Customer</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Name</label>
            <input type="text" name="customer_name" className="form-control" value={form.customer_name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Phone</label>
            <input type="text" name="phone" className="form-control" value={form.phone} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label>Address</label>
            <textarea name="address" className="form-control" value={form.address} onChange={handleChange}></textarea>
          </div>
          <button type="submit" className="btn btn-success w-100">Save Customer</button>
        </form>
      </div>
    </Layout>
  );
}
