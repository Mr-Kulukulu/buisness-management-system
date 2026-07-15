import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    }
  }

  return (
    <div className="login-body">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-4">
            <div className="card login-card p-4 shadow-lg text-center">
              <h2 className="fw-bold mb-4">Kazi Electric</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3 text-start">
                  <label className="small fw-bold text-uppercase opacity-75">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4 text-start">
                  <label className="small fw-bold text-uppercase opacity-75">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100 btn-lg rounded-pill">
                  Enter
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
