import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LuImagePlus } from "react-icons/lu";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoArrowBack, IoAddCircleOutline, IoTrashOutline } from "react-icons/io5";
import "../../styles/admin.css";
import { categoryApi, tagApi, imageApi } from "../../services/endpoints";
import { useGetProductById, useUpdateProduct } from "../../services/hooks/products";
import Loader from "../../components/Loader";
import { errorToaster, successToaster } from "../../utils/alert-service";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  // Form state
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagId, setTagId] = useState("");

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
    { file: null, preview: null, existingId: null }, // Primary
    { file: null, preview: null, existingId: null }, // Secondary 1
    { file: null, preview: null, existingId: null }, // Secondary 2
  ]);

  const primaryRef = useRef(null);
  const secondary1Ref = useRef(null);
  const secondary2Ref = useRef(null);

  const { data: productRes, isLoading: isFetching } = useGetProductById(id);
  const updateMutation = useUpdateProduct();
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  // Initialize form with existing data
  useEffect(() => {
    if (productRes?.data) {
      const p = productRes.data;
      setProductName(p.name || "");
      setDescription(p.description || "");
      setCategoryId(p.category_id?._id || p.category_id || "");
      setTagId(p.tag_id?._id || p.tag_id || "");
      
      if (p.variants && Array.isArray(p.variants) && p.variants.length > 0) {
        setVariants(p.variants.map(v => ({
          size: v.size || "",
          price: v.price || "",
          discountPercentage: v.discountPercentage || "0"
        })));
      } else {
        setVariants([{ size: "", price: "", discountPercentage: "0" }]);
      }

      // Set existing images
      const newImages = [...images];
      if (p.image_id?.[0]) {
        newImages[0] = { file: null, preview: `${BASE_URL}/${p.image_id[0].path}`, existingId: p.image_id[0]._id };
      }
      if (p.image_id?.[1]) {
        newImages[1] = { file: null, preview: `${BASE_URL}/${p.image_id[1].path}`, existingId: p.image_id[1]._id };
      }
      if (p.image_id?.[2]) {
        newImages[2] = { file: null, preview: `${BASE_URL}/${p.image_id[2].path}`, existingId: p.image_id[2]._id };
      }
      setImages(newImages);
    }
  }, [productRes, BASE_URL]);

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
        console.error("Failed to fetch categories/tags:", err);
      }
    };
    fetchData();
  }, []);

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = { 
        ...newImages[index], 
        file: file, 
        preview: URL.createObjectURL(file) 
      };
      setImages(newImages);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Client-side validation
    if (!productName.trim()) {
      errorToaster("Product name is required");
      return;
    }
    if (!categoryId) {
      errorToaster("Please select an essence category");
      return;
    }
    if (!tagId) {
      errorToaster("Please select a collection tag");
      return;
    }
    
    // Check if at least one image exists (either new or existing)
    const hasImage = images.some(img => img.file || img.existingId);
    if (!hasImage) {
      errorToaster("At least one product image is required");
      return;
    }

    const invalidVariant = variants.find(v => !v.size.trim() || !v.price || Number(v.price) <= 0);
    if (invalidVariant) {
      errorToaster("Each variant must have a valid size and price (greater than 0)");
      return;
    }

    try {
      // 1. Upload new images first
      const imageIds = await Promise.all(
        images.map(async (img) => {
          if (img.file) {
            const res = await imageApi.upload(img.file);
            return res.data?.data?._id; // New ID
          }
          return img.existingId; // Keep existing ID
        })
      );

      const finalImageIds = imageIds.filter(id => id);

      // 2. Prepare variants
      const validVariants = variants
        .filter(v => v.size.trim() !== "")
        .map(v => ({
          size: v.size.toLowerCase().includes("ml") ? v.size.trim() : `${v.size.trim()}ml`,
          price: Number(v.price) || 0,
          discountPercentage: Number(v.discountPercentage) || 0,
        }));

      // 3. Prepare payload
      const payload = {
        name: productName.trim(),
        description: description.trim(),
        category_id: categoryId,
        tag_id: tagId,
        image_id: finalImageIds,
        variants: validVariants
      };

      // 4. Update product
      updateMutation.mutate({ id, data: payload }, {
        onSuccess: () => {
          successToaster("Fragrance essence refined successfully");
          navigate("/products");
        },
        onError: (err) => {
          const errMsg = err.response?.data?.message || err.response?.data?.data || "Failed to refine essence";
          errorToaster(errMsg);
        }
      });
    } catch (err) {
      console.error("Failed to update product:", err);
      errorToaster("An unexpected error occurred during update");
    }
  };

  if (isFetching) {
    return <Loader text="Retrieving botanical data..." />;
  }

  return (
    <section className="view-product-container">
       <div className="admin-view-header">
            <div className="header-main">
               <div className="back-arrow-btn" onClick={() => navigate('/products')}>
                  <IoArrowBack size={24} />
               </div>
               <h1 className="catalog-title">Edit Fragrance</h1>
            </div>
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
                    <LuImagePlus size={30} color="#7E525C"/>
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
            <h4 className="tip-title">Refining the Essence</h4>
            <p className="tip-content">
              Updating a fragrance's visual identity ensures your collection remains contemporary and alluring.
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
                disabled={updateMutation.isPending}
              >
                <MdOutlineFileUpload size={20} color="#FFFFFF"/>
                {updateMutation.isPending ? "Refining Essence..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export default EditProduct;

