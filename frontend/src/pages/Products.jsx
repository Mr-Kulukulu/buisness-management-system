import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout.jsx";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [params, setParams] = useSearchParams();
  const search = params.get("search") || "";
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, [search]);

  async function load() {
    const res = await api.get("/products", { params: { search } });
    setProducts(res.data);
  }

  function handleSearch(e) {
    e.preventDefault();
    const value = e.target.search.value;
    setParams(value ? { search: value } : {});
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    load();
  }

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <form onSubmit={handleSearch} className="d-flex w-50">
          <input
            type="text"
            name="search"
            className="form-control me-2"
            placeholder="Search products..."
            defaultValue={search}
          />
          <button type="submit" className="btn btn-outline-dark">Search</button>
        </form>
        <Link to="/add_product" className="btn btn-primary shadow-sm">+ Add Product</Link>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>In Stock</th>
                <th>Sell Price</th>
                <th className="text-end px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="fw-bold">{p.product_name}</td>
                  <td><span className="badge bg-secondary opacity-75">{p.category}</span></td>
                  <td>
                    {p.stock_quantity < 5 ? (
                      <span className="text-danger fw-bold">
                        <i className="bi bi-exclamation-triangle"></i> {p.stock_quantity}
                      </span>
                    ) : (
                      p.stock_quantity
                    )}
                  </td>
                  <td className="text-success fw-bold">${p.sell_price}</td>
                  <td className="text-end px-4">
                    <button
                      className="btn btn-sm btn-outline-warning rounded-pill px-3 me-1"
                      onClick={() => navigate(`/edit_product/${p._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger rounded-pill px-3"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
