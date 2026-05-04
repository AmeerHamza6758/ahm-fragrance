import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductById, useGetStockByProductId } from '../../services/hooks/products';
import { IoArrowBack } from 'react-icons/io5';
import Loader from '../../components/Loader';
import "../../styles/admin.css";

function ViewProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: productRes, isLoading, error } = useGetProductById(id);
  const { data: stockRes } = useGetStockByProductId(id);
  const product = productRes?.data;
  const stockCount = stockRes?.data?.data?.quantity ?? "N/A";

  if (isLoading) {
    return <Loader text="Unveiling fragrance details..." />;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Failed to load product details.</p>
        <button onClick={() => navigate('/products')} className="back-btn">
          <IoArrowBack /> Back to Catalog
        </button>
      </div>
    );
  }

  const getTagStyle = (tag) => {
    if (!tag) return { backgroundColor: "#f3f4f6", color: "#374151" };
    const colors = [
      { bg: "#E0F2FE", text: "#0369A1" },
      { bg: "#DCFCE7", text: "#15803D" },
      { bg: "#FEF3C7", text: "#92400E" },
      { bg: "#F3E8FF", text: "#6B21A8" },
      { bg: "#FFE4E6", text: "#BE123C" },
      { bg: "#F1F5F9", text: "#475569" },
      { bg: "#FFEDD5", text: "#9A3412" },
    ];
    let hash = 0;
    for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    const index = Math.abs(hash) % colors.length;
    return { backgroundColor: colors[index].bg, color: colors[index].text, border: `1px solid ${colors[index].text}20` };
  };

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const imageUrl = product?.image_id?.[0]?.path
    ? `${BASE_URL}/${product.image_id[0].path.replace(/\\/g, '/')}`
    : "/image/placeholder.png";

  return (
    <section className="view-product-container">
      <div className="admin-view-header">
        <div className="header-main">
          <div className="back-arrow-btn" onClick={() => navigate('/products')}>
            <IoArrowBack size={24} />
          </div>
          <h1 className="catalog-title">Product Details</h1>
        </div>
        <div className="header-actions">
          <button className="edit-action-btn" onClick={() => navigate(`/products/edit/${id}`)}>
            Edit Details
          </button>
        </div>
      </div>

      <div className="admin-view-grid">
        {/* Visual Showcase */}
        <div className="visual-section">
          <div className="main-display-card">
            <img src={imageUrl} alt={product?.name} className="main-product-img" />
          </div>

          {product?.image_id && product.image_id.length > 1 && (
            <div className="thumbnail-strip">
              {product.image_id.map((img, idx) => (
                <div key={idx} className={`thumb-box ${idx === 0 ? 'active' : ''}`}>
                  <img src={`${BASE_URL}/${img.path.replace(/\\/g, '/')}`} alt={`View ${idx}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detailed Information */}
        <div className="information-section">
          <div className="admin-card">
            <h3 className="card-heading">Fragrance Specification</h3>
            <div className="spec-grid">
              <div className="spec-item full-width">
                <label>Product Title</label>
                <div className="spec-value-large">{product?.name}</div>
              </div>
              <div className="spec-item full-width">
                <label>Description</label>
                <p className="description-text">
                  {product?.description || "No description available."}
                </p>
              </div>
              <div className="spec-item">
                <label>Category</label>
                <div className="spec-value">{product?.category_id?.name || 'N/A'}</div>
              </div>
              <div className="spec-item">
                <label>Fragrance Family</label>
                <div
                  className="spec-tag"
                  style={getTagStyle(product?.tag_id?.name)}
                >
                  {product?.tag_id?.name || "General"}
                </div>
              </div>
              <div className="spec-item">
                <label>Status</label>
                <div className="spec-value">
                  <span className="status-pill active">Active</span>
                </div>
              </div>
              <div className="spec-item">
                <label>In-stock Units</label>
                <div className="spec-value">{stockCount} Units</div>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h3 className="card-heading">Volume Variants & Pricing</h3>
            <div className="variants-table">
              <div className="v-header">
                <span>Volume</span>
                <span>Base Price</span>
                <span>Discount</span>
                <span>Current Price</span>
              </div>
              {product?.variants && product.variants.length > 0 ? (
                product.variants.map((v, idx) => (
                  <div key={idx} className="v-row">
                    <span className="v-size-label">{v.size}</span>
                    <span>PKR {v.price?.toLocaleString()}</span>
                    <span className="v-discount">-{v.discountPercentage}%</span>
                    <span className="v-final">PKR {(v.price - (v.price * (v.discountPercentage || 0) / 100)).toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <div className="v-row">
                  <span className="v-size-label">Standard</span>
                  <span>PKR {product?.price?.toLocaleString()}</span>
                  <span>0%</span>
                  <span className="v-final">PKR {product?.price?.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ViewProduct;
