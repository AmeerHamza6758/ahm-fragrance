import { useState, useEffect } from "react";
import "../../styles/admin.css";
import { NavLink, useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import { GrView } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";
import Pagination from "../../components/Pagination";
import StatCard from "../../components/StatCard";
import { useGetProducts, useDeleteProduct, useGetProductStats } from "../../services/hooks/products";
import { confirmationPopup } from "../../utils/alert-service";
import { API_BASE_URL } from "../../services/http";

function ProductsPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;
  
  const { data: productsRes, isLoading, isError } = useGetProducts(currentPage, entriesPerPage);
  const { data: statsRes } = useGetProductStats();
  const deleteMutation = useDeleteProduct();

  const stats = statsRes?.data?.data || { men: 0, women: 0, unisex: 0 };

  // Handle both { data: [...] } and { data: { data: [...] } } structures
  const productsBody = productsRes?.data;
  const products = Array.isArray(productsBody) ? productsBody : (productsBody?.data || []);
  
  const totalEntries = productsRes?.data?.pagination?.totalItems || 0;
  const totalPages = productsRes?.data?.pagination?.totalPages || 1;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEdit = (id) => {
    navigate(`/products/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const result = await confirmationPopup("Are you sure you want to delete this product?");
    if (result.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  const handleView = (id) => {
    navigate(`/products/view/${id}`);
  };

  const getTagStyle = (tag) => {
    if (!tag) return { backgroundColor: "#f3f4f6", color: "#374151" };
    
    const colors = [
      { bg: "#E0F2FE", text: "#0369A1" }, // Blue
      { bg: "#DCFCE7", text: "#15803D" }, // Green
      { bg: "#FEF3C7", text: "#92400E" }, // Amber
      { bg: "#F3E8FF", text: "#6B21A8" }, // Purple
      { bg: "#FFE4E6", text: "#BE123C" }, // Rose
      { bg: "#F1F5F9", text: "#475569" }, // Slate
      { bg: "#FFEDD5", text: "#9A3412" }, // Orange
    ];

    // Simple hash function to get a consistent index
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return {
      backgroundColor: colors[index].bg,
      color: colors[index].text,
      border: `1px solid ${colors[index].text}20`
    };
  };


  return (
    <div>
      {/* Header */}
      <div className="catalog-header">
        <div>
          <h1 className="catalog-title">Product Catalog</h1>
          <p className="catalog-subtitle">
            Manage your fragrance inventory and collection details.
          </p>
        </div>
        <NavLink to="/products/add" className="add-btn">
          <IoMdAdd /> Add New Fragrance
        </NavLink>
      </div>

      {/* Stats Cards Section */}
      <div className="dashboard-stats" style={{ 
        display: "flex", 
        flexDirection: "row", 
        gap: "1.5rem", 
        marginBottom: "2.5rem",
        flexWrap: "wrap"
      }}>
        {/* Men's Card */}
        <div style={{ 
          flex: 1, 
          minWidth: "200px", 
          background: "white", 
          borderRadius: "12px", 
          border: "1px solid #EBE7E4", 
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
        }}>
          <div style={{ 
            backgroundColor: "#FDF9F5", 
            padding: "10px 16px", 
            borderBottom: "1px solid #EBE7E4",
            fontWeight: "700",
            color: "#7E525C",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>
            Him
          </div>
          <div style={{ padding: "16px" }}>
            <h3 style={{ fontSize: "1.75rem", margin: "0 0 4px 0", color: "#2D2726" }}>{stats.men}</h3>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#78716C" }}>Total fragrances for men</p>
          </div>
        </div>

        {/* Women's Card */}
        <div style={{ 
          flex: 1, 
          minWidth: "200px", 
          background: "white", 
          borderRadius: "12px", 
          border: "1px solid #EBE7E4", 
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
        }}>
          <div style={{ 
            backgroundColor: "#FDF9F5", 
            padding: "10px 16px", 
            borderBottom: "1px solid #EBE7E4",
            fontWeight: "700",
            color: "#7E525C",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>
            Her
          </div>
          <div style={{ padding: "16px" }}>
            <h3 style={{ fontSize: "1.75rem", margin: "0 0 4px 0", color: "#2D2726" }}>{stats.women}</h3>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#78716C" }}>Total fragrances for women</p>
          </div>
        </div>

        {/* Unisex Card */}
        <div style={{ 
          flex: 1, 
          minWidth: "200px", 
          background: "white", 
          borderRadius: "12px", 
          border: "1px solid #EBE7E4", 
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
        }}>
          <div style={{ 
            backgroundColor: "#FDF9F5", 
            padding: "10px 16px", 
            borderBottom: "1px solid #EBE7E4",
            fontWeight: "700",
            color: "#7E525C",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>
            Unisex
          </div>
          <div style={{ padding: "16px" }}>
            <h3 style={{ fontSize: "1.75rem", margin: "0 0 4px 0", color: "#2D2726" }}>{stats.unisex}</h3>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#78716C" }}>Versatile fragrances</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="catalog-table">
        <div className="catalog-table-header">
          <span>Product</span>
          <span>Status</span>
          <span>Price</span>
          <span>Category</span>
          <span>Tags</span>
          <span>Actions</span>
        </div>

        {isLoading ? (
          <div className="table-loader-container">
             <div className="loader"></div>
             <p>Awaiting the harvest...</p>
          </div>
        ) : isError ? (
          <div className="error-state">
             <p>Failed to load the botanical collection.</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">No products found.</div>
        ) : (
          products.map((item) => (
            <div className="catalog-row" key={item._id}>
              {/* Product */}
              <div className="product-cell">
                <img 
                  src={item.image_id?.[0]?.path ? `${API_BASE_URL}/${item.image_id[0].path}` : "https://via.placeholder.com/40"} 
                  alt={item.name} 
                  className="product-thumb"
                />
                <span>{item.name}</span>
              </div>

              <div className="status-cell">
                <span className="status-badge status-active">
                  Active
                </span>
              </div>
              <span>PKR {item.price}</span>
              <span>{item.category_id?.name || "Uncategorized"}</span>

              <div>
                <span 
                  className="tag-center" 
                  style={getTagStyle(item.tag_id?.name)}
                >
                  {item.tag_id?.name || "None"}
                </span>
              </div>

              {/* Actions */}
              <div className="actions">
                <GrView
                  className="action-icon view-icon"
                  size={18}
                  style={{ color: "#10b981", cursor: "pointer" }}
                  onClick={() => handleView(item._id)}
                />
                <FiEdit
                  className="action-icon edit-icon"
                  size={18}
                  onClick={() => handleEdit(item._id)}
                  style={{ color: "#3b82f6", cursor: "pointer" }}
                />
                <RiDeleteBin6Line
                  className="action-icon delete-icon"
                  size={18}
                  onClick={() => handleDelete(item._id)}
                  style={{ color: "#ef4444", cursor: "pointer" }}
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

export default ProductsPage;