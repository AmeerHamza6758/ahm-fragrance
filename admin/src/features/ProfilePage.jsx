import React, { useState, useEffect } from 'react';
import { useUpdateProfile, useUpdatePassword } from '../services/hooks/auth';
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { IoMdSave } from 'react-icons/io';
import "../styles/admin.css";

function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("ahm_admin_user") || "{}");
  
  // Profile state
  const [profileForm, setProfileForm] = useState({
    userName: user.userName || "",
    email: user.email || "",
  });

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [pwdErrors, setPwdErrors] = useState({});
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const updateProfileMutation = useUpdateProfile();
  const updatePasswordMutation = useUpdatePassword();

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileForm);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!passwordForm.oldPassword) nextErrors.oldPassword = "Current password is required.";
    if (!passwordForm.newPassword) nextErrors.newPassword = "New password is required.";
    if (passwordForm.newPassword && passwordForm.newPassword.length < 6) {
      nextErrors.newPassword = "New password must be at least 6 characters.";
    }
    if (!passwordForm.confirmPassword) nextErrors.confirmPassword = "Please confirm your new password.";
    if (
      passwordForm.newPassword &&
      passwordForm.confirmPassword &&
      passwordForm.newPassword !== passwordForm.confirmPassword
    ) {
      nextErrors.confirmPassword = "New passwords do not match.";
    }

    if (Object.keys(nextErrors).length) {
      setPwdErrors(nextErrors);
      return;
    }

    setPwdErrors({});
    updatePasswordMutation.mutate({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    });
  };

  return (
    <div className="profile-page-container">
      <div className="profile-header">
        <h1 className="catalog-title">Administrative Profile</h1>
        <p className="catalog-subtitle">Manage your primary credentials and security settings.</p>
      </div>

      <div className="profile-grid">
        {/* Profile Information */}
        <div className="profile-card">
          <h3><FiUser /> Profile Essence</h3>
          <form className="profile-form" onSubmit={handleProfileSubmit}>
            <div className="profile-field-group">
              <label>Administrative Identity</label>
              <input 
                type="text" 
                className="profile-input" 
                value={profileForm.userName}
                onChange={(e) => setProfileForm({...profileForm, userName: e.target.value})}
              />
            </div>
            <div className="profile-field-group">
              <label>Master Email (Primary)</label>
              <input 
                type="email" 
                className="profile-input" 
                value={profileForm.email} 
                readOnly 
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>
            
            <button 
              type="submit" 
              className="profile-save-btn"
              disabled={updateProfileMutation.isPending}
            >
              <IoMdSave /> {updateProfileMutation.isPending ? 'Syncing...' : 'Save Profile'}
            </button>
          </form>
        </div>

        {/* Security Vault */}
        <div className="profile-card">
          <h3><FiLock /> Security Vault</h3>
          <div className="password-warning">
            Updating your key requires confirming your current secret password.
          </div>
          <form className="profile-form" onSubmit={handlePasswordSubmit}>
            <div className="profile-field-group">
              <label>Current Secret Key</label>
              <div style={{ position: "relative", width: "100%" }}>
                <input 
                  type="password"
                  className="profile-input" 
                  placeholder="Confirm current password"
                  value={passwordForm.oldPassword}
                  onChange={(e) => {
                    setPasswordForm({ ...passwordForm, oldPassword: e.target.value });
                    setPwdErrors((p) => ({ ...p, oldPassword: "" }));
                  }}
                  
                  style={{ paddingRight: 44 }}
                />
              </div>
              {pwdErrors.oldPassword ? (
                <div className="field-error">{pwdErrors.oldPassword}</div>
              ) : null}
            </div>
            <div className="profile-field-group">
              <label>New Secret Key</label>
              <div style={{ position: "relative", width: "100%" }}>
                <input 
                  type={showNew ? "text" : "password"} 
                  className="profile-input" 
                  placeholder="New password"
                  value={passwordForm.newPassword}
                  onChange={(e) => {
                    const next = { ...passwordForm, newPassword: e.target.value };
                    setPasswordForm(next);
                    setPwdErrors((p) => ({ ...p, newPassword: "", confirmPassword: "" }));
                  }}
                  
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((p) => !p)}
                  aria-label={showNew ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {showNew ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {pwdErrors.newPassword ? (
                <div className="field-error">{pwdErrors.newPassword}</div>
              ) : null}
            </div>
            <div className="profile-field-group">
              <label>Confirm New Key</label>
              <div style={{ position: "relative", width: "100%" }}>
                <input 
                  type={showConfirm ? "text" : "password"} 
                  className="profile-input"
                  placeholder="Confirm new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => {
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value });
                    setPwdErrors((p) => ({ ...p, confirmPassword: "" }));
                  }}
                  
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {pwdErrors.confirmPassword ? (
                <div className="field-error">{pwdErrors.confirmPassword}</div>
              ) : null}
            </div>
            
            <button 
              type="submit" 
              className="profile-save-btn"
              disabled={updatePasswordMutation.isPending}
            >
              <FiLock /> {updatePasswordMutation.isPending ? 'Sealing...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
