import React, { useState, useEffect } from "react";
import { tagApi } from "../../services/endpoints";
import { successToaster, errorToaster } from "../../utils/alert-service";

function TagModal({ show, onClose, onSuccess, editingTag }) {
  const [tagName, setTagName] = useState("");
  const [tagDesc, setTagDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTag) {
      setTagName(editingTag.name || "");
      setTagDesc(editingTag.description || "");
    } else {
      setTagName("");
      setTagDesc("");
    }
  }, [editingTag, show]);

  const handleSave = async () => {
    if (!tagName.trim()) {
      errorToaster("Tag name is required.");
      return;
    }
    
    setSubmitting(true);
    try {
      if (editingTag) {
        await tagApi.update(editingTag._id, { name: tagName, description: tagDesc });
        successToaster("Tag updated successfully.");
      } else {
        await tagApi.create({ name: tagName, description: tagDesc });
        successToaster("Tag created successfully.");
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Save Tag Error:", err);
      errorToaster(err.response?.data?.error || "Failed to save tag.");
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
            {editingTag ? "Refine Nuance Tag" : "New Fragrance Tag"}
          </h2>
          <p className="admin-modal-subtitle">
            {editingTag ? "Modify the specialized descriptor for refined filtering." : "Create a new olfactory nuance to help customers filter your collection."}
          </p>
        </div>

        <div className="admin-modal-body">
          <div className="admin-form-group">
            <label className="admin-form-label">Tag Name</label>
            <input 
              value={tagName} 
              onChange={(e) => setTagName(e.target.value)} 
              placeholder="e.g. Summer, Night, Long Lasting..." 
              className="admin-input-styled" 
              autoFocus
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Description</label>
            <textarea 
              value={tagDesc} 
              onChange={(e) => setTagDesc(e.target.value)} 
              placeholder="Describe the specific characteristic or nuance of this tag..." 
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
            {submitting ? "Processing..." : (editingTag ? "Update Tag" : "Create Tag")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TagModal;
