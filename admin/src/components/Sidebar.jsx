import { NavLink } from "react-router-dom";
import { navItems } from "../config/navigation";

function Sidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="brand-block">
        <h2>AHM Admin</h2>
        <p>Fragrance Control Panel</p>
      </div>

      <nav className="admin-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? "active" : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
