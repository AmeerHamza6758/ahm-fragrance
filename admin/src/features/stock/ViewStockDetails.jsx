import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetStock, useManageStock } from "../../services/hooks/stock";
import { IoArrowBack, IoClose, IoTimeOutline } from "react-icons/io5";
import { FiPlus, FiMinus, FiClock, FiPackage } from "react-icons/fi";
import { API_BASE_URL } from "../../services/http";
import Loader from "../../components/Loader";
import "../../styles/admin.css";

function ViewStockDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  // We use search empty but pass productId to the hook (needs hook update to support explicit productId)
  // Actually, I'll update the hook to accept a productId as a separate param or as part of an options object.
  const { data: stockRes, isLoading, isError } = useGetStock(1, 50, "", "", id); 
  const manageStockMutation = useManageStock();

  const [editingVariant, setEditingVariant] = useState(null);
  const [updateAmount, setUpdateAmount] = useState("");
  const [operation, setOperation] = useState("add");
  const [reason, setReason] = useState("");

  const stocks = stockRes?.data?.data || [];
  const product = stocks[0]?.productId;

  const handleUpdateStock = () => {
    if (!updateAmount || isNaN(updateAmount)) return;
    
    manageStockMutation.mutate({
      productId: product._id,
      variantId: editingVariant.variantId,
      variantSize: editingVariant.size,
      quantity: parseInt(updateAmount),
      operation: operation,
      reason: reason || "manual_admin_update"
    }, {
      onSuccess: () => {
        setEditingVariant(null);
        setUpdateAmount("");
        setReason("");
      }
    });
  };

  if (isLoading) return <Loader text="Unveiling stock heritage..." />;
  if (isError || stocks.length === 0) return (
    <div className="error-state">
      <p>Unable to retrieve details for this artisanal essence.</p>
      <button onClick={() => navigate("/stock")} className="ahm-btn-secondary">Back to Registry</button>
    </div>
  );

  const formatDate = (dateString) => {
    if (!dateString) return "No history recorded";
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const productImg = product?.images?.[0]?.url || 
    (product?.images?.[0]?.path ? `${API_BASE_URL}/${product.images[0].path.replace(/\\/g, '/')}` : null);

  return (
    <div className="stock-details-container">
      <div className="admin-view-header">
        <div className="header-main">
          <div className="back-arrow-btn" onClick={() => navigate('/stock')}>
            <IoArrowBack size={24} />
          </div>
          <h1 className="catalog-title">Inventory Analysis</h1>
        </div>
      </div>

      <div className="details-grid">
        <div className="details-main-card">
          <div className="product-identity-section">
             <div className="product-image-large">
                {productImg ? (
                  <img src={productImg} alt={product.name} />
                ) : (
                  <div className="image-placeholder"><FiPackage size={40} /></div>
                )}
             </div>
             <div className="product-info-text">
                <span className="category-tag-premium">{product?.category}</span>
                <h1>{product?.name}</h1>
                <p className="product-description">{product?.description || "An exquisite fragrance crafted with premium botanical ingredients."}</p>
             </div>
          </div>

          <div className="stock-variants-section">
             <div className="section-header">
                <h3>Inventory Variants</h3>
                <span className="variant-count">{stocks.length} Sizes Tracked</span>
             </div>
             
             <div className="variants-list">
                {stocks.map(entry => (
                  <div className="variant-stock-card" key={entry._id}>
                    <div className="variant-info">
                      <div className="size-badge">{entry.variantSize || 'Standard'}</div>
                      <div className="stock-stats-row">
                        <div className="stat-item">
                          <label>Available</label>
                          <span className={`value ${entry.quantity <= entry.lowStockThreshold ? 'warning' : ''}`}>
                            {entry.quantity}
                          </span>
                        </div>
                        <div className="stat-item">
                          <label>Price</label>
                          <span className="value">Rs. {entry.variantPrice?.toLocaleString()}</span>
                        </div>
                        <div className="stat-item">
                          <label>Stock Value</label>
                          <span className="value">Rs. {(entry.quantity * (entry.variantPrice || 0)).toLocaleString()}</span>
                        </div>
                        <div className="stat-item">
                          <label>Reserved</label>
                          <span className="value">{entry.reservedQuantity || 0}</span>
                        </div>
                        <div className="stat-item">
                          <label>Threshold</label>
                          <span className="value">{entry.lowStockThreshold}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      className="manage-stock-btn"
                      onClick={() => setEditingVariant({
                        variantId: entry.variantId,
                        size: entry.variantSize,
                        quantity: entry.quantity
                      })}
                    >
                      Adjust Stock
                    </button>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="details-side-card">
           <div className="side-card-header">
             <FiClock /> <h3>Audit Trail</h3>
           </div>
           <div className="audit-timeline">
              {stocks.flatMap(entry => 
                (entry.stockHistory || []).map(h => ({ ...h, variantSize: entry.variantSize }))
              ).sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))
               .slice(0, 15)
               .map((log, idx) => (
                <div className="timeline-item" key={idx}>
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="log-top">
                      <span className="log-reason">{log.reason?.replace(/_/g, ' ')}</span>
                      <span className="log-time">{formatDate(log.changedAt)}</span>
                    </div>
                    <div className="log-bottom">
                      <span className="log-size">{log.variantSize || 'Standard'}</span>
                      <span className="log-delta">
                        {log.previousQuantity} → <span className="new-qty">{log.newQuantity}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {editingVariant && (
        <div className="stock-modal-overlay">
          <div className="stock-modal premium">
            <div className="modal-header">
              <div className="title-group">
                <h3>Inventory Adjustment</h3>
                <p>{editingVariant.size} variant</p>
              </div>
              <IoClose size={24} className="close-icon" onClick={() => setEditingVariant(null)} />
            </div>
            <div className="modal-body">
              <div className="op-toggle-premium">
                <button className={operation === 'add' ? 'active' : ''} onClick={() => setOperation('add')}>
                  <FiPlus /> Add Stock
                </button>
                <button className={operation === 'deduct' ? 'active' : ''} onClick={() => setOperation('deduct')}>
                  <FiMinus /> Deduct Stock
                </button>
              </div>
              
              <div className="input-stack">
                <div className="input-group-premium">
                  <label>Quantity</label>
                  <input 
                    type="number"
                    className="premium-input"
                    placeholder="Enter amount"
                    value={updateAmount}
                    onChange={(e) => setUpdateAmount(e.target.value)}
                  />
                </div>
                <div className="input-group-premium">
                  <label>Reason for Change</label>
                  <input 
                    type="text"
                    className="premium-input"
                    placeholder="e.g. New shipment, Customer return..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </div>

              <button 
                className="confirm-btn-premium"
                onClick={handleUpdateStock}
                disabled={manageStockMutation.isPending}
              >
                {manageStockMutation.isPending ? "Syncing..." : "Update Inventory"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewStockDetails;
