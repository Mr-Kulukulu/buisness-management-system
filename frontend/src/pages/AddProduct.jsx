import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout.jsx";

export default function AddProduct() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    product_name: "",
    category: "",
    cost_price: "",
    sell_price: "",
    stock_quantity: ""
  });

  useEffect(() => {
    if (isEdit) {
      api.get(`/products/${id}`).then((res) => setForm(res.data));
    }
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (isEdit) {
      await api.put(`/products/${id}`, form);
    } else {
      await api.post("/products", form);
    }
    navigate("/products");
  }

  return (
    <Layout>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-dark text-white p-4">
              <h4 className="mb-0 fw-bold">
                <i className={`bi ${isEdit ? "bi-pencil-square" : "bi-plus-circle"} me-2`}></i>
                {isEdit ? "Update Inventory Item" : "Register New Product"}
              </h4>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-uppercase text-muted">Product Name</label>
                  <input
                    type="text" name="product_name" className="form-control form-control-lg"
                    value={form.product_name} onChange={handleChange}
                    placeholder="e.g. Wireless Mouse" required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-uppercase text-muted">Category</label>
                  <input
                    type="text" name="category" className="form-control"
                    value={form.category} onChange={handleChange}
                    placeholder="e.g. Accessories"
                  />
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-uppercase text-muted">Cost Price</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number" step="0.01" name="cost_price" className="form-control"
                        value={form.cost_price} onChange={handleChange} required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-uppercase text-muted">Selling Price</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number" step="0.01" name="sell_price" className="form-control text-success fw-bold"
                        value={form.sell_price} onChange={handleChange} required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-uppercase text-muted">Available Stock</label>
                  <input
                    type="number" name="stock_quantity" className="form-control"
                    value={form.stock_quantity} onChange={handleChange} required
                  />
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary btn-lg rounded-pill shadow-sm">
                    {isEdit ? "Update Record" : "Save Product"}
                  </button>
                  <button type="button" className="btn btn-link text-muted" onClick={() => navigate("/products")}>
                    Cancel and Go Back
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
