import React, { useState } from "react";
import "../../styles/admin.css";
import { NavLink } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Pagination from "../../components/Pagination";
import Loader from "../../components/Loader";
import { useGetCategories, useDeleteCategory } from "../../services/hooks/categories";
import { confirmationPopup } from "../../utils/alert-service";

function CategoriesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;
  
  const { data: categoriesRes, isLoading, isError } = useGetCategories();
  const deleteMutation = useDeleteCategory();

  const allCategories = categoriesRes?.data || [];
  const totalEntries = allCategories.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  
  const currentCategories = allCategories.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id) => {
    const result = await confirmationPopup("Are you sure you want to delete this smell category?");
    if (result.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
  };

  return (
    <div className="categories-page-container">
      {/* Header */}
      <div className="catalog-header">
        <div>
          <h1 className="catalog-title">Fragrance Families</h1>
          <p className="catalog-subtitle">
            Manage olfactory categories and the unique smell profiles of your collection.
          </p>
        </div>
        <NavLink to="/categories/add" className="add-btn">
          <IoMdAdd size={18} /> Add New Profile
        </NavLink>
      </div>

      {/* Table */}
      <div className="catalog-table">
        <div className="catalog-table-header category-grid-layout">
          <span>Smell Category</span>
          <span>Description</span>
          <span>Products</span>
          <span>Created At</span>
          <span>Actions</span>
        </div>

        {isLoading ? (
          <Loader text="Inhaling category data..." />
        ) : isError ? (
          <div className="error-state">
             <p>Failed to retrieve the fragrance profiles.</p>
          </div>
        ) : allCategories.length === 0 ? (
          <div className="empty-state">No fragrance families defined.</div>
        ) : (
          currentCategories.map((item) => (
            <div className="catalog-row category-grid-layout" key={item._id}>
              {/* Category Name */}
              <div className="product-cell">
                <span className="user-name">{item.name}</span>
              </div>

              {/* Description */}
              <div className="description-cell">
                <p className="description-text-small">
                  {item.description || "No specific olfactory story provided."}
                </p>
              </div>

              {/* Products Count */}
              <div className="count-cell">
                <span className="status-badge status-active">
                  {item.productCount || 0} Essence{item.productCount !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Created Date */}
              <span>{formatDate(item.createdAt)}</span>

              {/* Actions */}
              <div className="actions">
                <NavLink to={`/categories/edit/${item._id}`}>
                  <FiEdit
                    className="action-icon edit-icon"
                    size={18}
                    style={{ color: "#7E525C", cursor: "pointer" }}
                  />
                </NavLink>
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

export default CategoriesPage;
