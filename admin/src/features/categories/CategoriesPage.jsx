import React, { useState, useEffect } from "react";
import "../../styles/admin.css";
import { categoryApi, tagApi } from "../../services/endpoints";
import { IoMdAdd } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Loader from "../../components/Loader";
import { successToaster, errorToaster, confirmationPopup } from "../../utils/alert-service";

// Child Components
import CategoryModal from "./CategoryModal";
import TagModal from "./TagModal";

function CategoriesPage() {
  const [allCategories, setAllCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState(false);

  const [allTags, setAllTags] = useState([]);
  const [tagLoading, setTagLoading] = useState(true);
  
  // Modal Visibility States
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);

  const [showTagModal, setShowTagModal] = useState(false);
  const [editingTag, setEditingTag] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setCatLoading(true);
    setTagLoading(true);
    try {
      const [catRes, tagRes] = await Promise.all([
        categoryApi.list(),
        tagApi.list()
      ]);
      setAllCategories(catRes.data || []);
      setAllTags(tagRes.data || []);
    } catch (err) {
      setCatError(true);
      errorToaster("Failed to retrieve the essence collection.");
      console.error("Fetch Data Error:", err);
    } finally {
      setCatLoading(false);
      setTagLoading(false);
    }
  };

  // Category Handlers
  const handleAddCategory = () => {
    setEditingCat(null);
    setShowCatModal(true);
  };

  const handleEditCategory = (item) => {
    setEditingCat(item);
    setShowCatModal(true);
  };

  const handleDeleteCategory = async (id) => {
    const res = await confirmationPopup("Delete this essence family? This might affect associated products.");
    if (res.isConfirmed) {
      try {
        await categoryApi.remove(id);
        successToaster("Category removed.");
        fetchData();
      } catch (err) {
        errorToaster("Failed to delete category.");
      }
    }
  };

  // Tag Handlers
  const handleAddTag = () => {
    setEditingTag(null);
    setShowTagModal(true);
  };

  const handleEditTag = (item) => {
    setEditingTag(item);
    setShowTagModal(true);
  };

  const handleDeleteTag = async (id) => {
    const res = await confirmationPopup("Delete this fragrance tag permanently?");
    if (res.isConfirmed) {
      try {
        await tagApi.remove(id);
        successToaster("Tag removed.");
        fetchData();
      } catch (err) {
        errorToaster("Failed to delete tag.");
      }
    }
  };

  const formatDate = (ds) => ds ? new Date(ds).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : "---";

  // Global Key Listener for Modals
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setShowCatModal(false);
        setShowTagModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="categories-admin-container">
      
      {/* Categories Section */}
      <section className="admin-section-block">
        <div className="catalog-header">
          <div>
            <h1 className="catalog-title">Essence Families</h1>
            <p className="catalog-subtitle">Defining the primary classifications of your fragrance collection.</p>
          </div>
          <button onClick={handleAddCategory} className="add-btn">
            <IoMdAdd size={18} /> Add Category
          </button>
        </div>

        <div className="catalog-table">
          <div className="category-header-row">
            <div className="header-cell">Name</div>
            <div className="header-cell">Description</div>
            <div>Products</div>
            <div>Created At</div>
            <div className="text-center">Actions</div>
          </div>

          {catLoading ? (
            <Loader text="Inhaling category data..." />
          ) : catError ? (
            <div className="error-state"><p>Failed to retrieve categories.</p></div>
          ) : allCategories.length === 0 ? (
            <div className="empty-state">No categories defined yet.</div>
          ) : (
            allCategories.map((item) => (
              <div className="category-body-row" key={item._id}>
                <div className="product-cell">
                  <span className="user-name">{item.name}</span>
                </div>
                <div className="description-cell">
                  <p className="description-text-small truncate-multi" style={{ margin: 0 }} title={item.description}>
                    {item.description || "No description."}
                  </p>
                </div>
                <div>
                  <span className="status-badge status-active">
                    {item.productCount || 0} Essence{item.productCount !== 1 ? 's' : ''}
                  </span>
                </div>
                <div>
                  {formatDate(item.createdAt)}
                </div>
                <div className="actions justify-center">
                  <FiEdit className="action-icon-btn edit" size={18} onClick={() => handleEditCategory(item)} title="Edit Category" />
                  <RiDeleteBin6Line className="action-icon-btn delete" size={18} onClick={() => handleDeleteCategory(item._id)} title="Delete Category" />
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Tags Section */}
      <section className="admin-section-block" style={{ marginTop: '3.5rem' }}>
        <div className="catalog-header">
          <div>
            <h1 className="catalog-title">Fragrance Nuances</h1>
            <p className="catalog-subtitle">Subtle tags and specialized descriptors for refined filtering.</p>
          </div>
          <button onClick={handleAddTag} className="add-btn">
            <IoMdAdd size={18} /> Add Tag
          </button>
        </div>

        <div className="catalog-table">
          <div className="tag-header-row">
            <div className="header-cell">Tag Name</div>
            <div className="header-cell">Description</div>
            <div>Usage</div>
            <div>Created At</div>
            <div className="text-center">Actions</div>
          </div>

          {tagLoading ? (
            <Loader text="Extracting tag essence..." />
          ) : allTags.length === 0 ? (
            <div className="empty-state">No nuances defined yet.</div>
          ) : (
            allTags.map((item) => (
              <div className="tag-body-row" key={item._id}>
                <div className="product-cell">
                  <span className="user-name">{item.name}</span>
                </div>
                <div className="description-cell">
                  <p className="description-text-small truncate-multi" style={{ margin: 0 }} title={item.description}>
                    {item.description || "No description."}
                  </p>
                </div>
                <div>
                  <span className="status-badge status-active">Active</span>
                </div>
                <div>
                  {formatDate(item.createdAt)}
                </div>
                <div className="actions justify-center">
                  <FiEdit className="action-icon-btn edit" size={18} onClick={() => handleEditTag(item)} title="Edit Tag" />
                  <RiDeleteBin6Line className="action-icon-btn delete" size={18} onClick={() => handleDeleteTag(item._id)} title="Delete Tag" />
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Reusable Modals */}
      <CategoryModal 
        show={showCatModal} 
        onClose={() => setShowCatModal(false)} 
        onSuccess={fetchData} 
        editingCat={editingCat} 
      />

      <TagModal 
        show={showTagModal} 
        onClose={() => setShowTagModal(false)} 
        onSuccess={fetchData} 
        editingTag={editingTag} 
      />

    </div>
  );
}

export default CategoriesPage;
