
import { useState, useEffect } from "react";
import PageSection from "../components/PageSection";
import "../styles/admin.css";
import { NavLink } from "react-router-dom";
import "../styles/admin.css";

// Standard icons to match Figma
import { MdOutlineEditNote } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { FiXCircle } from "react-icons/fi";
import { FaRegEyeSlash } from "react-icons/fa";
import {  FiChevronLeft, FiChevronRight } from "react-icons/fi";
const products = [
  { id: 1, name: "Oud Royale", image: "/image/image1.png", qty: 124, date: "Oct 24, 2023", volume: "100ml", category: "Unisex", tag: "SIGNATURE" },
  { id: 2, name: "Velvet Peony", image: "/image/image2.png", qty: 42, date: "Oct 18, 2023", volume: "50ml", category: "Female", tag: "BEST SELLER" },
  { id: 3, name: "Midnight Leather", image: "/image/image3.png", qty: 89, date: "Nov 02, 2023", volume: "100ml", category: "Male", tag: "NEW" },
  { id: 4, name: "Citrus Breeze", image: "/image/image4.png", qty: 210, date: "Oct 30, 2023", volume: "100ml", category: "Unisex", tag: "SEASONAL" },
  { id: 5, name: "Rose Patel", image: "/image/image5.png", qty: 56, date: "Nov 12, 2023", volume: "50ml", category: "Female", tag: "SIGNATURE" },
  { id: 6, name: "Sandalwood Noir", image: "/image/image6.png", qty: 18, date: "Oct 20, 2023", volume: "100ml", category: "Male", tag: "BEST SELLER" },
  { id: 7, name: "Azure Marine", image: "/image/image7.png", qty: 67, date: "Nov 05, 2023", volume: "100ml", category: "Unisex", tag: "NEW" },
  { id: 8, name: "Amber Glow", image: "/image/image8.png", qty: 145, date: "Oct 29, 2023", volume: "50ml", category: "Unisex", tag: "SIGNATURE" },
];

function ProductsPage() {
  const [openMenu, setOpenMenu] = useState(null);
<<<<<<< amna
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
=======
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
    console.log("Edit:", id);
  };

  const handleDelete = (id) => {
    console.log("Delete:", id);
  };
  return (
    <div className="catalog">
>>>>>>> development

  const getTagClass = (tag) => {
    const t = tag.trim().toUpperCase();
    if (t === "SIGNATURE") return "tag-signature";
    if (t === "BEST SELLER") return "tag-bestseller";
    if (t === "NEW") return "tag-new";
    return "tag-seasonal";
  };

  return (
    <div className="catalog-container">
      {/* Top Breadcrumb  */}
      <div className="top-nav-bar">
        <span className="brand-label">AHM Fragrances</span>
        <div className="admin-profile">
          <span className="admin-name">AHM Admin</span>
          <div className="avatar-circle">A</div>
        </div>
<<<<<<< amna
=======
        <NavLink to="/products/add" className="add-btn">+ Add New Fragrance</NavLink>
        
>>>>>>> development
      </div>

      <div className="catalog-card">
        <div className="catalog-card-header">
          <div className="title-section">
            <h1 className="catalog-title">Product Catalog</h1>
            <p className="catalogs-subtitle">Manage your fragrance inventory and collection details.</p>
          </div>
          <NavLink to="add" className="add-btn">+ Add New Fragrance</NavLink>
        </div>

        <div className="catalog-table">
          <div className="table-header">
            <span className="col-prod">Product Name</span>
            <span className="col-qty">Quantity</span>
            <span className="col-date">Restock Date</span>
            <span className="col-vol">Volume</span>
            <span className="col-cat">Category</span>
            <span className="col-tag">Tags</span>
            <span className="col-act">Actions</span>
          </div>

<<<<<<< amna
          {products.map((item) => (
            <div className="catalog-row" key={item.id}>
              <div className="product-cell col-prod">
                <img src={item.image} alt={item.name} />
                <span className="p-name">{item.name}</span>
              </div>
              
              <span className="col-qty">{item.qty}</span>
              <span className="col-date restock-text">{item.date}</span>
              <span className="col-vol vol-pill">{item.volume}</span>
              <span className="col-cat">{item.category}</span>
              
              <div className="col-tag">
                <span className={`tag-pill ${getTagClass(item.tag)}`}>
                  {item.tag.toLowerCase()}
                </span>
              </div>

              <div className="col-act actions-wrapper" ref={openMenu === item.id ? dropdownRef : null}>
                <button 
                  className="dots-btn" 
                  onClick={() => setOpenMenu(openMenu === item.id ? null : item.id)}
                >
                  ⋮
                </button>

                {openMenu === item.id && (
                  <div className="figma-dropdown">
                    <div className="dropdown-item">
                      <MdOutlineEditNote className="icon-edit" /> Edit Product
                    </div>
                    <div className="dropdown-item delete-red">
                      <AiFillDelete className="icon-delete" /> Delete Product
                    </div>
                    <div className="dropdown-item inactive-grey">
                      <FaRegEyeSlash className="icon-inactive" /> Mark Inactive
                    </div>
                  </div>
                )}
              </div>
=======
            <span className="tag-center">{item.tag}</span>

            {/* Actions */}
            <div className="actions">
              <button
                onClick={(e) =>{
                  e.stopPropagation();
                  setOpenMenu(openMenu === item.id ? null : item.id);
                }}
              >
                ⋮
              </button>

              {openMenu === item.id && (
                <div className="dropdown">
                 <p onClick={() => handleEdit(item.id)}>Edit Product</p>
                 <p onClick={() => handleDelete(item.id)}>Delete Product</p>
                 <p>Mark Inactive</p>
                </div>
              )}
>>>>>>> development
            </div>
          ))}
        </div>
        {/* --- PAGINATION SECTION START --- */}
        <div className="pagination-footer">
          <p className="showing-text">Showing 1 to 8 of 42 fragrances</p>
          <div className="pagination-controls">
            <button className="page-arrow"><FiChevronLeft /></button>
            <button className="page-num active">1</button>
            <button className="page-num">2</button>
            <button className="page-num">3</button>
            <span className="page-dots">...</span>
            <button className="page-arrow"><FiChevronRight /></button>
          </div>
        </div>
        {/* --- PAGINATION SECTION END --- */}
      </div>
      <div className="pagination">
           <div className="pagination-124">
              <p>SHOWING 1 TO 6 OF 48 ENTRIES</p>
            </div>
        <div>
             <button>{"<"}</button>
              <button className="active-page">1</button>
              <button>2</button>
              <button>3</button>
              <button>{">"}</button>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;