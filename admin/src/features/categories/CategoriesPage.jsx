import React, { useState } from "react";
import "../../styles/admin.css";
import { IoMdAdd } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Pagination from "../../components/Pagination";
import Loader from "../../components/Loader";
import { useGetCategories, useDeleteCategory, useAddCategory, useUpdateCategory } from "../../services/hooks/categories";
import { useGetTags, useDeleteTag, useAddTag, useUpdateTag } from "../../services/hooks/tags";
import { confirmationPopup, successToaster, errorToaster } from "../../utils/alert-service";
import Swal from "sweetalert2";

function CategoriesPage() {
  // Categories State
  const [catPage, setCatPage] = useState(1);
  const entriesPerPage = 5;
  
  const { data: categoriesRes, isLoading: catLoading, isError: catError } = useGetCategories();
  const deleteCatMutation = useDeleteCategory();
  const addCatMutation = useAddCategory();
  const updateCatMutation = useUpdateCategory();

  const allCategories = categoriesRes?.data || [];
  const catTotalEntries = allCategories.length;
  const catTotalPages = Math.ceil(catTotalEntries / entriesPerPage);
  const currentCategories = allCategories.slice((catPage - 1) * entriesPerPage, catPage * entriesPerPage);

  // Tags State
  const [tagPage, setTagPage] = useState(1);
  const { data: tagsRes, isLoading: tagLoading, isError: tagError } = useGetTags();
  const deleteTagMutation = useDeleteTag();
  const addTagMutation = useAddTag();
  const updateTagMutation = useUpdateTag();

  const allTags = Array.isArray(tagsRes?.data) ? tagsRes.data : [];
  const tagTotalEntries = allTags.length;
  const tagTotalPages = Math.ceil(tagTotalEntries / entriesPerPage);
  const currentTags = allTags.slice((tagPage - 1) * entriesPerPage, tagPage * entriesPerPage);

  // Category Handlers
  const handleAddCategory = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Add New Category',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Category Name">' +
        '<textarea id="swal-input2" class="swal2-textarea" placeholder="Description"></textarea>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Create',
      preConfirm: () => {
        const name = document.getElementById('swal-input1').value;
        const description = document.getElementById('swal-input2').value;
        if (!name) {
          Swal.showValidationMessage('Name is required');
        }
        return { name, description };
      }
    });

    if (formValues) {
      addCatMutation.mutate(formValues);
    }
  };

  const handleEditCategory = async (category) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Category',
      html:
        `<input id="swal-input1" class="swal2-input" value="${category.name}" placeholder="Category Name">` +
        `<textarea id="swal-input2" class="swal2-textarea" placeholder="Description">${category.description || ''}</textarea>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update',
      preConfirm: () => {
        const name = document.getElementById('swal-input1').value;
        const description = document.getElementById('swal-input2').value;
        if (!name) {
          Swal.showValidationMessage('Name is required');
        }
        return { name, description };
      }
    });

    if (formValues) {
      updateCatMutation.mutate({ id: category._id, data: formValues });
    }
  };

  const handleDeleteCategory = async (id) => {
    const result = await confirmationPopup("Are you sure you want to delete this fragrance family?");
    if (result.isConfirmed) {
      deleteCatMutation.mutate(id);
    }
  };

  // Tag Handlers
  const handleAddTag = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Add New Tag',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Tag Name">' +
        '<textarea id="swal-input2" class="swal2-textarea" placeholder="Description"></textarea>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Create',
      preConfirm: () => {
        const name = document.getElementById('swal-input1').value;
        const description = document.getElementById('swal-input2').value;
        if (!name) {
          Swal.showValidationMessage('Name is required');
        }
        return { name, description };
      }
    });

    if (formValues) {
      addTagMutation.mutate(formValues);
    }
  };

  const handleEditTag = async (tag) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Tag',
      html:
        `<input id="swal-input1" class="swal2-input" value="${tag.name}" placeholder="Tag Name">` +
        `<textarea id="swal-input2" class="swal2-textarea" placeholder="Description">${tag.description || ''}</textarea>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update',
      preConfirm: () => {
        const name = document.getElementById('swal-input1').value;
        const description = document.getElementById('swal-input2').value;
        if (!name) {
          Swal.showValidationMessage('Name is required');
        }
        return { name, description };
      }
    });

    if (formValues) {
      updateTagMutation.mutate({ id: tag._id, data: formValues });
    }
  };

  const handleDeleteTag = async (id) => {
    const result = await confirmationPopup("Are you sure you want to delete this tag?");
    if (result.isConfirmed) {
      deleteTagMutation.mutate(id);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
  };

  return (
    <div className="categories-page-container">
      {/* Categories Table */}
      <div className="section-wrapper" style={{ marginBottom: "3rem" }}>
        <div className="catalog-header">
          <div>
            <h1 className="catalog-title">Fragrance Families</h1>
            <p className="catalog-subtitle">Manage your fragrance categories and olfactory families.</p>
          </div>
          <button onClick={handleAddCategory} className="add-btn">
            <IoMdAdd size={18} /> Add Category
          </button>
        </div>

        <div className="catalog-table">
          <div className="catalog-table-header category-grid-layout">
            <span>Name</span>
            <span>Description</span>
            <span>Products</span>
            <span>Created At</span>
            <span>Actions</span>
          </div>

          {catLoading ? (
            <Loader text="Inhaling category data..." />
          ) : catError ? (
            <div className="error-state"><p>Failed to retrieve categories.</p></div>
          ) : allCategories.length === 0 ? (
            <div className="empty-state">No categories defined.</div>
          ) : (
            currentCategories.map((item) => (
              <div className="catalog-row category-grid-layout" key={item._id}>
                <div className="product-cell"><span className="user-name">{item.name}</span></div>
                <div className="description-cell"><p className="description-text-small">{item.description || "No description."}</p></div>
                <div className="count-cell"><span className="status-badge status-active">{item.productCount || 0} Essence{item.productCount !== 1 ? 's' : ''}</span></div>
                <span>{formatDate(item.createdAt)}</span>
                <div className="actions">
                  <FiEdit className="action-icon edit-icon" size={18} style={{ color: "#7E525C", cursor: "pointer" }} onClick={() => handleEditCategory(item)} />
                  <RiDeleteBin6Line className="action-icon delete-icon" size={18} onClick={() => handleDeleteCategory(item._id)} style={{ color: "#ef4444", cursor: "pointer" }} />
                </div>
              </div>
            ))
          )}

          {catTotalEntries > 0 && (
            <Pagination
              currentPage={catPage}
              totalPages={catTotalPages}
              onPageChange={setCatPage}
              totalEntries={catTotalEntries}
              startEntry={(catPage - 1) * entriesPerPage + 1}
              endEntry={Math.min(catPage * entriesPerPage, catTotalEntries)}
            />
          )}
        </div>
      </div>

      {/* Tags Table */}
      <div className="section-wrapper">
        <div className="catalog-header">
          <div>
            <h1 className="catalog-title">Descriptive Tags</h1>
            <p className="catalog-subtitle">Manage tags for product filtering and organization.</p>
          </div>
          <button onClick={handleAddTag} className="add-btn">
            <IoMdAdd size={18} /> Add Tag
          </button>
        </div>

        <div className="catalog-table">
          <div className="catalog-table-header category-grid-layout">
            <span>Tag Name</span>
            <span>Description</span>
            <span>Usage</span>
            <span>Created At</span>
            <span>Actions</span>
          </div>

          {tagLoading ? (
            <Loader text="Gathering tags..." />
          ) : tagError ? (
            <div className="error-state"><p>Failed to retrieve tags.</p></div>
          ) : allTags.length === 0 ? (
            <div className="empty-state">No tags defined.</div>
          ) : (
            currentTags.map((item) => (
              <div className="catalog-row category-grid-layout" key={item._id}>
                <div className="product-cell"><span className="user-name">{item.name}</span></div>
                <div className="description-cell"><p className="description-text-small">{item.description || "No description."}</p></div>
                <div className="count-cell"><span className="status-badge status-active">Active</span></div>
                <span>{formatDate(item.createdAt)}</span>
                <div className="actions">
                  <FiEdit className="action-icon edit-icon" size={18} style={{ color: "#7E525C", cursor: "pointer" }} onClick={() => handleEditTag(item)} />
                  <RiDeleteBin6Line className="action-icon delete-icon" size={18} onClick={() => handleDeleteTag(item._id)} style={{ color: "#ef4444", cursor: "pointer" }} />
                </div>
              </div>
            ))
          )}

          {tagTotalEntries > 0 && (
            <Pagination
              currentPage={tagPage}
              totalPages={tagTotalPages}
              onPageChange={setTagPage}
              totalEntries={tagTotalEntries}
              startEntry={(tagPage - 1) * entriesPerPage + 1}
              endEntry={Math.min(tagPage * entriesPerPage, tagTotalEntries)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;
