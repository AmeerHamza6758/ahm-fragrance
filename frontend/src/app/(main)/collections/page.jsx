"use client";
import ProductCard from "@/Components/ProductCard";
import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useInfiniteProducts } from "@/lib/api";
import {  useEffect, useRef } from "react";
const img_1 = "/Images/colection_img_1.jpg";
const img_2 = "/Images/collection_img_2.jpg";
const img_3 = "/Images/colection_img_3.jpg";

const categories = [
  { id: "all", label: "All Collection" },
  { id: "Fresh", label: "Fresh" },
  { id: "Woody", label: "Woody" },
  { id: "Floral", label: "Floral" },
  { id: "Oriental", label: "Oriental" },
  { id: "Musk", label: "Musk" }, // Extra categories for scroll testing
  { id: "Spicy", label: "Spicy" },
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
  const [categoryOpen, setCategoryOpen] = useState(false); // Added missing state
const categoryRef = useRef(null);
  const sortRef = useRef(null);
  // Build filters for the API call
  const filters = {};
  if (sortBy === "price-asc") filters.price = "asc";
  if (sortBy === "price-desc") filters.price = "desc";
  if (activeCategory !== "all") {
    filters.tag = activeCategory;
  }

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts(filters, 50);

  const products = data?.pages?.flatMap((page) => page.data) ?? [];
  const totalItems = data?.pages?.[0]?.pagination?.totalItems ?? products.length;
  const showLoadMore = totalItems > 50 && !!hasNextPage;

  if (isError) {
    console.error("[Collections] API Error:", error);
  }
useEffect(() => {
  const handleClickOutside = (event) => {
    // Agar category dropdown khula hai aur click uske bahar hua hai
    if (categoryOpen && categoryRef.current && !categoryRef.current.contains(event.target)) {
      setCategoryOpen(false);
    }
    // Agar sort dropdown khula hai aur click uske bahar hua hai
    if (sortOpen && sortRef.current && !sortRef.current.contains(event.target)) {
      setSortOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [categoryOpen, sortOpen]);

  return (
    <main className="collections-main page-main-spacing">
      <section className="text-center pb-4 px-4">
        <h1 className="text-[#7E525C] text-5xl sm:text-6xl md:text-7xl font-noto font-normal">
          Our Collection
        </h1>
        <div className="flex items-center justify-center gap-3 mt-3">
          <span className="block h-px w-12 bg-[#D1C3C1]" />
          <p className="text-[#4E4543] text-xs uppercase tracking-[4px] font-normal">
            THE FRAGRANCE GALLERY
          </p>
          <span className="block h-px w-12 bg-[#D1C3C1]" />
        </div>
      </section>

      {/* Category Cards */}
      <section className="mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
          {[
            { img: img_1, title: "For Men" },
            { img: img_2, title: "For Women" },
            { img: img_3, title: "Best Sellers" },
          ].map((item, idx) => (
            <div key={idx} className="relative overflow-hidden h-[220px] sm:h-[300px] w-full rounded-[32px_12px_32px_12px] sm:rounded-[48px_16px_48px_16px]">
              <Image
                src={item.img}
                alt={item.title}
                fill
                sizes="(max-width: 639px) 100vw, 33vw"
                className="object-cover object-center"
              />
              <div className="absolute bottom-6 left-6 flex flex-col items-start justify-start">
                <h3 className="text-white text-base sm:text-lg md:text-2xl font-noto font-normal mb-1">
                  {item.title}
                </h3>
                <div className="w-16 h-0.5 bg-[#F0B8C3]" />
              </div>
            </div>
          ))}
        </div>
      </section>

    {/* Filters and Sort Dropdowns */}
<section className="w-full px-4 sm:px-6 lg:px-8 py-4">
  <div className="w-full flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-start lg:gap-8">
    
  
    {/* SORT DROPDOWN */}
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
      <span className="text-[#7E525C] text-xs lg:text-xl font-bold tracking-widest whitespace-nowrap">SORT:</span>
      <div className="relative w-full sm:w-[240px] " ref={sortRef}>
        <button
          className="flex items-center justify-between w-full px-5 py-2.5 border border-[#7E525C33] rounded-full text-[#4E4543] text-sm bg-white outline-none"
          onClick={() => {
            setSortOpen(!sortOpen);
            setCategoryOpen(false);
          }}
        >
          <span className="truncate">{sortOptions.find((opt) => opt.id === sortBy)?.label}</span>
          {sortOpen ? <ChevronUp size={18} className="shrink-0 ml-2" /> : <ChevronDown size={18} className="shrink-0 ml-2" />}
        </button>

        {sortOpen && (
          <div className="absolute z-[100] mt-1 w-full bg-white border border-[#7E525C33] rounded-2xl shadow-xl overflow-hidden left-0">
            {sortOptions.map((opt) => (
              <button
                key={opt.id}
                className={`w-full text-left px-5 py-3  sort-option ${
                  sortBy === opt.id ? "active" : ""
                }`}
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
      {/* COLLECTION DROPDOWN */}
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
      <span className="text-[#7E525C] text-xs lg:text-xl font-semibold tracking-widest ">COLLECTION:</span>
      <div className="relative w-full sm:w-[240px] " ref={categoryRef}>
        <button
          className="flex items-center justify-between w-full px-5 py-2.5 border border-[#7E525C33] rounded-full text-[#4E4543] text-sm bg-white outline-none"
          onClick={() => {
            setCategoryOpen(!categoryOpen);
            setSortOpen(false);
          }}
        >
          <span className="truncate">{categories.find((cat) => cat.id === activeCategory)?.label}</span>
          {categoryOpen ? <ChevronUp size={18} className="shrink-0 ml-2" /> : <ChevronDown size={18} className="shrink-0 ml-2" />}
        </button>

        {categoryOpen && (
          <div className="absolute z-[100] mt-1 w-full bg-white border border-[#7E525C33] rounded-2xl shadow-xl max-h-[220px] overflow-y-auto left-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`w-full text-left px-5 py-3 text-sm sort-option ${
                  activeCategory === cat.id ? "active" : ""
                }`}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setCategoryOpen(false);
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>


  </div>
</section>

      {/* Products Grid */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-[#7E525C] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {isError && (
          <div className="text-center py-20 text-red-500 font-serif">
            Failed to load products. Please try again.
          </div>
        )}

        {!isLoading && !isError && products.length === 0 && (
          <div className="text-center py-20 text-gray-500 font-serif">
            No products found in this collection.
          </div>
        )}

        {!isLoading && !isError && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(220px,260px))] justify-items-center md:justify-items-stretch md:justify-start gap-x-5 gap-y-10">
            {products.map((product) => (
              <div key={product._id} className="w-full max-w-[340px] md:max-w-[260px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Load More Button */}
      {showLoadMore && (
        <section className="w-full px-4 sm:px-6 lg:px-8 py-10 flex justify-center">
          <button
            className="px-8 py-3 border border-[#4E4543] text-[#4E4543] text-xs tracking-widest uppercase hover:bg-[#4E4543] hover:text-white transition-all duration-300 rounded-full"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading..." : "Load More Fragrances"}
          </button>
        </section>
      )}
    </main>
  );
}