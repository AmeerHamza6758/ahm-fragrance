"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Heart } from "lucide-react";
import { useProducts } from "@/lib/api/hooks/useProducts";
import { queryClient, useFavorites, useToggleFavorite } from "@/lib/api";
import { buildProductImageUrl } from "@/lib/utils/imageUrl";

export default function BestSellers() {
  // Fetch top-rated products
  const { data: products = [], isLoading } = useProducts({ rating: "desc" });
  const { data: wishlistProducts = [] } = useFavorites();
  const { mutate: toggleFavorite, isPending: isTogglingFavorite } =
    useToggleFavorite();
  const visibleProducts = products.slice(0, 8);

  const wishlistIds = useMemo(
    () =>
      new Set(
        (Array.isArray(wishlistProducts) ? wishlistProducts : [])
          .map((item) => item?._id || item?.id)
          .filter(Boolean)
          .map(String),
      ),
    [wishlistProducts],
  );

  const handleWishlistToggle = (event, productId) => {
    event.preventDefault();
    event.stopPropagation();
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      window.location.href = "/auth/login";
      return;
    }
    if (!productId) return;
    toggleFavorite(String(productId), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["favorites"] });
      },
    });
  };

  return (
    <section className="best-sellers">
      <div className="best-sellers-top">
        <div>
          <h2>The Best Sellers</h2>
          <p>Our most loved signature fragrances</p>
        </div>
      </div>

      {isLoading ? (
        <div className="w-full max-w-[1184px] mx-auto flex justify-center items-center py-12">
          <div className="w-9 h-9 border-4 border-[#7e525c] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(220px,260px))] justify-items-center md:justify-items-stretch md:justify-start gap-x-5 gap-y-10">
          {visibleProducts.map((product) => (
            <div
              key={product._id || product.id}
              className="w-full max-w-[340px] md:max-w-[260px] relative group"
            >
              <Link
                href={`/product/${product._id || product.id}`}
                className="best-seller-product-link"
              >
                <div className="product-card">
                  <div className="product-image-wrap">
                    <Image
                      src={buildProductImageUrl(product.image_id?.path)}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="product-image"
                      unoptimized
                    />
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <p className="product-category">
                      {product.category_id?.name || "-"}
                    </p>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-notes text-xs sm:text-sm text-muted font-manrope tracking-wide">
                      {product.description?.trim() || "A premium signature fragrance crafted for lasting elegance."}
                    </p>
                    <p className="product-price">
                      Rs. {product.price?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
              <button
                type="button"
                className="absolute top-3 left-3 w-10 h-10 rounded-full bg-white/95 text-primary flex items-center justify-center shadow-md transition-opacity duration-200 opacity-0 group-hover:opacity-100 disabled:cursor-not-allowed"
                onClick={(event) =>
                  handleWishlistToggle(event, product._id || product.id)
                }
                disabled={isTogglingFavorite}
                aria-label="Toggle wishlist"
              >
                <Heart
                  size={18}
                  fill={
                    wishlistIds.has(String(product._id || product.id))
                      ? "currentColor"
                      : "none"
                  }
                  stroke="currentColor"
                  strokeWidth={2}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
