import { NavLink } from "react-router-dom";
import {
  MdOutlineDashboard,
  MdOutlineInventory2,
  MdOutlineCategory,
  MdOutlineBrandingWatermark,
  MdOutlineShoppingCart,
  MdOutlineSettings,
  MdOutlineBarChart,
  MdOutlineQuestionAnswer
} from "react-icons/md";
import { FiUsers } from "react-icons/fi";

export const navItems = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/customers", label: "Customers" },
  { path: "/products", label: "Products" },
  { path: "/categories", label: "Categories" },
  { path: "/brands", label: "Brands" },
  { path: "/stock", label: "Stock" },
  { path: "/orders", label: "Orders" },
  { path: "/settings", label: "Settings" },
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
};

function Sidebar() {
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
    </aside>
  );
}

export default Sidebar;
