import React, { useState } from "react";
import "../../styles/admin.css";
import { useNavigate } from "react-router-dom";
import { GrView } from "react-icons/gr";
import Pagination from "../../components/Pagination";
import Loader from "../../components/Loader";
import { useGetOrders } from "../../services/hooks/order";

function OrdersPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const entriesPerPage = 10;
  
  const { data: ordersRes, isLoading, isError } = useGetOrders(currentPage, entriesPerPage, statusFilter);

  const orders = ordersRes?.data?.data || [];
  const totalEntries = ordersRes?.data?.pagination?.totalItems || 0;
  const totalPages = ordersRes?.data?.pagination?.totalPages || 1;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleView = (id) => {
    navigate(`/orders/view/${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-active';
      case 'cancelled': return 'status-inactive';
      default: return 'status-inactive';
    }
  };

  return (
    <div className="orders-registry-wrapper">
      {/* Header */}
      <div className="catalog-header">
        <div>
          <h1 className="catalog-title">Order Registry</h1>
          <p className="catalog-subtitle">
            Overseeing the olfactory journey from workshop to doorstep.
          </p>
        </div>
        
        {/* Subtle Inline Filter */}
        <div className="inline-filters">
          <select 
            className="styled-select-small"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Journeys</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="catalog-table">
        <div className="catalog-table-header order-grid-layout">
          <span>Order Reference</span>
          <span>Placed On</span>
          <span>Customer</span>
          <span>Grand Total</span>
          <span className="text-center">Order Status</span>
          <span className="text-center">Payment</span>
          <span className="text-center">Actions</span>
        </div>

        {isLoading ? (
          <Loader text="Retrieving order history..." />
        ) : isError ? (
          <div className="error-state">
             <p>Failed to retrieve the order registry.</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">No orders found matching your criteria.</div>
        ) : (
          orders.map((order) => (
            <div className="catalog-row order-grid-layout" key={order._id}>
              {/* Order ID */}
              <div className="order-id-cell">
                <span className="user-name">#{order.orderNumber}</span>
              </div>

              {/* Date */}
              <span>{formatDate(order.placedAt)}</span>

              {/* Customer */}
              <div className="customer-cell-order">
                <span className="user-name">{order.customerInfo?.name || "Guest"}</span>
                <span className="user-email">{order.customerInfo?.email}</span>
              </div>

              {/* Total */}
              <span className="order-total-price">PKR {order.totalAmount?.toLocaleString()}</span>

              {/* Order Status */}
              <div className="status-cell justify-center">
                <span className={`status-badge ${getStatusClass(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>

              {/* Payment Status */}
              <div className="status-cell justify-center">
                <span className={`status-badge ${order.paymentStatus === 'paid' ? 'status-active' : 'status-pending'}`}>
                  {order.paymentStatus}
                </span>
              </div>

              {/* Actions */}
              <div className="actions justify-center">
                <GrView
                  className="action-icon view-icon"
                  size={18}
                  style={{ color: "#7E525C", cursor: "pointer" }}
                  onClick={() => handleView(order._id)}
                />
              </div>
            </div>
          ))
        )}

        {totalEntries > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalEntries={totalEntries}
            startEntry={(currentPage - 1) * entriesPerPage + 1}
            endEntry={Math.min(currentPage * entriesPerPage, totalEntries)}
          />
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
