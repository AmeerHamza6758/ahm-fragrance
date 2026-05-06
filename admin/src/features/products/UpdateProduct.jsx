import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // ID lene ke liye
import { LuImagePlus } from "react-icons/lu";
import { MdOutlineFileUpload } from "react-icons/md";
import '/src/styles/admin.css';

import { useGetProductById, useUpdateProduct } from '../../services/hooks/products';

function UpdateProduct() {
  const { id } = useParams();


  const { data: product, isLoading } = useGetProductById(id);
  const { mutate: updateProduct } = useUpdateProduct();

  const [fileNames, setFileNames] = useState({
    primary: "Primary Vision",
    secondary1: "Side View 1",
    secondary2: "Side View 2"
  });

  useEffect(() => {
    if (product) {
      setFileNames({
        primary: product.image_id?.name || "Primary Vision",
        secondary1: "Side View 1",
        secondary2: "Side View 2"
      });
    }
  }, [product]);

  // Image selection handler
  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      setFileNames(prev => ({ ...prev, [key]: file.name }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log("Form Entries:", Object.fromEntries(formData.entries()));

    // Update API call
    updateProduct({ id, data: formData });
  };

  if (isLoading) return <div className="p-10 text-center">Loading Fragrance Details...</div>;

  return (
    <section className="add-product-container">
      <div className="title-section">
        <h1 className="catalog-title">{id ? "Update Fragrance" : "Add Product"}</h1>
        <p className="catalogs-subtitle">Refining the essence of {product?.data.name}</p>
      </div>

      <form className="product-form-layout" onSubmit={handleSubmit}>
        {/* Left Column - Images */}
        <div className="left-column">
          <div className="image-uploads-container">
            <div className="main-image-upload">
              <label htmlFor="primary-image" className="image-placeholder main-placeholder">
                <LuImagePlus size={30} color="#7E525C" />
                <span className="placeholder-text">{fileNames.primary}</span>
                <input
                  type="file"
                  name="primaryImage"
                  className="hidden-input"
                  id="primary-image"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'primary')}
                />
              </label>
            </div>

            <div className="secondary-images-row">
              {[1, 2].map((num) => (
                <div key={num} className="secondary-image-upload">
                  <label htmlFor={`secondary-image-${num}`} className="image-placeholder secondary-placeholder">
                    <LuImagePlus size={20} color="#7E525C" />
                    <span className="placeholder-text" style={{ fontSize: '10px' }}>
                      {num === 1 ? fileNames.secondary1 : fileNames.secondary2}
                    </span>
                    <input
                      type="file"
                      name={`secondaryImage_${num}`}
                      className="hidden-input"
                      id={`secondary-image-${num}`}
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, num === 1 ? 'secondary1' : 'secondary2')}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
          {/*  Tip Box... */}
        </div>

        {/* Right Column - Fields */}
        <div className="right-column">
          <div className="form-fields-container">
            <div className="form-group">
              <label>Product Identity</label>
              <input
                name="name"
                type="text"
                defaultValue={product?.data.name}
                className="styled-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Fragrance Story</label>
              <textarea
                name="story"
                defaultValue={product?.data.description}
                className="styled-input styled-textarea"
                rows="4"
              ></textarea>
            </div>

            <div className="dropdowns-row">
              <div className="form-group">
                <label>Essence Category</label>
                <select name="category" className="styled-input styled-select" defaultValue={product?.data.category_id?._id}>
                  <option value="unisex">Unisex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label>Collection Tags</label>
                <select name="tag" className="styled-input styled-select" defaultValue={product?.data.tag_id?._id}>
                  <option value="signature">Signature</option>
                  <option value="new">New</option>
                  <option value="best-seller">Best seller</option>
                </select>
              </div>
            </div>

            <div className="input-fields-row">
              <div className="form-group">
                <label>Volume (ML)</label>
                <div className="input-with-unit">
                  <input name="volume" type="number" defaultValue={product?.variants?.size} className="styled-input" />
                  <span className="unit-tag">ML</span>
                </div>
              </div>

              <div className="form-group">
                <label>Investment (PKR)</label>
                <div className="input-with-unit">
                  <input name="price" type="number" defaultValue={product?.data.price} className="styled-input" />
                  <span className="unit-tag">PKR</span>
                </div>
              </div>
            </div>

            <div className="form-actions-section">
              <button type="submit" className="publish-btn">
                <MdOutlineFileUpload size={20} color="#FFFFFF" />
                Update Product
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export default UpdateProduct