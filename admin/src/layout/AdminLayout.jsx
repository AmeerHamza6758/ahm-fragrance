import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/admin.css";

function AdminLayout() {
  return (
    <div className="admin-layout-container">
      <Topbar />
      <div className="admin-body-content">
        <Sidebar />
        <main className="admin-main-section">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
