import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = localStorage.getItem("ahm_admin_token");
  const userStr = localStorage.getItem("ahm_admin_user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!token || !user || user.role !== 'admin') {
    // Clear potentially corrupted data
    localStorage.removeItem("ahm_admin_token");
    localStorage.removeItem("ahm_admin_user");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
