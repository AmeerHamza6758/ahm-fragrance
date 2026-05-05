"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import {
  useFavorites,
  useProducts,
  useToggleFavorite,
  queryClient,
} from "@/lib/api";
import { buildProductImageUrl } from "@/lib/utils/imageUrl";
import ProductCard from "@/src/Components/ProductCard";
import Loader from "@/Components/Loader/Loader";

const getProductId = (product) => product?._id || product?.id;

const getProductImage = (product) => {
  const firstPath = product?.image_id?.[0]?.path || product?.image_id?.path;
  if (firstPath) {
    return buildProductImageUrl(firstPath);
  }
  if (product?.image) {
    return product.image;
  }
  return "/Images/best-1.svg";
};

const getProductPrice = (product) => {
  if (product?.variants?.length) {
    return product.variants[0]?.price ?? product.price ?? 0;
  }
  return product?.price ?? 0;
};

const getProductCategory = (product) => {
  if (product?.category_id?.name) return product.category_id.name;
  if (product?.tag_id?.name) return product.tag_id.name;
  return "Premium Fragrance";
};

export default function WishlistPage() {
  const {
    data: wishlistProducts = [],
    isLoading: wishlistLoading,
    isError: wishlistError,
  } = useFavorites();
  const { data: allProducts = [], isLoading: recLoading } = useProducts();
  const { mutate: toggleFavorite, isPending: isTogglingFavorite } =
    useToggleFavorite();

  const wishlistIds = useMemo(() => {
    return new Set(wishlistProducts.map((product) => getProductId(product)));
  }, [wishlistProducts]);

  // Enrich wishlist items with full product data from allProducts (which has image_id populated)
  const enrichedWishlistProducts = useMemo(() => {
    return wishlistProducts.map((favProduct) => {
      const id = getProductId(favProduct);
      const fullProduct = allProducts.find((p) => getProductId(p) === id);
      return fullProduct || favProduct;
    });
  }, [wishlistProducts, allProducts]);

  const recommendedProducts = useMemo(() => {
    return allProducts
      .filter((product) => !wishlistIds.has(getProductId(product)))
      .slice(0, 4);
  }, [allProducts, wishlistIds]);

  const handleWishlistToggle = (productId) => {
    if (!productId) return;

    toggleFavorite(String(productId), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["favorites"] });
      },
    });
  };

  return (
    <main className="min-h-screen bg-background pt-6 pb-10 md:pt-10 md:pb-16 overflow-x-hidden">
      {/* Breadcrumb */}
      {/* <div className="mx-auto max-w-7xl px-18 p lg:px-8 md:px-6 sm:px-5">
        <nav className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.9px] text-secondary/60 md:text-[10px] sm:flex-wrap sm:gap-2">
          <Link href="/" className="hover:text-primary transition-colors">
            HOME
          </Link>

          <span className="text-foreground/50">/</span>
          <span className="text-primary font-semibold tracking-[1px]">
            WISHLIST
          </span>
        </nav>
      </div> */}

      {/* Page Title */}
      <section className="text-center pb-14 px-4 ">
        <h1 className="text-[#7E525C] text-5xl sm:text-6xl md:text-7xl font-noto font-normal">
          My Wishlist
        </h1>
        <div className="flex items-center justify-center gap-3 mt-4">
          <span className="block h-px w-12 bg-[#D1C3C1]" />
          <p className="text-[#4E4543] text-xs uppercase tracking-[2px] font-normal">
            A curated space for your most desired botanical essences, waiting to
            become part of your signature collection.
          </p>
          <span className="block h-px w-12 bg-[#D1C3C1]" />
        </div>
      </section>

      {/* Products Grid */}
      <div className="mx-auto max-w-7xl px-10 pb-24 lg:px-8 md:px-6 sm:px-5">
        {wishlistLoading || recLoading ? (
          <Loader />
        ) : wishlistError ? (
          <div className="py-16 text-center text-primary">
            Failed to load wishlist.
          </div>
        ) : enrichedWishlistProducts.length === 0 ? (
          <div className="py-16 text-center text-primary">
            Your wishlist is empty.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(220px,260px))] justify-items-center md:justify-items-stretch md:justify-start gap-x-5 gap-y-10">
            {enrichedWishlistProducts.map((product) => (
              <div
                key={product._id || product.id}
                className="w-full max-w-[340px] md:max-w-[260px]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* You May Also Like */}
      <div className="mx-auto max-w-7xl px-10 pb-32 lg:px-8 md:px-6 sm:px-5">
        {/* Header row */}
        <div className="mb-12 flex flex-row items-end justify-between gap-6 w-full">
          <div className="flex flex-col">
            <h2 className="font-noto font-bold text-foreground mb-4 text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] leading-tight">
              You May Also Like
            </h2>
            <p className="text-sm text-muted">
              Based on your refined preferences
            </p>
          </div>
          <div className="flex-1 flex justify-end">
            <Link
              href="/collections"
              className="text-xs text-secondary flex items-center gap-1 font-semibold uppercase hover:text-primary transition-colors whitespace-nowrap"
            >
              VIEW ALL RECOMMENDATIONS <span><ArrowRight size={16} /></span>
            </Link>
          </div>
        </div>

        {/* Recommendations */}
        {recLoading ? (
          <Loader />
        ) : recommendedProducts.length === 0 ? (
          <div className="py-10 text-center text-primary">
            No recommendations found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-5">
            {recommendedProducts.map((product) => {
              const productId = getProductId(product);
              const image = getProductImage(product);
              const category = getProductCategory(product);

              return (
                <div key={productId} className="flex flex-col group">
                  <Link href={`/product/${productId}`}>
                    <div
                      className="relative w-full rounded-[14px] overflow-hidden mb-4 bg-[#e8e4e0]"
                      style={{ aspectRatio: "4/5", position: "relative" }}
                    >
                      <Image
                        src={image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-secondary text-[10px] tracking-wider capitalize">
                      <p>{product.tag_id?.name}</p>
                      <div className="w-px h-3.5 bg-secondary"></div>
                      <p>{product.category_id?.name}</p>
                    </div>
                    <Link href={`/product/${productId}`}>
                      <h3 className="text-[#7E525C] text-base font-normal leading-snug font-noto transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-secondary text-xs tracking-wider">{product.description}</p>
                    <div className="flex items-center justify-between mt-2">

                      <div className="flex items-center gap-2">
                        <span className="text-[#1c1c19] text-sm font-semibold">
                          Rs. {getProductPrice(product).toLocaleString()}
                        </span>

                        {product.discountPercentage > 0 && (
                          <span className="text-[11px] text-green-600 font-medium">
                            -{product.discountPercentage}%
                          </span>
                        )}
                      </div>

                      <button onClick={() => router.push(`/product/${productId}`)} className="cursor-pointer bg-[#7E525C] text-white px-3 py-2 rounded-full text-[10px] font-semibold 
                          uppercase tracking-widest hover:bg-secondary transition-colors shadow-sm"
                        style={{ letterSpacing: "0.12em" }}>
                        ORDER NOW
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
