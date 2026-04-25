"use client";
import ProductCard from "@/Components/ProductCard";
// import img_1 from "/public/Images/colection_img_1.jpg";
// import img_2 from "/public/Images/colection_img_2.jpg";
// import img_3 from "/public/Images/colection_img_3.jpg";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useProducts } from "@/lib/api";


const img_1 = "/Images/colection_img_1.jpg";
const img_2 = "/Images/collection_img_2.jpg";
const img_3 = "/Images/colection_img_3.jpg";

const categories = [
  { id: "all", label: "All Collection" },
  { id: "inspired", label: "Inspired" },
  { id: "signature", label: "Signature" },
  { id: "oud", label: "Oud Series" },
  { id: "limited", label: "Limited Edition" },
];

const sortOptions = [
  { id: "newest", label: "Newest First" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
];

export default function CollectionsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [sortOpen, setSortOpen] = useState(false);

  // Build filters for the API call
  const filters = {};
  if (sortBy === "price-asc") filters.price = "asc";
  if (sortBy === "price-desc") filters.price = "desc";
  if (activeCategory !== "all") {
    // Use the label (with spaces/case) for tag filter (must match API exactly)
    const tagLabel = categories.find((cat) => cat.id === activeCategory)?.label;
    filters.tag = tagLabel;
  }

  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useProducts(filters);

  // Debug logging
  if (isError) {
    console.error("[Collections] API Error:", error);
  }

  return (
    <main className="collections-main">
      {/* Header Section */}
      <section className="collections-header">
        <div className="collections-header-content">
          <p className="fragrance-gallery">THE FRAGRANCE GALLERY</p>
          <h1>Our Collection</h1>
          <nav className="breadcrumb">
            <Link href="/">Home</Link>
            <span>&rsaquo;</span>
            <span>Collection</span>
          </nav>
        </div>
      </section>

      {/* Category Cards */}
      <section className="category-cards-section">
        <div className="category-cards">
          <div className="category-card">
            <Image
              src={img_1}
              alt="For Men"
              fill
              className="category-card-image"
            />
            <div className="category-overlay"></div>
            <div className="category-content">
              <h3>For Men</h3>
            </div>
          </div>

          <div className="category-card">
            <Image
              src={img_2}
              alt="For Women"
              fill
              className="category-card-image"
            />
            <div className="category-overlay"></div>
            <div className="category-content">
              <h3>For Women</h3>
            </div>
          </div>

          <div className="category-card">
            <Image
              src={img_3}
              alt="Best Sellers"
              fill
              className="category-card-image"
            />
            <div className="category-overlay"></div>
            <div className="category-content">
              <h3>Best Sellers</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Sort */}
      <section className="filters-section">
        <div className="filters-container">
          <div className="filter-tabs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`filter-tab ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="sort-container">
            <span className="sort-label">SORT:</span>
            <div className="sort-dropdown">
              <button
                className="sort-button"
                onClick={() => setSortOpen(!sortOpen)}
              >
                {sortOptions.find((opt) => opt.id === sortBy)?.label}
                <ChevronDown size={18} />
              </button>
              {sortOpen && (
                <div className="sort-menu">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.id}
                      className={`sort-option ${sortBy === opt.id ? "active" : ""}`}
                      onClick={() => {
                        setSortBy(opt.id);
                        setSortOpen(false);
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-grid-section">
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {isError && (
          <div className="text-center py-20 text-red-500">
            Failed to load products. Please try again.
          </div>
        )}

        {!isLoading && !isError && products.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No products found.
          </div>
        )}

        {!isLoading && !isError && products.length > 0 && (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Load More Button */}
      <section className="load-more-section">
        <button className="load-more-btn">Load More Fragrances</button>
      </section>
    </main>
  );
}
