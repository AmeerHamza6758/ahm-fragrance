"use client";

import { useState } from "react";
import Image from "next/image";
import ProductCard from "@/Components/ProductCard";
import { useProducts } from "@/lib/api";

const ITEMS_PER_PAGE = 8;

export default function MensPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const filters = {};
  if (activeCategory === "all") filters.category = "men";
  else if (activeCategory === "women") filters.category = "women";
  // bestsellers: no category filter, just all products

  const { data: allProducts = [], isLoading, isError } = useProducts(filters);

  // Client-side filter to ensure only men products show by default
  const filteredProducts = allProducts.filter((product) => {
    if (activeCategory === "all") {
      // Show only men's products
      return (
        product.category_id?.name?.toLowerCase() === "men" ||
        !product.category_id
      );
    } else if (activeCategory === "women") {
      return product.category_id?.name?.toLowerCase() === "women";
    }
    return true; // bestsellers: show all
  });

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <main className="bg-[#fdf9f5] min-h-screen pt-21">
      {/* Hero Header */}
      <section className="text-center pt-12 pb-4 px-4">
        <h1
          className="text-[#7e525c] text-5xl sm:text-6xl md:text-7xl font-serif font-normal"
          style={{ fontFamily: "Noto Serif, Georgia, serif", fontWeight: 400 }}
        >
          For Men
        </h1>
        <div className="flex items-center justify-center gap-3 mt-3">
          <span className="block h-px w-12 bg-[#c4a99e]" />
          <p
            className="text-[#a08a8a] text-xs uppercase tracking-[4px] font-normal"
            style={{
              fontFamily: "Manrope, Arial, sans-serif",
              letterSpacing: "4px",
            }}
          >
            The Botanical Monograph of Masculinity
          </p>
          <span className="block h-px w-12 bg-[#c4a99e]" />
        </div>
      </section>

      {/* Category Filter Cards */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-3 gap-4 sm:gap-6">
          {[
            { id: "all", label: "For Men", img: "/Images/for-him.svg" },
            { id: "women", label: "For Women", img: "/Images/for-her.svg" },
            {
              id: "bestsellers",
              label: "Best Sellers",
              img: "/Images/best-1.svg",
            },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              className="relative rounded-2xl overflow-hidden aspect-4/3 group cursor-pointer outline-none border-0"
            >
              <Image
                src={cat.img}
                alt={cat.label}
                fill
                className={`object-cover transition-all duration-300 ${activeCategory === cat.id ? "brightness-75" : "brightness-50 group-hover:brightness-75"}`}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {activeCategory === cat.id && (
                  <span className="block w-6 h-px bg-white mb-1" />
                )}
                <span
                  className="text-white text-sm sm:text-base md:text-lg font-serif font-normal"
                  style={{ fontFamily: "Noto Serif, Georgia, serif" }}
                >
                  {cat.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        {isLoading && (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-4 border-[#7e525c] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {isError && (
          <div className="text-center py-20 text-red-500 text-sm">
            Failed to load products. Please try again.
          </div>
        )}

        {!isLoading && !isError && filteredProducts.length === 0 && (
          <div className="text-center py-20 text-[#a08a8a] text-sm">
            No products found.
          </div>
        )}

        {!isLoading && !isError && visibleProducts.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-14">
                <button
                  onClick={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}
                  className="px-12 py-3 rounded-full border border-[#1c1c19] text-[#1c1c19] text-sm font-semibold uppercase tracking-widest hover:bg-[#1c1c19] hover:text-white transition-colors duration-300"
                  style={{
                    fontFamily: "Manrope, Arial, sans-serif",
                    letterSpacing: "0.12em",
                  }}
                >
                  Load More Fragrances
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
