import { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown, FiChevronUp, FiUser, FiLogOut } from "react-icons/fi";
import { successToaster, confirmationPopup } from "../utils/alert-service";

function Topbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userStr = localStorage.getItem("ahm_admin_user");
  const user = userStr ? JSON.parse(userStr) : {};

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
    <header className="admin-topbar">
      <img src="/image/logo-primary.png" alt="Logo" width={80} height={70} />
      <div className="ahm-admin">
        <h4>Admin</h4>
        <div className="profile-wrapper" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <button className="ahm-btn" style={{ background: '#FDF9F5', color: '#7E525C', fontWeight: '800' }}>
            {user.userName?.charAt(0).toUpperCase() || 'A'}
          </button>
          <div className="chevron-container">
            {isDropdownOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
          </div>

          {isDropdownOpen && (
            <div className="profile-dropdown">
              <Link to="/profile" className="dropdown-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                <FiUser /> <span>Profile</span>
              </Link>
              <div className="dropdown-item logout" onClick={handleLogout}>
                <FiLogOut /> <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
