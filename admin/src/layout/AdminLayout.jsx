import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/admin.css";

function AdminLayout() {
  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-content-wrapper">
        {/* <Topbar /> */}
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
