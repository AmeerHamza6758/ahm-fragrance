import { useState } from "react";
import PageSection from "../components/PageSection";
import "../styles/admin.css"

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
  },
];
function ProductsPage() {
  const [openMenu, setOpenMenu] = useState(null);

  return (
    <div className="catalog">

      {/* Header */}
      <div className="catalog-header">
        <div>
          <h1 className="catalog-title">Product Catalog</h1>
          <p className="catalog-subtitle">
            Manage your fragrance inventory and collection details.
          </p>
        </div>

        <button className="add-btn">+ Add New Fragrance</button>
      </div>

      {/* Table */}
      <div className="catalog-table">

        <div className="catalog-table-header">
          <span>Product</span>
          <span>Quantity</span>
          <span>Restock Date</span>
          <span>Volume</span>
          <span>Category</span>
          <span>Tags</span>
          <span>Actions</span>
        </div>

        {products.map((item) => (
          <div className="catalog-row" key={item.id}>

            {/* Product */}
            <div className="product-cell">
              <img src={item.image} />
              <span>{item.name}</span>
            </div>

            <span>{item.qty}</span>
            <span>{item.date}</span>
            <span>{item.volume}</span>
            <span>{item.category}</span>

            <span className="tag">{item.tag}</span>

            {/* Actions */}
            <div className="actions">
              <button
                onClick={() =>
                  setOpenMenu(openMenu === item.id ? null : item.id)
                }
              > ⋮ </button>

              {openMenu === item.id && (
                <div className="dropdown">
                  <p>Edit Product</p>
                  <p style={{color: "#BA1A1A"}}>Delete Product</p>
                  <p>Mark Inactive</p>
                </div>
              )}
            </div>

          </div>
        ))}

      </div>
        <div className="pagination">
      <div className="pagination-124">
         <p>Showing 1 to 8 of 42 fragrances</p>
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