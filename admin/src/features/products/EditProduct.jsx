import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LuImagePlus } from "react-icons/lu";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import "../../styles/admin.css";
import { categoryApi, tagApi, imageApi } from "../../services/endpoints";
import { useGetProductById, useUpdateProduct } from "../../services/hooks/products";
import Loader from "../../components/Loader";
import { API_BASE_URL } from "../../services/http";

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
  const [price, setPrice] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("0");
  const [volume, setVolume] = useState("");

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

  // Initialize form with existing data
  useEffect(() => {
    if (productRes?.data) {
      const p = productRes.data;
      setProductName(p.name || "");
      setDescription(p.description || "");
      setCategoryId(p.category_id?._id || p.category_id || "");
      setTagId(p.tag_id?._id || p.tag_id || "");
      setPrice(p.price || "");
      setDiscountPercentage(p.discountPercentage || "0");
      
      if (p.variants?.[0]?.size) {
        setVolume(p.variants[0].size.replace("ml", ""));
      }

      // Set existing images
      const newImages = [...images];
      if (p.image_id?.[0]) {
        newImages[0] = { file: null, preview: `${API_BASE_URL}/${p.image_id[0].path}`, existingId: p.image_id[0]._id };
      }
      if (p.image_id?.[1]) {
        newImages[1] = { file: null, preview: `${API_BASE_URL}/${p.image_id[1].path}`, existingId: p.image_id[1]._id };
      }
      if (p.image_id?.[2]) {
        newImages[2] = { file: null, preview: `${API_BASE_URL}/${p.image_id[2].path}`, existingId: p.image_id[2]._id };
      }
      setImages(newImages);
    }
  }, [productRes]);

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
    if (!productName.trim() || !price) return;

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

      // Filter out nulls
      const finalImageIds = imageIds.filter(id => id);

      // 2. Prepare payload
      const payload = {
        name: productName.trim(),
        price: Number(price),
        discountPercentage: Number(discountPercentage) || 0,
        description: description.trim(),
        category_id: categoryId || null,
        tag_id: tagId || null,
        image_id: finalImageIds,
      };

      if (volume) {
        payload.variants = [
          {
            size: `${volume}ml`,
            price: Number(price),
            discountPercentage: Number(discountPercentage) || 0,
          },
        ];
      }

      // 3. Update product
      updateMutation.mutate({ id, data: payload }, {
        onSuccess: () => {
          navigate("/products");
        }
      });
    } catch (err) {
      console.error("Failed to update product:", err);
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

            <div className="input-fields-row">
              <div className="form-group">
                <label>Volume (ML)</label>
                <div className="input-with-unit">
                    <input
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
