import PageSection from "../../components/PageSection";

import { useState, useEffect } from "react";
import "./CategoriesPage.css";
import { NavLink } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import { GrView } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";
import Pagination from "../../components/Pagination";


const categories = [
  {
    id: 1,
    name: "Oud Collection",
    image: "/images/categories/oud.jpg",
    productsCount: 24,
    createdAt: "Oct 24, 2023",
    status: "active",
    description: "Premium oud-based fragrances",
  },
  {
    id: 2,
    name: "Floral Bliss",
    image: "/images/categories/floral.jpg",
    productsCount: 18,
    createdAt: "Oct 18, 2023",
    status: "active",
    description: "Beautiful floral notes",
  },
  {
    id: 3,
    name: "Oriental Spice",
    image: "/images/categories/oriental.jpg",
    productsCount: 12,
    createdAt: "Nov 02, 2023",
    status: "inactive",
    description: "Warm and exotic spices",
  },
  {
    id: 4,
    name: "Citrus Fresh",
    image: "/images/categories/citrus.jpg",
    productsCount: 15,
    createdAt: "Oct 30, 2023",
    status: "active",
    description: "Energizing citrus notes",
  },
  {
    id: 5,
    name: "Woody Essence",
    image: "/images/categories/woody.jpg",
    productsCount: 20,
    createdAt: "Nov 12, 2023",
    status: "active",
    description: "Rich woody aromas",
  },
  {
    id: 6,
    name: "Leather & Tobacco",
    image: "/images/categories/leather.jpg",
    productsCount: 8,
    createdAt: "Oct 20, 2023",
    status: "inactive",
    description: "Bold leather tobacco blends",
  },
  {
    id: 7,
    name: "Fresh Aquatic",
    image: "/images/categories/aquatic.jpg",
    productsCount: 14,
    createdAt: "Nov 05, 2023",
    status: "active",
    description: "Clean ocean-inspired scents",
  },
  {
    id: 8,
    name: "Gourmand Delights",
    image: "/images/categories/gourmand.jpg",
    productsCount: 10,
    createdAt: "Oct 29, 2023",
    status: "active",
    description: "Sweet edible-inspired fragrances",
  },
];

function CategoriesPage() {
  const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 6;
  const totalEntries = 48;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".actions")) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleEdit = (id) => {
    console.log("Edit category:", id);
  };

  const handleDelete = (id) => {
    console.log("Delete category:", id);
  };

  return (
    <div>
      {/* Header */}
      <div className="category-header">
        <div>
          <h1 className="category-title">Product Categories</h1>
          <p className="category-subtitle">
            Manage your fragrance categories and collections.
          </p>
        </div>
        <NavLink to="/categories/add" className="add-btn">
          <IoMdAdd /> Add New Category
        </NavLink>
      </div>

      {/* Table */}
      <div className="category-table">
        <div className="category-table-header">
          <span>Category</span>
          <span>Status</span>
          <span>Created Date</span>
          <span>Products</span>
          <span>Actions</span>
        </div>

        {categories.map((item) => (
          <div className="category-row" key={item.id}>
            <div className="category-name">
              <span>{item.name}</span>
            </div>
            {/* Status */}
            <div className="category-status-cell">
              <span
                className={`category-status-badge ${
                  item.status === "active" ? "status-active" : "status-inactive"
                }`}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
            </div>

            {/* Created Date */}
            <span>{item.createdAt}</span>

            {/* Products Count */}
            <span style={{ fontWeight: "600", color: "#7b4b4b" }}>
              {item.productsCount} products
            </span>


            {/* Actions */}
            <div
              className="category-actions"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu(openMenu === item.id ? null : item.id);
              }}
            >
              <GrView
                className="action-icon view-icon"
                size={18}
                style={{ color: "#10b981", cursor: "pointer" }}
              />
              <FiEdit
                className="action-icon edit-icon"
                size={18}
                onClick={() => handleEdit(item.id)}
                style={{ color: "#3b82f6", cursor: "pointer" }}
              />
              <RiDeleteBin6Line
                className="action-icon delete-icon"
                size={18}
                onClick={() => handleDelete(item.id)}
                style={{ color: "#ef4444", cursor: "pointer" }}
              />
            </div>
          </div>
        ))}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalEntries={totalEntries}
          startEntry={(currentPage - 1) * entriesPerPage + 1}
          endEntry={Math.min(currentPage * entriesPerPage, totalEntries)}
        />
      </div>
    </div>
  );
}

export default CategoriesPage;
