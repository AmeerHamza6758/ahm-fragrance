import { useState, useEffect } from "react";
// import PageSection from "../components/PageSection";
import "../../styles/admin.css";
import { NavLink } from "react-router-dom";
import { LuPencil, LuEye, LuTrash2 } from "react-icons/lu"; // Consistent icons use kiye hain
import { useGetProducts, useDeleteProduct } from '../../services/hooks/products';
import { AiOutlineDelete } from "react-icons/ai";
function ProductsPage() {
  const { data: products, isLoading, isError, error } = useGetProducts();
  const { mutate: deleteProduct } = useDeleteProduct();

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

  return (
    <div className="catalog-container">
      <div className="catalog-card">
        <div className="catalog-card-header">
          <div className="title-section">
            <h1 className="catalog-title">Product Catalog</h1>
            <p className="catalogs-subtitle">Manage your fragrance inventory details.</p>
          </div>
          <NavLink to="add" className="add-btn">+ Add New Fragrance</NavLink>
        </div>

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
      </div>
    </div>
  );
}
    
 export default ProductsPage;