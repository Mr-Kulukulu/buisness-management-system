import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout.jsx";

function money(n) {
  return (n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    api.get("/dashboard").then((res) => setStats(res.data));
  }, []);

  async function handleBackup() {
    const res = await api.get("/backup/export", { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "FULL_BUSINESS_BACKUP.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <Layout>
      <h2 className="mb-4 fw-bold">Business Overview</h2>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card p-4 shadow-sm border-0">
            <h6 className="text-muted text-uppercase small fw-bold">Total Revenue</h6>
            <h3 className="fw-bold text-dark">${money(stats.revenue)}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-4 shadow-sm border-0" style={{ borderLeft: "5px solid #198754" }}>
            <h6 className="text-muted text-uppercase small fw-bold text-success">Net Profit</h6>
            <h3 className="fw-bold text-dark">${money(stats.profit)}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-4 shadow-sm border-0" style={{ borderLeft: "5px solid #ffc107" }}>
            <h6 className="text-muted text-uppercase small fw-bold">Total Stock Value</h6>
            <h3 className="fw-bold text-dark">${money(stats.total_stock_value)}</h3>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-2">
        <div className="col-md-4">
          <div className="card p-4 shadow-sm border-0">
            <h6 className="text-muted text-uppercase small fw-bold">Today's Sales</h6>
            <h3 className="fw-bold text-dark">${money(stats.today_sales)}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-4 shadow-sm border-0">
            <h6 className="text-muted text-uppercase small fw-bold">This Month Sales</h6>
            <h3 className="fw-bold text-dark">${money(stats.month_sales)}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-4 shadow-sm border-0">
            <h6 className="text-muted text-uppercase small fw-bold">This Year Sales</h6>
            <h3 className="fw-bold text-dark">${money(stats.year_sales)}</h3>
          </div>
        </div>
      </div>

      <div className="mt-4 d-flex gap-3">
        <Link to="/add_sale" className="btn btn-primary btn-lg rounded-pill">
          <i className="bi bi-cart-plus"></i> New Sale
        </Link>
        <button onClick={handleBackup} className="btn btn-warning btn-lg rounded-pill">
          <i className="bi bi-save2"></i> Backup Data
        </button>
        <Link to="/restore_backup" className="btn btn-danger btn-lg rounded-pill">
          <i className="bi bi-arrow-clockwise"></i> Restore Backup
        </Link>
      </div>
    </Layout>
  );
}
