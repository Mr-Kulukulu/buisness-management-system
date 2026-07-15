import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout.jsx";

function money(n) {
  return (n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Sales() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    api.get("/sales").then((res) => setSales(res.data));
  }, []);

  return (
    <Layout>
      <h2 className="mb-4 fw-bold">Sales History</h2>
      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-dark text-white small text-uppercase">
              <tr>
                <th className="px-3 py-3">Date</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Total Sold</th>
                <th className="text-success">Profit</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id}>
                  <td className="px-3 small text-muted">
                    {s.sale_date ? new Date(s.sale_date).toLocaleDateString() : "N/A"}
                  </td>
                  <td><strong>{s.customer_name || "Unknown"}</strong></td>
                  <td>{s.product_name}</td>
                  <td>{s.quantity}</td>
                  <td className="fw-bold">${money(s.total_price)}</td>
                  <td className="fw-bold text-success">+ ${money(s.profit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
