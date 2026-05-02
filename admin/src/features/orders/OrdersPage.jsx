import React, { useState } from 'react';
import { LuSearch, LuSettings2, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import '/src/styles/admin.css'; 

function OrdersPage() {
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleDetails = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const orders = [
    { id: "#AHM-9284", date: "Oct 24, 2023", customer: "Evelyn Thorne", total: "24,500", status: "Shipped", payment: "Paid", statusClass: "tag-signature" },
    { id: "#AHM-9285", date: "Oct 24, 2023", customer: "Julian Vane", total: "18,200", status: "Pending", payment: "Pending", statusClass: "tag-seasonal" },
    { id: "#AHM-9286", date: "Oct 23, 2023", customer: "Clara Beaumont", total: "36,800", status: "Confirmed", payment: "Paid", statusClass: "tag-new" },
    { id: "#AHM-9287", date: "Oct 23, 2023", customer: "Marcus Chen", total: "12,250", status: "Delivered", payment: "Paid", statusClass: "tag-bestseller" },
  ];

  return (
    <div className="catalog-container">
      <div className="catalog-card">
        
        {/* Header */}
        <div className="catalog-card-header">
          <div className="title-section">
            <h1 className="catalog-title">Order Registry</h1>
            <p className="catalogs-subtitle">Managing the factory journey of our clients.</p>
          </div>
          
          <div className="filters-right" style={{ display: 'flex', gap: '10px' }}>
            <select className="filter-select modern-select">
              <option>Status: All</option>
            </select>
            <button className="filter-btn"><LuSettings2 /></button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="catalog-filters" style={{ padding: '0 25px 20px' }}>
           <div className="search-wrapper" style={{ position: 'relative', width: '100%' }}>
             <input
               type="text"
               placeholder="Search orders, customers, or tracking IDs..."
               className="orders-search-input"
               style={{ width: '100%', padding: '12px 20px', borderRadius: '8px', border: '1px solid #eee' }}
             />
           </div>
        </div>

        {/* Table */}
        <div className="catalog-table">
          <div className="table-header">
            <span className="col-id" style={{ flex: 1 }}>Order ID</span>
            <span className="col-date" style={{ flex: 1 }}>Date</span>
            <span className="col-cust" style={{ flex: 1.5 }}>Customer</span>
            <span className="col-total" style={{ flex: 1 }}>Total (PKR)</span>
            <span className="col-status" style={{ flex: 1 }}>Status</span>
            <span className="col-pay" style={{ flex: 1 }}>Payment</span>
            <span className="col-act" style={{ flex: 0.5, textAlign: 'right' }}>Actions</span>
          </div>

          {orders.map((order) => (
            <React.Fragment key={order.id}>
              {/* Main Row */}
              <div 
                className={`catalog-row ${expandedOrderId === order.id ? 'active-row' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => toggleDetails(order.id)}
              >
                <span className="col-id font-bold">{order.id}</span>
                <span className="col-date restock-text">{order.date}</span>
                <span className="col-cust p-name">{order.customer}</span>
                <span className="col-total vol-pill">{order.total}</span>
                <div className="col-status">
                  <span className={`tag-pill ${order.statusClass}`}>{order.status}</span>
                </div>
                <span className="col-pay">{order.payment}</span>
                <div className="col-act" style={{ textAlign: 'right' }}>
                  <button className="dots-btn">
                    •••
                  </button>
                </div>
              </div>

              {/* Collapsible Detail Section */}
              {expandedOrderId === order.id && (
                <div className="order-details" style={{ display: 'flex', background: '#f9f9f9', padding: '20px', borderBottom: '1px solid #eee' }}>
                  <div className="order-composition" style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '14px', color: '#7E525C', marginBottom: '15px' }}>Order Composition</h3>
                    <div className="composition-item" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div className="item-details">
                        <h4 style={{ margin: 0, fontSize: '13px' }}>Oud Royale</h4>
                        <p style={{ margin: 0, fontSize: '11px', color: '#666' }}>100ML Selection</p>
                      </div>
                      <span className="item-price" style={{ fontSize: '13px' }}>PKR 12,500</span>
                    </div>
                  </div>

                  <div className="customer-info" style={{ flex: 1, borderLeft: '1px solid #ddd', paddingLeft: '20px' }}>
                    <h3 style={{ fontSize: '14px', color: '#7E525C', marginBottom: '15px' }}>Customer Information</h3>
                    <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
                      <p><strong>Full Name:</strong> {order.customer}</p>
                      <p><strong>Email:</strong> j.vane@editorial.com</p>
                      <p><strong>Address:</strong> Suite 402, Sterling heights, Phase 6, DHA, Karachi</p>
                      <p><strong>Delivery:</strong> PKR 500</p>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Pagination Section */}
        <div className="pagination" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="restock-text" style={{ fontSize: '12px' }}>SHOWING 1 TO 4 OF 48 ENTRIES</p>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button className="p-btn"><LuChevronLeft /></button>
            <button className="p-btn active-page">1</button>
            <button className="p-btn">2</button>
            <button className="p-btn"><LuChevronRight /></button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OrdersPage;