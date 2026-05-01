import React from 'react';
import { LuImagePlus } from "react-icons/lu";
import { MdOutlineFileUpload } from "react-icons/md";
// import "../styles/admin.css";

function AddProducts() {
  return (
    <section className="add-product-container">
      <div className="add-header-section">
        <h1 className="catalog-title">Add New Fragrance</h1>
        <p className="catalog-subtitle">
          Compose a new entry for the botanical collection.
        </p>
      </div>

      <form className="product-form-layout">
        {/* Left Column */}
        <div className="left-column">
          <div className="image-uploads-container">
            <div className="main-image-upload">
              <label htmlFor="primary-image" className="image-placeholder main-placeholder">
               <LuImagePlus size={30} color="#7E525C"/>
                <span className="placeholder-text">Primary Vision</span>
                <input type="file" className="hidden-input" id="primary-image" accept="image/*"  />
              </label>
            </div>
            
            <div className="secondary-images-row">
              {[1, 2].map((num) => (
                <div key={num} className="secondary-image-upload">
                  <label htmlFor={`secondary-image-${num}`} className="image-placeholder secondary-placeholder">
                   <LuImagePlus size={30} color="#7E525C" />
                    <input type="file" className="hidden-input" id={`secondary-image-${num}`} accept="image/* " />
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="aesthetic-tip-box">
            <h4 className="tip-title"> Aesthetic Tip</h4>
            <p className="tip-content">
              High-contrast images with soft botanical elements perform best. Use natural daylight for product photography.
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          <div className="form-fields-container">
            <div className="form-group">
              <label>Product Identity</label>
              <input type="text" placeholder="e.g. Midnight Jasmine & Sandalwood" className="styled-input" />
            </div>

            <div className="form-group">
              <label>Fragrance Story</label>
              <textarea placeholder="Describe the olfactory journey..." className="styled-input styled-textarea" rows="4"></textarea>
            </div>

            <div className="dropdowns-row">
              <div className="form-group">
                <label>Essence Category</label>
                <select className="styled-input styled-select">
                  <option value="unisex">Unisex</option>
                  <option value="floral">Male</option>
                  <option value="floral">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label>Collection Tags</label>
                <select className="styled-input styled-select">
                  <option value="signature">Signature</option>
                  <option value="classic">New</option>
                   <option value="classic">Best seller</option>
                </select>
              </div>
            </div>

            <div className="input-fields-row">
              <div className="form-group">
                <label>Volume (ML)</label>
                <div className="input-with-unit">
                    <input type="text" placeholder="100" className="styled-input" />
                    <span className="unit-tag">ML</span>
                </div>
              </div>

              <div className="form-group">
                <label>Investment (PKR)</label>
                <div className="input-with-unit">
                    <input type="text" placeholder="8900" className="styled-input" />
                    <span className="unit-tag">PKR</span>
                </div>
              </div>
            </div>

            <div className="form-actions-section ">
              <button type="submit" className="publish-btn "><MdOutlineFileUpload size={20} color="#FFFFFF"/>Publish Product</button>
            </div>
          </div>
        </div>
      </form>

      <footer className="admin-footer-text">
        <div className="footer-links">Content Guidelines | Pricing Policy | Stock Alerts</div>
        <div className="footer-copy">© 2024 AHM Fragrances Suite</div>
      </footer>
    </section>
  );
}

export default AddProducts;