import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/admin.css";

function AdminLayout() {
  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-content-wrapper">
        <Topbar />
        <main className="admin-main bg-[#f8f5f2]!">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
