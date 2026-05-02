import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { useGetUserById } from '../services/hooks/users';
import Loader from '../components/Loader';
import "../styles/admin.css";

function ViewCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: userRes, isLoading, error } = useGetUserById(id);
  const user = userRes?.data?.data;

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Not provided" : date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return <Loader text="Retrieving customer profile..." />;
  }

  if (error || !user) {
    return (
      <div className="error-container">
        <p>Failed to load customer details.</p>
        <button onClick={() => navigate('/customers')} className="back-btn">
          <IoArrowBack /> Back to Directory
        </button>
      </div>
    );
  }

  return (
    <section className="view-product-container">
      <div className="admin-view-header">
        <div className="header-main">
          <div className="back-arrow-btn" onClick={() => navigate('/customers')}>
            <IoArrowBack size={24} />
          </div>
          <h1 className="catalog-title">Customer Profile</h1>
        </div>
      </div>

      <div className="admin-view-grid">
        <div className="information-section" style={{ gridColumn: "span 3" }}>
          <div className="admin-card">
            <h3 className="card-heading">Account Identity</h3>
            <div className="spec-grid">
              <div className="spec-item full-width">
                <label>Legal Name</label>
                <div className="spec-value-large">{user.userName}</div>
              </div>
              
              <div className="spec-item">
                <label>Electronic Mail</label>
                <div className="spec-value">{user.email}</div>
              </div>
              
              <div className="spec-item">
                <label>Contact Number</label>
                <div className="spec-value">{user.phone || "No contact provided"}</div>
              </div>

              <div className="spec-item">
                <label>Gender Identity</label>
                <div className="spec-value capitalize">{user.gender || "Not specified"}</div>
              </div>

              <div className="spec-item">
                <label>Birth Date</label>
                <div className="spec-value">{formatDate(user.dateOfBirth)}</div>
              </div>

              <div className="spec-item">
                <label>Verification Status</label>
                <div className="spec-value">
                  <span className={`status-pill ${user.isEmailVerified ? "active" : "inactive"}`}>
                    {user.isEmailVerified ? "Verified Enthusiast" : "Pending Verification"}
                  </span>
                </div>
              </div>

              <div className="spec-item">
                <label>Member Since</label>
                <div className="spec-value">{formatDate(user.createdAt)}</div>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h3 className="card-heading">Shipping & Billing Essence</h3>
            {user.address && (user.address.street || user.address.city) ? (
               <div className="spec-grid">
                  <div className="spec-item full-width">
                    <label>Street Sanctuary</label>
                    <div className="spec-value">{user.address.street || "Not specified"}</div>
                  </div>
                  <div className="spec-item">
                    <label>City / Region</label>
                    <div className="spec-value">{user.address.city || "Not specified"}</div>
                  </div>
                  <div className="spec-item">
                    <label>Province</label>
                    <div className="spec-value">{user.address.province || "Not specified"}</div>
                  </div>
                  <div className="spec-item">
                    <label>Postal Code</label>
                    <div className="spec-value">{user.address.postalCode || "Not specified"}</div>
                  </div>
               </div>
            ) : (
              <p className="description-text">This botanical enthusiast hasn't shared their sanctuary details yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ViewCustomer;
