import { useState, useEffect } from "react";
import "../../styles/admin.css";
import { NavLink } from "react-router-dom";
<<<<<<< HEAD
import { LuPencil, LuEye, LuTrash2 } from "react-icons/lu"; // Consistent icons use kiye hain
import { useGetProducts, useDeleteProduct } from '../../services/hooks/products';
import { AiOutlineDelete } from "react-icons/ai";
function ProductsPage() {
  const { data: products, isLoading, isError, error } = useGetProducts();
  const { mutate: deleteProduct } = useDeleteProduct();
=======
import { IoMdAdd } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import { GrView } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";
import Pagination from "../../components/Pagination";

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
    status: "active",
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
    status: "active",
  },
  {
    id: 3,
    name: "Midnight Leather",
    image: "/image/image3.png",
    qty: 0,
    date: "Nov 02, 2023",
    volume: "100ml",
    category: "Male",
    tag: "NEW",
    status: "inactive",
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
    status: "active",
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
    status: "active",
  },
  {
    id: 6,
    name: "Sandalwood Noir",
    image: "/image/image6.png",
    qty: 18,
    date: "Oct 20, 2023",
    volume: "100ml",
    category: "Male",
    tag: "BEST SELLER",
    status: "inactive",
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
    status: "active",
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
    status: "active",
  },
];

function ProductsPage() {
  const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 6;
  const totalEntries = 48; // Mock total entries
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
>>>>>>> bfa709c49809cc3cbd35f541527235fcf25e625f

  if (isLoading) return <div className="p-10 text-center font-bold">Fragrances are loading...</div>;
  if (isError) return <div className="p-10 text-center text-red-500 font-bold">Error: {error.message}</div>;

  const getTagClass = (tag) => {
    if (!tag) return "tag-seasonal";
    const t = tag.trim().toUpperCase();
    if (t === "SIGNATURE") return "tag-signature";
    if (t === "BEST SELLER") return "tag-bestseller";
    if (t === "NEW") return "tag-new";
    return "tag-seasonal";
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this fragrance?")) {
      deleteProduct(id);
    }
  };

<<<<<<< HEAD
  return (
    <div className="catalog-container">
      <div className="catalog-card">
        <div className="catalog-card-header">
          <div className="title-section">
            <h1 className="catalog-title">Product Catalog</h1>
            <p className="catalogs-subtitle">Manage your fragrance inventory details.</p>
=======
  const getTagClass = (tag) => {
    const t = tag.trim().toUpperCase();
    if (t === "SIGNATURE") return "tag-signature";
    if (t === "BEST SELLER") return "tag-best-seller";
    if (t === "NEW") return "tag-new";
    if (t === "SEASONAL") return "tag-seasonal";
    return "tag-default";
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

      {/* Table */}
      <div className="catalog-table">
        <div className="catalog-table-header">
          <span>Product</span>
          <span>Status</span>
          <span>Restock Date</span>
          {/* <span>Volume</span> */}
          <span>Category</span>
          <span>Tags</span>
          <span>Actions</span>
        </div>

        {products.map((item) => (
          <div className="catalog-row" key={item.id}>
            {/* Product */}
            <div className="product-cell">
              <img src={item.image} alt={item.name} />
              <span>{item.name}</span>
            </div>

            <div className="status-cell">
              <span
                className={`status-badge ${
                  item.status === "active" ? "status-active" : "status-inactive"
                }`}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
            </div>
            <span>{item.date}</span>
            {/* <span>{item.volume}</span> */}
            <span>{item.category}</span>

            <div>
              <span className={`tag-center ${getTagClass(item.tag)}`}>
                {item.tag.trim()}
              </span>
            </div>

            {/* Actions */}
            <div
              className="actions"
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
>>>>>>> bfa709c49809cc3cbd35f541527235fcf25e625f
          </div>
          <NavLink to="add" className="add-btn">+ Add New Fragrance</NavLink>
        </div>

<<<<<<< HEAD
        <div className="catalog-table">
          <div className="table-header">
            <span className="col-prod">Product Name</span>
            <span className="col-vol">Volume</span>
            <span className="col-cat">Category</span>
            <span className="col-tag">Tags</span>
            <span className="col-act" style={{ textAlign: 'center' }}>Actions</span>
          </div>

          {products && products?.data.map((item) => (
            <div className="catalog-row" key={item._id}>
              <div className="product-cell col-prod">
                <img src={item.image_id?.path || "/placeholder.png"} alt={item.name} />
                <span className="p-name">{item.name}</span>
              </div>
              <span className="col-vol vol-pill">{item.variants.size || "100ml"}</span>
              <span className="col-cat">{item.category_id?.name || "Unisex"}</span>
              
              <div className="col-tag">
                <span className={`tag-pill ${getTagClass(item.tag_id?.name || "NEW")}`}>
                  {(item.tag_id?.name || "NEW").toLowerCase()}
                </span>
              </div>

              {/* Updated Actions Section - No Dropdown */}
              <div className="col-act direct-actions">
                <NavLink to={`update/${item._id}`} className="action-icon-btn edit" title="Edit">
                  <LuPencil />
                </NavLink>
                
                <button className="action-icon-btn view" title="Mark Inactive">
                  <LuEye />
                </button>

                <button 
                  className="action-icon-btn delete" 
                  onClick={() => handleDelete(item._id)}
                  title="Delete"
                >
                 <AiOutlineDelete />
                </button>
              </div>
             
            </div>
          ))}
        </div>
=======
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalEntries={totalEntries}
          startEntry={(currentPage - 1) * entriesPerPage + 1}
          endEntry={Math.min(currentPage * entriesPerPage, totalEntries)}
        />
>>>>>>> bfa709c49809cc3cbd35f541527235fcf25e625f
      </div>
    </div>
  );
}

export default ProductsPage;