import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuImagePlus } from "react-icons/lu";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoAddCircleOutline, IoTrashOutline } from "react-icons/io5";
import "../../styles/admin.css";
import { categoryApi, tagApi, imageApi } from "../../services/endpoints";
import { useAddProduct } from "../../services/hooks/products";
import { IoArrowBack } from 'react-icons/io5';

function AddProducts() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  // Form state
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagId, setTagId] = useState("");
  const [price, setPrice] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("0");

  // Variants state
  const [variants, setVariants] = useState([
    { size: "", price: "", discountPercentage: "0" }
  ]);

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([...variants, { size: "", price: "", discountPercentage: "0" }]);
  };

  const removeVariant = (index) => {
    if (variants.length <= 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  // Image states
  const [images, setImages] = useState([
    { file: null, preview: null }, // Primary
    { file: null, preview: null }, // Secondary 1
    { file: null, preview: null }, // Secondary 2
  ]);

  const primaryRef = useRef(null);
  const secondary1Ref = useRef(null);
  const secondary2Ref = useRef(null);

  // Fetch categories and tags on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          categoryApi.list(),
          tagApi.list()
        ]);
        setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data.data || []);
        setTags(Array.isArray(tagRes.data) ? tagRes.data : tagRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch dependencies:", err);
      }
    };
    fetchData();
  }, []);

  const addProductMutation = useAddProduct();

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = {
        file: file,
        preview: URL.createObjectURL(file)
      };
      setImages(newImages);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName.trim() || !price) return;

    try {
      // 1. Upload images first
      const imageIds = await Promise.all(
        images.map(async (img) => {
          if (img.file) {
            const res = await imageApi.upload(img.file);
            return res.data?.data?._id;
          }
          return null;
        })
      );

      const finalImageIds = imageIds.filter(id => id);

      // 2. Prepare variants
      const validVariants = variants
        .filter(v => v.size.trim() !== "")
        .map(v => ({
          size: v.size.includes("ml") ? v.size.trim() : `${v.size.trim()}ml`,
          price: Number(v.price) || 0,
          discountPercentage: Number(v.discountPercentage) || 0,
        }));

      // 3. Prepare payload
      const payload = {
        name: productName.trim(),
        price: Number(price),
        discountPercentage: Number(discountPercentage) || 0,
        description: description.trim(),
        category_id: categoryId || null,
        tag_id: tagId || null,
        image_id: finalImageIds,
        variants: validVariants,
      };

      // 3. Add product
      addProductMutation.mutate(payload, {
        onSuccess: () => {
          navigate("/products");
        }
      });
    } catch (err) {
      console.error("Failed to add product:", err);
    }
  };

  return (
    <section className="">
      <div className="title-section">
        <div className="header-main">
          <div className="back-arrow-btn" onClick={() => navigate('/products')}>
            <IoArrowBack size={24} />
          </div>
          <h1 className="catalog-title">Add New Fragrance</h1>
        </div>
        <p className="catalog-subtitle">Compose a new entry for the botanical collection</p>
      </div>

      <form className="product-form-layout" onSubmit={handleSubmit}>
        <div className="left-column">
          <div className="image-uploads-container">
            <div className="main-image-upload">
              <div className="image-placeholder" onClick={() => primaryRef.current.click()}>
                {images[0].preview ? (
                  <img src={images[0].preview} alt="Primary" className="image-preview" />
                ) : (
                  <>
                    <LuImagePlus size={30} color="#7E525C" />
                    <span className="placeholder-text">Primary Vision</span>
                  </>
                )}
                <input
                  type="file"
                  className="hidden-input"
                  ref={primaryRef}
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 0)}
                />
              </div>
            </div>

            <div className="secondary-images-row">
              <div className="secondary-image-upload">
                <div className="image-placeholder secondary-placeholder" onClick={() => secondary1Ref.current.click()}>
                  {images[1].preview ? (
                    <img src={images[1].preview} alt="Secondary 1" className="image-preview" />
                  ) : (
                    <LuImagePlus size={30} color="#7E525C" />
                  )}
                  <input
                    type="file"
                    className="hidden-input"
                    ref={secondary1Ref}
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 1)}
                  />
                </div>
              </div>

              <div className="secondary-image-upload">
                <div className="image-placeholder secondary-placeholder" onClick={() => secondary2Ref.current.click()}>
                  {images[2].preview ? (
                    <img src={images[2].preview} alt="Secondary 2" className="image-preview" />
                  ) : (
                    <LuImagePlus size={30} color="#7E525C" />
                  )}
                  <input
                    type="file"
                    className="hidden-input"
                    ref={secondary2Ref}
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 2)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="aesthetic-tip-box">
            <h4 className="tip-title"> Aesthetic Tip</h4>
            <p className="tip-content">
              High-contrast images with soft botanical elements perform best. Use natural daylight for product photography.
            </p>
          </div>
        </div>

        <div className="right-column">
          <div className="form-fields-container">
            <div className="form-group">
              <label>Product Identity</label>
              <input
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
              <textarea
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
                <label>Price (PKR)</label>
                <div className="input-with-unit">
                  <input
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

              <div className="form-group">
                <label>Discount (%)</label>
                <div className="input-with-unit">
                  <input
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

            {/* Variants Section */}
            <div className="variants-section">
              <div className="variants-header">
                <label className="variants-label">Product Variants</label>
                <button type="button" className="add-variant-btn" onClick={addVariant}>
                  <IoAddCircleOutline size={18} />
                  Add Variant
                </button>
              </div>

              <div className="variants-list">
                {variants.map((variant, index) => (
                  <div key={index} className="variant-card">
                    <div className="variant-card-header">
                      <span className="variant-number">Variant {index + 1}</span>
                      {variants.length > 1 && (
                        <button
                          type="button"
                          className="remove-variant-btn"
                          onClick={() => removeVariant(index)}
                        >
                          <IoTrashOutline size={16} />
                        </button>
                      )}
                    </div>
                    <div className="variant-fields-row">
                      <div className="form-group">
                        <label>Size</label>
                        <div className="input-with-unit">
                          <input
                            type="text"
                            placeholder="50ml"
                            className="styled-input"
                            value={variant.size}
                            onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                          />
                          <span className="unit-tag">ML</span>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Price</label>
                        <div className="input-with-unit">
                          <input
                            type="number"
                            placeholder="5000"
                            className="styled-input"
                            value={variant.price}
                            onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                          />
                          <span className="unit-tag">PKR</span>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Discount</label>
                        <div className="input-with-unit">
                          <input
                            type="number"
                            placeholder="0"
                            className="styled-input"
                            min="0"
                            max="100"
                            value={variant.discountPercentage}
                            onChange={(e) => handleVariantChange(index, 'discountPercentage', e.target.value)}
                          />
                          <span className="unit-tag">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-actions-section ">
              <button
                type="submit"
                className="publish-btn"
                disabled={addProductMutation.isPending}
              >
                <MdOutlineFileUpload size={20} color="#FFFFFF" />
                {addProductMutation.isPending ? "Publishing..." : "Publish Product"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export default AddProducts;