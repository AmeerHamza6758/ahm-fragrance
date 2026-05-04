import React, { useState, useEffect } from "react";
import { categoryApi } from "../../services/endpoints";
import { successToaster, errorToaster } from "../../utils/alert-service";

function CategoryModal({ show, onClose, onSuccess, editingCat }) {
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingCat) {
      setCatName(editingCat.name || "");
      setCatDesc(editingCat.description || "");
    } else {
      setCatName("");
      setCatDesc("");
    }
  }, [editingCat, show]);

  const handleSave = async () => {
    if (!catName.trim()) {
      errorToaster("Category name is required.");
      return;
    }
    
    setSubmitting(true);
    try {
      if (editingCat) {
        await categoryApi.update(editingCat._id, { name: catName, description: catDesc });
        successToaster("Category updated successfully.");
      } else {
        await categoryApi.create({ name: catName, description: catDesc });
        successToaster("Category created successfully.");
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Save Category Error:", err);
      errorToaster(err.response?.data?.error || "Failed to save category.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="admin-modal-close" onClick={onClose}>×</button>
        
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">
            {editingCat ? "Refine Essence Family" : "New Essence Family"}
          </h2>
          <p className="admin-modal-subtitle">
            {editingCat ? "Modify the characteristics of this primary classification." : "Define a new primary classification for your fragrance collection."}
          </p>
        </div>

        <div className="admin-modal-body">
          <div className="admin-form-group">
            <label className="admin-form-label">Category Name</label>
            <input 
              value={catName} 
              onChange={(e) => setCatName(e.target.value)} 
              placeholder="e.g. Woody, Floral, Oriental..." 
              className="admin-input-styled" 
              autoFocus
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Description</label>
            <textarea 
              value={catDesc} 
              onChange={(e) => setCatDesc(e.target.value)} 
              placeholder="Describe the unique olfactory profile of this family..." 
              rows={4} 
              className="admin-textarea-styled" 
            />
          </div>
        </div>

        <div className="admin-modal-footer">
          <button className="admin-btn-cancel" onClick={onClose}>Cancel</button>
          <button 
            className="admin-btn-confirm" 
            onClick={handleSave} 
            disabled={submitting}
          >
            {submitting ? "Processing..." : (editingCat ? "Update Family" : "Create Family")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoryModal;
