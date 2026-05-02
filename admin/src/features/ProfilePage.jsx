import React, { useState, useEffect } from 'react';
import { useUpdateProfile, useUpdatePassword } from '../services/hooks/auth';
import { FiUser, FiLock } from 'react-icons/fi';
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

  const updateProfileMutation = useUpdateProfile();
  const updatePasswordMutation = useUpdatePassword();

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileForm);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
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
              <input 
                type="password" 
                className="profile-input" 
                placeholder="Confirm current password"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                required
              />
            </div>
            <div className="profile-field-group">
              <label>New Secret Key</label>
              <input 
                type="password" 
                className="profile-input" 
                placeholder="New password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                required
              />
            </div>
            <div className="profile-field-group">
              <label>Confirm New Key</label>
              <input 
                type="password" 
                className="profile-input" 
                placeholder="Confirm new password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                required
              />
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
