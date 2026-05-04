import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductById, useGetStockByProductId } from '../../services/hooks/products';
import { IoArrowBack, IoStar } from 'react-icons/io5';
import { API_BASE_URL } from "../../services/http";
import Loader from '../../components/Loader';
import "../../styles/admin.css";

function ViewProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: productRes, isLoading, error } = useGetProductById(id);
  const { data: stockRes } = useGetStockByProductId(id);
  const product = productRes?.data?.data;
  const stockCount = stockRes?.data?.data?.quantity ?? 0;

  const [activeImg, setActiveImg] = useState(0);

  if (isLoading) {
    return <Loader text="Unveiling fragrance details..." />;
  }

  if (error || !product) {
    return (
      <div className="error-container">
        <p>Failed to load product details or fragrance not found.</p>
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

  const images = Array.isArray(product.image_id) ? product.image_id : [];
  const currentImageUrl = images[activeImg]?.url || (images[activeImg]?.path ? `${API_BASE_URL}/${images[activeImg].path.replace(/\\/g, '/')}` : "/image/placeholder.png");

  return (
    <section className="view-product-container">
      <div className="admin-view-header">
        <div className="header-main">
          <div className="back-arrow-btn" onClick={() => navigate('/products')}>
            <IoArrowBack size={24} />
          </div>
          <h1 className="catalog-title">Fragrance Analysis</h1>
        </div>
        <div className="header-actions">
          <button className="edit-action-btn" onClick={() => navigate(`/products/edit/${id}`)}>
            Refine Details
          </button>
        </div>
      </div>

      <div className="admin-view-grid">
        {/* Visual Showcase - Left Side */}
        <div className="visual-section">
          <div className="main-display-card">
            <img src={currentImageUrl} alt={product.name} className="main-product-img" />
          </div>

          {images.length > 1 && (
            <div className="thumbnail-strip">
              {images.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`thumb-box ${activeImg === idx ? 'active' : ''}`}
                  onClick={() => setActiveImg(idx)}
                >
                  <img src={img.url || `${API_BASE_URL}/${img.path.replace(/\\/g, '/')}`} alt={`View ${idx}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detailed Information - Right Side */}
        <div className="information-section">
          <div className="admin-card">
            <div className="card-header-flex">
               <h3 className="card-heading">Olfactory Profile</h3>
               <div className="rating-badge">
                 <IoStar size={14} color="#FFD700" />
                 <span>{product.rating || "4.5"}</span>
               </div>
            </div>
            
            <div className="spec-grid">
              <div className="spec-item full-width">
                <label>Product Title</label>
                <div className="spec-value-large">{product.name}</div>
              </div>
              <div className="spec-item full-width">
                <label>Scent Narrative (Description)</label>
                <p className="description-text">
                  {product.description || "The story of this fragrance is yet to be told."}
                </p>
              </div>
              <div className="spec-item">
                <label>Essence Category</label>
                <div className="spec-value">{product.category_id?.name || 'N/A'}</div>
              </div>
              <div className="spec-item">
                <label>Fragrance Family</label>
                <div
                  className="spec-tag"
                  style={getTagStyle(product.tag_id?.name)}
                >
                  {product.tag_id?.name || "Unspecified"}
                </div>
              </div>
              <div className="spec-item">
                <label>Visibility Status</label>
                <div className="spec-value">
                  <span className={`status-pill ${product.isActive ? 'active' : 'inactive'}`}>
                    {product.isActive ? "Live in Collection" : "Archived"}
                  </span>
                </div>
              </div>
              <div className="spec-item">
                <label>Available Stock</label>
                <div className="spec-value">{stockCount} Units</div>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h3 className="card-heading">Volume Variants & Commercials</h3>
            <div className="variants-table">
              <div className="v-header">
                <span>Volume</span>
                <span>Base Price</span>
                <span>Discount</span>
                <span>Current Price</span>
              </div>
              {product.variants && product.variants.length > 0 ? (
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
                   <span className="v-empty">No volume variants configured for this fragrance.</span>
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
