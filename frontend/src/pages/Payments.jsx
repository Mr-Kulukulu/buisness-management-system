import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout.jsx";

export default function Payments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await api.get("/payments");
    setPayments(res.data);
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure?")) return;
    await api.delete(`/payments/${id}`);
    load();
  }

  return (
    <Layout>
      <h2>Payments</h2>
      <Link to="/add_payment" className="btn btn-primary mb-2">Add</Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer Name</th>
            <th>Amount</th>
            <th>Payment Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.customer_name}</td>
              <td>{p.amount}</td>
              <td>{p.payment_date ? new Date(p.payment_date).toLocaleDateString() : ""}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
