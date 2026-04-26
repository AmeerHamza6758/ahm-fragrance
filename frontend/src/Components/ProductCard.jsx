"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { queryClient, useFavorites, useToggleFavorite } from "@/lib/api";
import { buildProductImageUrl } from "@/lib/utils/imageUrl";

export default function ProductCard({ product }) {
  const {
    _id,
    id,
    name,
    price,
    discountPercentage = 0,
    description,
    notes,
    image,
    // category_id,
    image_id,
    // tag_id,
  } = product;

  const productId = _id || id;
  const { data: wishlistProducts = [] } = useFavorites();
  const { mutate: toggleFavorite, isPending: isTogglingFavorite } =
    useToggleFavorite();
  const isWishlisted = useMemo(
    () =>
      Array.isArray(wishlistProducts) &&
      wishlistProducts.some((item) => {
        const wishId = item?._id || item?.id;
        return String(wishId) === String(productId);
      }),
    [wishlistProducts, productId],
  );

  // Build image URL from API or use local fallback
  const imageUrl = image_id?.path
    ? buildProductImageUrl(image_id.path)
    : image || "/Images/best-1.svg";

  const displayNotes = notes || description || "";
  //   const brandName = brand_id?.brandName || "";

  const handleWishlistToggle = (event) => {
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
    <div className="group flex flex-col bg-[#fdf9f5] rounded-none overflow-hidden">
      {/* Image */}
      <Link href={`/product/${productId}`} className="block relative">
        <div className="relative w-full h-85 overflow-hidden rounded-tl-[48px] rounded-br-[48px] rounded-tr-none rounded-bl-none bg-[#e8e0d8]">
          <Image
            src={imageUrl}
            alt={name}
            fill
            unoptimized
            className="object-cover transition-transform duration-500"
            onError={(e) => {
              e.target.src = "/Images/best-1.svg";
            }}
          />
        </div>
        <button
          type="button"
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/95 text-primary flex items-center justify-center shadow-md transition-opacity duration-200 opacity-0 group-hover:opacity-100 hover:scale-105 disabled:cursor-not-allowed"
          onClick={handleWishlistToggle}
          disabled={isTogglingFavorite}
          aria-label="Toggle wishlist"
        >
          <Heart
            size={18}
            fill={isWishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
          />
        </button>
      </Link>

      {/* Info */}
      <div className="pt-3 pb-1 px-1">
        {/* Name */}
        <Link href={`/product/${productId}`}>
          <h3
            className="text-[#7E525C] text-xl font-normal leading-snug transition-colors font-noto"
          >
            {name}
          </h3>
        </Link>

        {/* Notes / Description */}
        {displayNotes && (
          <p
            className="text-[#9e8a8a] text-[11px] uppercase tracking-wider mt-0.5">
            {displayNotes}
          </p>
        )}

        {/* Price + Order */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span
              className="text-[#1c1c19] text-sm font-semibold"
            >
              Rs. {price?.toLocaleString()}
            </span>
            {discountPercentage > 0 && (
              <span className="text-[11px] text-green-600 font-medium">
                -{discountPercentage}%
              </span>
            )}
          </div>
          <Link
            href={`/product/${productId}`}
            className="text-[#7e525c] text-[11px] font-semibold uppercase tracking-widest hover:text-[#1c1c19] transition-colors"
            style={{
              letterSpacing: "0.12em",
            }}
          >
            ORDER NOW
          </Link>
        </div>
      </div>
    </div>
  );
}
