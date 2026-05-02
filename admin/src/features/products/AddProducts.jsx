import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuImagePlus } from "react-icons/lu";
import { MdOutlineFileUpload } from "react-icons/md";
import "../../styles/admin.css";
import { productsApi, categoryApi, tagApi } from "../../services/endpoints";

function AddProducts() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagId, setTagId] = useState("");
  const [price, setPrice] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("0");
  const [volume, setVolume] = useState("");

  // Image refs and previews
  const primaryRef = useRef(null);
  const secondary1Ref = useRef(null);
  const secondary2Ref = useRef(null);
  const [primaryPreview, setPrimaryPreview] = useState(null);
  const [secondary1Preview, setSecondary1Preview] = useState(null);
  const [secondary2Preview, setSecondary2Preview] = useState(null);

  const handleImageChange = (e, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  // Fetch categories and brands on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await categoryApi.list();
        if (catRes.data) {
          setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }

      try {
        const tagRes = await tagApi.list();
        if (tagRes.data) {
          setTags(Array.isArray(tagRes.data) ? tagRes.data : tagRes.data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName.trim() || !price) return;

    setSubmitting(true);
    try {
      const payload = {
        name: productName.trim(),
        price: Number(price),
        discountPercentage: Number(discountPercentage) || 0,
        description: description.trim(),
      };

      if (categoryId) payload.category_id = categoryId;
      if (tagId) payload.tag_id = tagId;

      // Build variants from the volume and price
      if (volume) {
        payload.variants = [
          {
            size: `${volume}ml`,
            price: Number(price),
            discountPercentage: Number(discountPercentage) || 0,
          },
        ];
      }

      const res = await productsApi.create(payload);
      if (res.data && res.data.status === 1) {
        alert("Product added successfully!");
        navigate("/products");
      }
    } catch (err) {
      console.error("Failed to add product:", err);
      alert("Failed to add product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="">
       <div className="title-section">
            <h1 className="catalog-title">Add New Fragrance</h1>
            <p className="catalog-subtitle">Compose a new entry for the botanical collection</p>
          </div>

      <form className="product-form-layout" onSubmit={handleSubmit}>
        <div className="left-column">
          <div className="image-uploads-container">
            <div className="main-image-upload">
              <div className="image-placeholder" onClick={() => primaryRef.current.click()}>
                {primaryPreview ? (
                  <img src={primaryPreview} alt="Primary" className="image-preview" />
                ) : (
                  <>
                    <LuImagePlus size={30} color="#7E525C"/>
                    <span className="placeholder-text">Primary Vision</span>
                  </>
                )}
                <input
                  type="file"
                  name="primaryImage"
                  className="hidden-input"
                  ref={primaryRef}
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setPrimaryPreview)}
                />
              </div>
            </div>
            
            <div className="secondary-images-row">
              {[{ ref: secondary1Ref, preview: secondary1Preview, setPreview: setSecondary1Preview, name: "secondaryImage_1" },
                { ref: secondary2Ref, preview: secondary2Preview, setPreview: setSecondary2Preview, name: "secondaryImage_2" }].map((item, idx) => (
                <div key={idx} className="secondary-image-upload">
                  <div className="image-placeholder secondary-placeholder" onClick={() => item.ref.current.click()}>
                    {item.preview ? (
                      <img src={item.preview} alt={`Secondary ${idx + 1}`} className="image-preview" />
                    ) : (
                      <LuImagePlus size={30} color="#7E525C" />
                    )}
                    <input
                      type="file"
                      name={item.name}
                      className="hidden-input"
                      ref={item.ref}
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, item.setPreview)}
                    />
                  </div>
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
              {/* Name Added: productName */}
              <input
                name="productName"
                type="text"
                placeholder="e.g. Midnight Jasmine & Sandalwood"
                className="styled-input"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Fragrance Story</label>
              {/* Name Added: story */}
              <textarea
                name="story"
                placeholder="Describe the olfactory journey..."
                className="styled-input styled-textarea"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="dropdowns-row">
              <div className="form-group">
                <label>Essence Category</label>
                <select
                  name="category"
                  className="styled-input styled-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Collection Tags</label>
                <select
                  name="tag"
                  className="styled-input styled-select"
                  value={tagId}
                  onChange={(e) => setTagId(e.target.value)}
                >
                  <option value="">Select Tag</option>
                  {tags.map((tag) => (
                    <option key={tag._id} value={tag._id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-fields-row">
              <div className="form-group">
                <label>Volume (ML)</label>
                <div className="input-with-unit">
                    <input
                      name="volume"
                      type="number"
                      placeholder="100"
                      className="styled-input"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                    />
                    <span className="unit-tag">ML</span>
                </div>
              </div>

              <div className="form-group">
                <label>Price (PKR)</label>
                <div className="input-with-unit">
                    <input
                      name="price"
                      type="number"
                      placeholder="8900"
                      className="styled-input"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                    <span className="unit-tag">PKR</span>
                </div>
              </div>
            </div>

            <div className="input-fields-row">
              <div className="form-group">
                <label>Discount (%)</label>
                <div className="input-with-unit">
                    <input
                      name="discountPercentage"
                      type="number"
                      placeholder="0"
                      className="styled-input"
                      min="0"
                      max="100"
                      value={discountPercentage}
                      onChange={(e) => setDiscountPercentage(e.target.value)}
                    />
                    <span className="unit-tag">%</span>
                </div>
              </div>
            </div>

            <div className="form-actions-section ">
              <button type="submit" className="publish-btn " disabled={submitting}>
                <MdOutlineFileUpload size={20} color="#FFFFFF"/>
                {submitting ? "Publishing..." : "Publish Product"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export default AddProducts;