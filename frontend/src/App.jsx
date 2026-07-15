import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute.jsx";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import Customers from "./pages/Customers.jsx";
import AddCustomer from "./pages/AddCustomer.jsx";
import EditCustomer from "./pages/EditCustomer.jsx";
import Sales from "./pages/Sales.jsx";
import AddSale from "./pages/AddSale.jsx";
import Payments from "./pages/Payments.jsx";
import AddPayment from "./pages/AddPayment.jsx";
import AddDuePayment from "./pages/AddDuePayment.jsx";
import RestoreBackup from "./pages/RestoreBackup.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

      <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
      <Route path="/add_product" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
      <Route path="/edit_product/:id" element={<PrivateRoute><AddProduct /></PrivateRoute>} />

      <Route path="/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
      <Route path="/add_customer" element={<PrivateRoute><AddCustomer /></PrivateRoute>} />
      <Route path="/edit_customer/:id" element={<PrivateRoute><EditCustomer /></PrivateRoute>} />

      <Route path="/sales" element={<PrivateRoute><Sales /></PrivateRoute>} />
      <Route path="/add_sale" element={<PrivateRoute><AddSale /></PrivateRoute>} />

      <Route path="/payments" element={<PrivateRoute><Payments /></PrivateRoute>} />
      <Route path="/add_payment" element={<PrivateRoute><AddPayment /></PrivateRoute>} />
      <Route path="/add_due_payment" element={<PrivateRoute><AddDuePayment /></PrivateRoute>} />

      <Route path="/restore_backup" element={<PrivateRoute><RestoreBackup /></PrivateRoute>} />
    </Routes>
  );
}
