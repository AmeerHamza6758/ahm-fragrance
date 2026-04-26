"use client";
import ProductCard from "@/Components/ProductCard";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useInfiniteProducts } from "@/lib/api";


const img_1 = "/Images/colection_img_1.jpg";
const img_2 = "/Images/collection_img_2.jpg";
const img_3 = "/Images/colection_img_3.jpg";

const categories = [
  { id: "all", label: "All Collection" },
  { id: "Fresh", label: "Fresh" },
  { id: "Woody", label: "Woody" },
  { id: "Floral", label: "Floral" },
  { id: "Oriental", label: "Oriental" },
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
    // Backend expects exact tag names in `tag`.
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

  // Debug logging
  if (isError) {
    console.error("[Collections] API Error:", error);
  }

  return (
    <main className="collections-main">

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
        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          <div className="relative overflow-hidden h-[300px] w-full rounded-[48px_16px_48px_16px]">
            <Image
              src={img_1}
              alt="For Men"
              fill
              sizes="(max-width: 640px) 33vw, 33vw"
              className="object-fill"
            />
            <div className="absolute bottom-6 left-6 flex flex-col items-start justify-start">
              <h3 className="text-white text-base sm:text-lg md:text-2xl font-noto font-normal mb-1">
                For Men
              </h3>
              <div className="w-16 h-0.5 bg-[#F0B8C3]" />
            </div>
          </div>

          <div className="relative overflow-hidden h-[300px] w-full rounded-[48px_16px_48px_16px]">
            <Image
              src={img_2}
              alt="For Women"
              fill
              sizes="(max-width: 640px) 33vw, 33vw"
              className="object-fill object-center"
            />
            <div className="absolute bottom-6 left-6 flex flex-col items-start justify-start">
              <h3 className="text-white text-base sm:text-lg md:text-2xl font-noto font-normal mb-1">
                For Women
              </h3>
              <div className="w-16 h-0.5 bg-[#F0B8C3]" />
            </div>
          </div>

          <div className="relative overflow-hidden h-[300px] w-full rounded-[48px_16px_48px_16px]">
            <Image
              src={img_3}
              alt="Best Sellers"
              fill
              sizes="(max-width: 640px) 33vw, 33vw"
              className="object-cover object-center"
            />
            <div className="absolute bottom-6 left-6 flex flex-col items-start justify-start">
              <h3 className="text-white text-base sm:text-lg md:text-2xl font-noto font-normal mb-1">
                Best Sellers
              </h3>
              <div className="w-16 h-0.5 bg-[#F0B8C3]" />
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Sort */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-8">
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
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
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
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,260px))] justify-start gap-x-5 gap-y-10">
            {products.map((product) => (
              <div key={product._id} className="w-full max-w-[260px]">
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
            className="load-more-btn"
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
