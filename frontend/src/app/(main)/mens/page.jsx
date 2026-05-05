"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ProductCard from "@/Components/ProductCard";
import { useInfiniteProducts, useTags } from "@/lib/api";
import Loader from "@/Components/Loader/Loader";
import CollectionFilters from "@/Components/CollectionFilters";

export default function MensPage() {
  const [activeCategory, setActiveCategory] = useState("men");
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
  const router = useRouter();

  const filters = {};
  
  // Base category filter
  if (activeCategory === "men" || activeCategory === "bestsellers") {
    filters.category = "men";
  } else if (activeCategory === "women") {
    filters.category = "women";
  }

  // Sorting
  if (sortBy === "price-asc") filters.price = "asc";
  if (sortBy === "price-desc") filters.price = "desc";
  if (sortBy === "newest") filters.sort = "newest";

  // Tag filtering (Collection)
  if (activeTag !== "all") {
    filters.tag = activeTag;
  }

  // Bestsellers rating sort
  if (activeCategory === "bestsellers") {
    filters.rating = "desc";
  }

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts(filters, 50);

  const products = data?.pages?.flatMap((page) => page.data) ?? [];
  const totalItems = data?.pages?.[0]?.pagination?.totalItems ?? products.length;

  const hasMore = totalItems > 50 && !!hasNextPage;

  return (
    <main className="bg-background min-h-screen pt-6 pb-10 md:pt-10 md:pb-16">
      {/* Hero Header */}
      <section className="text-center pb-4 px-4">
        <h1 className="text-[#7E525C] text-5xl sm:text-6xl md:text-7xl font-noto font-normal">
          For Men
        </h1>
        <div className="flex items-center justify-center gap-3 mt-3">
          <span className="block h-px w-12 bg-[#D1C3C1]" />
          <p className="text-[#4E4543] text-xs uppercase tracking-[4px] font-normal">
            THE BOTANICAL MONOGRAPH OF MASCULINITY        
          </p>
          <span className="block h-px w-12 bg-[#D1C3C1]" />
        </div>
      </section>

      {/* Category Filter Cards */}
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
                if (cat.id === "women") {
                  router.push("/womens");
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

      <CollectionFilters
        sortBy={sortBy}
        onSortChange={setSortBy}
        activeTag={activeTag}
        onTagChange={setActiveTag}
        tagOptions={tagOptions}
      />

      {/* Products Grid */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-5">
        {isLoading && <Loader size="lg" />}

        {isError && (
          <div className="text-center py-20 text-error text-sm">
            Failed to load products. Please try again.
          </div>
        )}

        {!isLoading && !isError && products.length === 0 && (
          <div className="text-center py-20 text-[#a08a8a] text-sm">
            No products found.
          </div>
        )}

        {!isLoading && !isError && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(220px,260px))] justify-items-center md:justify-items-stretch md:justify-start gap-x-5 gap-y-10">
              {products.map((product) => (
                <div key={product._id || product.id} className="w-full max-w-[340px] md:max-w-[260px]">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Load More */}
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
