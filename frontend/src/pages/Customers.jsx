import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout.jsx";

function money(n) {
  return (n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [params, setParams] = useSearchParams();
  const search = params.get("search") || "";

  useEffect(() => {
    load();
  }, [search]);

  async function load() {
    const res = await api.get("/customers", { params: { search } });
    setCustomers(res.data);
  }

  function handleSearch(e) {
    e.preventDefault();
    const value = e.target.search.value;
    setParams(value ? { search: value } : {});
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    await api.delete(`/customers/${id}`);
    load();
  }

  return (
    <Layout>
      <h2 className="mb-4 fw-bold">Customer Directory</h2>

      <div className="card p-3 mb-4 border-0 shadow-sm">
        <form onSubmit={handleSearch} className="row g-2">
          <div className="col-md-10">
            <input
              type="text" name="search" className="form-control"
              placeholder="Search by name or phone number..." defaultValue={search}
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-dark w-100">Find</button>
          </div>
        </form>
      </div>

      <div className="row">
        {customers.map((c) => (
          <div className="col-md-4 mb-4" key={c.customer_id}>
            <div className="card h-100 p-3 position-relative">
              <div className="dropdown position-absolute top-0 end-0 m-2">
                <a className="text-dark" href="#" data-bs-toggle="dropdown">
                  <i className="bi bi-three-dots-vertical h5 mb-0"></i>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to={`/edit_customer/${c.customer_id}`}>
                      <i className="bi bi-pencil-square me-2"></i>Edit
                    </Link>
                  </li>
                  <li>
                    <a
                      className="dropdown-item" href="#"
                      onClick={(e) => { e.preventDefault(); handleDelete(c.customer_id); }}
                    >
                      <i className="bi bi-trash me-2"></i>Delete
                    </a>
                  </li>
                </ul>
              </div>

              <div className="d-flex align-items-center mb-2">
                <div className="rounded-circle bg-light p-3 me-3">
                  <i className="bi bi-person h4 mb-0"></i>
                </div>
                <div>
                  <h5 className="mb-0 fw-bold">{c.customer_name}</h5>
                  <small className="text-muted">{c.phone}</small>
                </div>
              </div>

              <hr />

              <div className="d-flex justify-content-between">
                <span>Total Due:</span>
                <span className="text-danger fw-bold">${money(c.due_amount)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Total Spent:</span>
                <span className="fw-bold">${money(c.total_price)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Total Profit:</span>
                <span className="fw-bold text-success">${money(c.profit)}</span>
              </div>

              {c.invoice_id ? (
                <>
                  <hr />
                  <h6 className="mt-3">Recent Purchase:</h6>
                  <div>
                    <strong>Invoice ID:</strong> {c.invoice_id}<br />
                    <strong>Product:</strong> {c.product_name}<br />
                    <strong>Quantity:</strong> {c.quantity}<br />
                    <strong>Sale Date:</strong> {c.sale_date ? new Date(c.sale_date).toLocaleDateString() : "N/A"}
                  </div>
                </>
              ) : (
                <p className="text-muted mt-2">No recent purchase</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
