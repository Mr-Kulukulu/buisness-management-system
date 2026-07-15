import React, { useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout.jsx";

export default function RestoreBackup() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setError("Please upload a backup file");
      return;
    }

    const formData = new FormData();
    formData.append("backup_file", file);

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await api.post("/backup/restore", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || "Error restoring backup");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <h2 className="mb-4 fw-bold">Restore Backup</h2>
      <div className="card p-4 shadow-sm border-0">
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Choose backup file</label>
            <input
              type="file" className="form-control"
              onChange={(e) => setFile(e.target.files[0])} required
            />
          </div>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "Restoring..." : "Restore Backup"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
