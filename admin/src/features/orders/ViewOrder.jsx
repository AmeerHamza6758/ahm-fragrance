import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { useGetOrderById, useUpdateOrderStatus } from '../../services/hooks/order';
import Loader from '../../components/Loader';
import "../../styles/admin.css";

function ViewOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: orderRes, isLoading, error } = useGetOrderById(id);
  const updateStatusMutation = useUpdateOrderStatus();
  
  const order = orderRes?.data?.data;
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleUpdateStatus = () => {
    if (!selectedStatus) return;
    updateStatusMutation.mutate({ id, status: selectedStatus });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return <Loader text="Retrieving order details..." />;
  }

  if (error || !order) {
    return (
      <div className="error-container">
        <p>Failed to load order details.</p>
        <button onClick={() => navigate('/orders')} className="back-btn">
          <IoArrowBack /> Back to Registry
        </button>
      </div>
    );
  }

  return (
    <section className="view-product-container">
      {/* Header */}
      <div className="admin-view-header">
        <div className="header-main">
          <div className="back-arrow-btn" onClick={() => navigate('/orders')}>
            <IoArrowBack size={24} />
          </div>
          <div>
            <h1 className="catalog-title">Order Details</h1>
            <p className="catalog-subtitle">Reference: #{order.orderNumber}</p>
          </div>
        </div>
        
        <div className="order-status-management">
           <select 
             className="styled-select-small"
             defaultValue={order.orderStatus}
             onChange={(e) => setSelectedStatus(e.target.value)}
           >
             <option value="pending">Pending</option>
             <option value="confirmed">Confirmed</option>
             <option value="shipped">Shipped</option>
             <option value="delivered">Delivered</option>
             <option value="cancelled">Cancelled</option>
           </select>
           <button 
             className="edit-action-btn" 
             style={{ padding: "8px 20px", marginLeft: "12px" }}
             onClick={handleUpdateStatus}
             disabled={updateStatusMutation.isPending}
           >
             Update Status
           </button>
        </div>
      </div>

      <div className="admin-view-grid">
        {/* Order Composition */}
        <div className="information-section" style={{ gridColumn: "span 2" }}>
          <div className="admin-card">
            <h3 className="card-heading">Order Composition</h3>
            <div className="order-items-list">
              <div className="order-items-header">
                <span>Product Essence</span>
                <span>Price</span>
                <span>Qty</span>
                <span>Total</span>
              </div>
              {order.products.map((item, idx) => (
                <div key={idx} className="order-item-row">
                  <div className="item-identity">
                    <span className="item-name">{item.name}</span>
                    <span className="item-id">ID: {item.productId?._id || item.productId}</span>
                  </div>
                  <span>PKR {item.price?.toLocaleString()}</span>
                  <span>{item.quantity}</span>
                  <span className="item-final-price">PKR {item.total?.toLocaleString()}</span>
                </div>
              ))}
            </div>
            
            <div className="order-summary-footer">
               <div className="summary-row">
                 <span>Subtotal</span>
                 <span>PKR {order.subtotal?.toLocaleString()}</span>
               </div>
               <div className="summary-row">
                 <span>Delivery Charges</span>
                 <span>PKR {order.deliveryCharges?.toLocaleString()}</span>
               </div>
               <div className="summary-row grand-total">
                 <span>Grand Total</span>
                 <span>PKR {order.totalAmount?.toLocaleString()}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Customer & Delivery Info */}
        <div className="visual-section" style={{ gridColumn: "span 1" }}>
          <div className="admin-card">
            <h3 className="card-heading">Delivery Sanctuary</h3>
            <div className="delivery-info-stack">
              <div className="info-item">
                <label>Receiver Name</label>
                <div className="info-value">{order.customerInfo.name}</div>
              </div>
              <div className="info-item">
                <label>Contact Phone</label>
                <div className="info-value">{order.customerInfo.phone}</div>
              </div>
              <div className="info-item">
                <label>Electronic Mail</label>
                <div className="info-value">{order.customerInfo.email}</div>
              </div>
              <div className="info-item">
                <label>Address Details</label>
                <div className="info-value">
                  {order.customerInfo.address}, {order.customerInfo.city}, {order.customerInfo.province}, {order.customerInfo.postalCode}
                </div>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h3 className="card-heading">Order Timeline</h3>
            <div className="timeline-info">
              <div className="info-item">
                <label>Placed On</label>
                <div className="info-value">{formatDate(order.placedAt)}</div>
              </div>
              <div className="info-item">
                <label>Payment Method</label>
                <div className="info-value capitalize">{order.paymentMethod}</div>
              </div>
              <div className="info-item">
                <label>Payment Status</label>
                <div className="info-value">
                  <span className={`status-pill ${order.paymentStatus === 'paid' ? 'active' : 'inactive'}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ViewOrder;
