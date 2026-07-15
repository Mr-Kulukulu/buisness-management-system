import React from "react";
import Sidebar from "./Sidebar.jsx";

export default function Layout({ children }) {
  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />
        <main className="col-md-10 main-content">{children}</main>
      </div>
    </div>
  );
}
