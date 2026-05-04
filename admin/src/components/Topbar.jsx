import React from "react";

function Topbar() {
  const userStr = localStorage.getItem("ahm_admin_user");
  const user = userStr ? JSON.parse(userStr) : {};

  return (
    <header className="admin-topbar">
      <img src="/image/white-logo.png" alt="Logo" height={70}
       style={{ objectFit: 'contain' }} />
        <h4 className="ahm-admin-title">{user.userName || "Admin"}</h4>
    </header>
  );
}

export default Topbar;


