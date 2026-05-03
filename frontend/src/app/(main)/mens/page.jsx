"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ProductCard from "@/Components/ProductCard";
import { useInfiniteProducts } from "@/lib/api";
import {  useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
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
export default function WomensPage() {
// Isse update karein
const [activeCategory, setActiveCategory] = useState("all");
  const router = useRouter();

  // bestsellers: no category filter, just all products
    const [sortBy, setSortBy] = useState("newest");
    const [sortOpen, setSortOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false); // Added missing state
  const categoryRef = useRef(null);
    const sortRef = useRef(null);
    const filters = {};
    if (sortBy === "price-asc") filters.price = "asc";
    if (sortBy === "price-desc") filters.price = "desc";
    if (activeCategory !== "all") {
      filters.tag = activeCategory;
    } 
  if (activeCategory === "men" || activeCategory === "bestsellers") {
    filters.category = "men";
  }
  else if (activeCategory === "women") filters.category = "women";
  if (activeCategory === "bestsellers") {
    filters.rating = "desc";
  }
    // Build filters for the API call
   
  
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

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts(filters, 50);

  const allProducts = data?.pages?.flatMap((page) => page.data) ?? [];
  const totalItems = data?.pages?.[0]?.pagination?.totalItems ?? allProducts.length;

  // Client-side filter to ensure only women products show by default
  const filteredProducts = allProducts.filter((product) => {
    if (activeCategory === "women") {
      // Show only women's products
      return (
        product.category_id?.name?.toLowerCase() === "women" ||
        !product.category_id
      );
    } else if (activeCategory === "bestsellers") {
      return product.category_id?.name?.toLowerCase() === "women";
    } else if (activeCategory === "men") {
      return product.category_id?.name?.toLowerCase() === "men";
    }
    return true; // bestsellers: show all
  });

  const hasMore = totalItems > 50 && !!hasNextPage;

  return (
    <main className="bg-background min-h-screen pt-6 pb-10 md:pt-10 md:pb-16">
      <section className="text-center pb-4 px-4">
        <h1 className="text-[#7E525C] text-5xl sm:text-6xl md:text-7xl font-noto font-normal">
          For Men
        </h1>
        <div className="flex items-center justify-center gap-3 mt-3">
          <span className="block h-px w-12 bg-[#D1C3C1]" />
          <p className="text-[#4E4543] text-xs uppercase tracking-[4px] font-normal">
          The Botanical Monograph of Femininity        
          </p>
          <span className="block h-px w-12 bg-[#D1C3C1]" />
        </div>
      </section>
      <section className="mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          {[
            { id: "men", label: "For Men", img: "/Images/c-mens-card.png" },
            { id: "women", label: "For Women", img: "/Images/c-womens-card.png" },
            {
              id: "bestsellers",
              label: "Best Sellers",
              img: "/Images/c-best-sellter-card.png",
            },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                if (cat.id === "men") {
                  router.push("/mens");
                  return;
                }
                setActiveCategory(cat.id);
              }}
              className="relative overflow-hidden h-[192px] w-full group cursor-pointer outline-none border-0 rounded-[48px_16px_48px_16px]"
            >
              <Image
                src={cat.img}
                alt={cat.label}
                fill
                className="object-cover transition-all duration-300"
              />
              <div
                className={`absolute inset-0 transition-colors duration-300 ${activeCategory === cat.id ? "bg-transparent" : "bg-[#EBE7E4]/55"}`}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className={`${activeCategory === cat.id ? "text-white" : "text-[#4E4543]"} text-sm sm:text-base md:text-2xl font-noto font-normal`}
                >
                  {cat.label}
                </span>
                {activeCategory === cat.id && (
                  <span className="block w-12 h-px bg-white mb-1" />
                )}
              </div>
            </button>
          ))}
        </div>
      </section>
  {/* Filters and Sort Dropdowns */}
<section className="w-full px-4 sm:px-6 lg:px-8 py-4  lg:my-6 rounded-2xl ">
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
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        {isLoading && (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {isError && (
          <div className="text-center py-20 text-error text-sm">
            Failed to load products. Please try again.
          </div>
        )}

        {!isLoading && !isError && filteredProducts.length === 0 && (
          <div className="text-center py-20 text-[#a08a8a] text-sm">
            No products found.
          </div>
        )}

        {!isLoading && !isError && filteredProducts.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(220px,260px))] justify-items-center md:justify-items-stretch md:justify-start gap-x-5 gap-y-10">
              {filteredProducts.map((product) => (
                <div key={product._id || product.id} className="w-full max-w-[340px] md:max-w-[260px]">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-14">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-12 py-3 rounded-full border border-[#1c1c19] text-[#1c1c19] text-sm font-semibold uppercase tracking-widest hover:bg-[#1c1c19] hover:text-white transition-colors duration-300"
                  style={{ letterSpacing: "0.12em" }}
                >
                  {isFetchingNextPage ? "Loading..." : "Load More Fragrances"}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
