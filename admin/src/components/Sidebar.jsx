import { NavLink } from "react-router-dom";
import {
  MdOutlineDashboard,
  MdOutlineInventory2,
  MdOutlineCategory,
  MdOutlineBrandingWatermark,
  MdOutlineShoppingCart,
  MdOutlineSettings,
  MdOutlineBarChart,
  MdOutlineQuestionAnswer,
  MdOutlinePersonOutline
} from "react-icons/md";
import { FiUsers, FiLogOut } from "react-icons/fi";
import { successToaster, confirmationPopup } from "../utils/alert-service";

export const navItems = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/customers", label: "Customers" },
  { path: "/products", label: "Products" },
  { path: "/categories", label: "Categories & Tags" },
  // { path: "/brands", label: "Brands" },
  { path: "/stock", label: "Stock" },
  { path: "/orders", label: "Orders" },
  { path: "/settings", label: "Settings" },
  { path: "/profile", label: "Profile" },
  // { path: "/faq", label: "FAQ" },
  // { path: "/revenueanalytics", label: "Revenue Analytics" },
];

const iconByPath = {
  "/dashboard": <MdOutlineDashboard />,
  "/customers": <FiUsers />,
  "/products": <MdOutlineInventory2 />,
  "/categories": <MdOutlineCategory />,
  "/brands": <MdOutlineBrandingWatermark />,
  "/orders": <MdOutlineShoppingCart />,
  "/stock": <MdOutlineBarChart />,
  "/faq": <MdOutlineQuestionAnswer />,
  "/settings": <MdOutlineSettings />,
  "/profile": <MdOutlinePersonOutline />,
};

function Sidebar() {
  const handleLogout = async () => {
    const result = await confirmationPopup("Are you sure you want to exit the vault?", "Logout", "Stay");
    if (result.isConfirmed) {
      localStorage.removeItem("ahm_admin_token");
      localStorage.removeItem("ahm_admin_user");
      successToaster("Logged out successfully.");
      window.location.href = "/login";
    }
  };

  return (
    <aside className="admin-sidebar">
      {/* <div className="brand-block">
        <h2>AHM Admin</h2>
        <p>Fragrance Control Panel</p>
      </div> */}

      <nav className="admin-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">
              {iconByPath[item.path] ?? <MdOutlineDashboard />}
            </span>
            <strong>{item.label}</strong>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-nav-item" onClick={handleLogout}>
          <span className="nav-icon"><FiLogOut /></span>
          <strong>Sign Out</strong>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
