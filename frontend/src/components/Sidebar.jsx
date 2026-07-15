import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <nav className="col-md-2 sidebar d-none d-md-block">
      <div className="px-3 mb-4">
        <h4 className="text-white fw-bold">
          <i className="bi bi-speedometer2 me-2"></i>Kazi Electric
        </h4>
      </div>
      <ul className="nav flex-column px-2">
        <li className="nav-item">
          <NavLink className="nav-link" to="/" end>
            <i className="bi bi-house-door me-2"></i>Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/products">
            <i className="bi bi-box-seam me-2"></i>Inventory
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/sales">
            <i className="bi bi-cart3 me-2"></i>Sales Records
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/customers">
            <i className="bi bi-people me-2"></i>Customers
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/payments">
            <i className="bi bi-credit-card me-2"></i>Payments
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/add_due_payment">
            <i className="bi bi-wallet2 me-2"></i>Add Due Payment
          </NavLink>
        </li>
        <li className="nav-item mt-5">
          <a className="nav-link text-danger" href="#" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i>Logout
          </a>
        </li>
      </ul>
    </nav>
  );
}
