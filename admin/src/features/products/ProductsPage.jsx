import { useState, useEffect } from "react";
// import PageSection from "../components/PageSection";
import "../../styles/admin.css";
import { NavLink } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";

const products = [
  {
    id: 1,
    name: "Oud Royale",
    image: "/image/image1.png",
    qty: 124,
    date: "Oct 24, 2023",
    volume: "100ml",
    category: "Unisex",
    tag: "SIGNATURE",
    status:"Active",
  },
  {
    id: 2,
    name: "Velvet Peony",
    image: "/image/image2.png",
    qty: 42,
    date: "Oct 18, 2023",
    volume: "50ml",
    category: "Female",
    tag: "BEST SELLER",
    status:"Inactive",
  },
  {
    id: 3,
    name: "Midnight Leather",
    image: "/image/image3.png",
    qty: 89,
    date: "Nov 02, 2023",
    volume: "100ml",
    category: "Male",
    tag: "NEW",
    status:"Active",
  },
  {
    id: 4,
    name: "Citrus Breeze",
    image: "/image/image4.png",
    qty: 210,
    date: "Oct 30, 2023",
    volume: "100ml",
    category: "Unisex",
    tag: "SEASONAL",
    status:"Active",
  },
  {
    id: 5,
    name: "Rose Patel",
    image: "/image/image5.png",
    qty: 56,
    date: "Nov 12, 2023",
    volume: "50ml",
    category: "Female",
    tag: "SIGNATURE",
    status:"Inactive",
  },
  {
    id: 6,
    name: "Sandalwood Noir",
    image: "/image/image6.png",
    qty: 18,
    date: "Oct 20, 2023",
    volume: "100ml",
    category: "Male",
    tag: "  BEST SELLER",
    status:"Active",
  },
  {
    id: 7,
    name: "Azure Marine",
    image: "/image/image7.png",
    qty: 67,
    date: "Nov 05, 2023",
    volume: "100ml",
    category: "Unisex",
    tag: "NEW",
    status:"Inactive",
  },
  {
    id: 8,
    name: "Amber Glow",
    image: "/image/image8.png",
    qty: 145,
    date: "Oct 29, 2023",
    volume: "50ml",
    category: "Unisex",
    tag: "SIGNATURE",
    status:"Active",
  },
];
function ProductsPage() {

  function handleEdit(id) {
    alert("Edit clicked!");
  };

  function handleDelete(id) {
    alert("Item deleted!");
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
        <NavLink to="/products/add" className="add-btn"><IoMdAdd/> Add New Fragrance</NavLink>
      </div>

      {/* Table */}
      <div className="catalog-table">
        <div className="catalog-table-header">
          <span>Product</span>
          {/* <span>Quantity</span> */}
          <span>Restock Date</span>
          {/* <span>Volume</span> */}
          <span>Category</span>
          <span>Tags</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {products.map((item) => (
          <div className="catalog-row" key={item.id}>

            {/* Product */}
            <div className="product-cell">
              <img src={item.image} />
              <span>{item.name}</span>
            </div>

            {/* <span>{item.qty}</span> */}
            <span>{item.date}</span>
            {/* <span>{item.volume}</span> */}
            <span>{item.category}</span>

            <span className="tag-center">{item.tag}</span>
            <span>{item.status}</span>

            {/* Actions */}
            <div className="actions">
              <i class="fa-solid fa-pen edit-icon" onClick={handleEdit}></i>
               <i class="fa-solid fa-ban inactive-icon"></i>             
              <i class="fa-solid fa-trash delete-icon" onClick={handleDelete}></i>

            </div>

          </div>
        ))}

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