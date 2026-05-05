"use client";
import ProductCard from "@/Components/ProductCard";
import { useState } from "react";
import Image from "next/image";
import { useInfiniteProducts, useTags } from "@/lib/api";
import { useMemo } from "react";
import Loader from "@/Components/Loader/Loader";
import CollectionFilters from "@/Components/CollectionFilters";
const img_1 = "/Images/colection_img_1.jpg";
const img_2 = "/Images/collection_img_2.jpg";
const img_3 = "/Images/colection_img_3.jpg";

export default function CollectionsPage() {
  const [activeTag, setActiveTag] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const { data: tags = [] } = useTags();

  const tagOptions = useMemo(
    () => [
      { id: "all", label: "All Collection" },
      ...tags.map((tag) => ({ id: tag.name, label: tag.name })),
    ],
    [tags],
  );

  // Build filters for the API call
  const filters = {};
  if (sortBy === "price-asc") filters.price = "asc";
  if (sortBy === "price-desc") filters.price = "desc";
  if (activeTag !== "all") {
    filters.tag = activeTag;
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
  return (
    <main className="pt-6 pb-10 md:pt-10 md:pb-16">
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

      <CollectionFilters
        sortBy={sortBy}
        onSortChange={setSortBy}
        activeTag={activeTag}
        onTagChange={setActiveTag}
        tagOptions={tagOptions}
      />

      {/* Products Grid */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && <Loader size="lg" />}

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