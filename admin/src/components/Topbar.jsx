import { useState } from "react";
import { FiChevronDown, FiChevronUp, FiUser, FiLogOut } from "react-icons/fi";

function Topbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="admin-topbar">
      <h3>AHM Fragrances</h3>
      <div className="ahm-admin">
        <h4>Admin</h4>
        <div className="profile-wrapper" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <button className="ahm-btn">
            <img 
              src="/image/admin.png" 
              alt="Admin Profile" 
            />
          </button>
          <div className="chevron-container">
            {isDropdownOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
          </div>

          {isDropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-item">
                <FiUser /> <span>Profile</span>
              </div>
              <div className="dropdown-item logout">
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
