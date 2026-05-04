"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { queryClient, useFavorites, useToggleFavorite } from "@/lib/api";
import { buildProductImageUrl } from "@/lib/utils/imageUrl";
import { useRouter } from "next/navigation";

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
    category_id,
    category,
    image_id,
    tag_id,
  } = product;

  // Use 100ml variant price if available, otherwise first variant, otherwise base price
  const variant100ml = product.variants?.find(v => v.size === "100ml");
  const fallbackVariant = product.variants?.[0];
  const displayPrice = variant100ml ? variant100ml.price : (fallbackVariant ? fallbackVariant.price : price);
  const displayDiscount = variant100ml ? variant100ml.discountPercentage : (fallbackVariant ? fallbackVariant.discountPercentage : discountPercentage);

  const productId = _id || id;
  const { data: wishlistProducts = [] } = useFavorites();
  const { mutate: toggleFavorite, isPending: isTogglingFavorite } =
    useToggleFavorite();
  const router = useRouter();
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
  const firstImage = Array.isArray(image_id) ? image_id[0] : image_id;
  const imageUrl = firstImage?.path
    ? buildProductImageUrl(firstImage.path)
    : image || "/Images/best-1.svg";

  const displayNotes = notes || description || "";
  const displayCategory =
    category_id?.name || category?.name || category || tag_id?.name || "Unisex";
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
      <div className="relative">
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
        </Link>
        <button
          type="button"
          className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/95 text-primary flex items-center justify-center shadow-md transition-opacity duration-200 opacity-0 group-hover:opacity-100 hover:scale-105 disabled:cursor-not-allowed"
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
      </div>

        {/* Info */}
        <div className="pt-3 pb-1 px-1 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-secondary text-[12px] tracking-wider capitalize">
            <p>{tag_id?.name}</p>
            <div className="w-px h-3.5 bg-secondary"></div>
            <p>{displayCategory}</p>
          </div>
          <Link href={`/product/${productId}`}>
            <h3 className="text-[#7E525C] text-xl font-normal leading-snug transition-colors font-noto">
              {name}
            </h3>
          </Link>

          {/* Notes / Description */}
          {displayNotes && (
            <p className="text-secondary text-sm tracking-wider">
              {displayNotes}
            </p>
          )}

          {/* Price + Order */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col gap-0.5">
              {displayDiscount > 0 ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-[#a08a8a] text-[12px] font-medium line-through whitespace-nowrap">
                      Rs. {displayPrice?.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-green-600 font-medium whitespace-nowrap">
                      -{displayDiscount}%
                    </span>
                  </div>
                  <span className="text-[#1c1c19] text-sm font-semibold whitespace-nowrap">
                    Rs. {(displayPrice - (displayPrice * displayDiscount) / 100).toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-[#1c1c19] text-sm font-semibold whitespace-nowrap">
                  Rs. {displayPrice?.toLocaleString()}
                </span>
              )}
            </div>

            <button onClick={()=> router.push(`/product/${productId}`)} className="cursor-pointer bg-[#7E525C] text-white px-4 py-2 rounded-full text-xs font-semibold 
              uppercase tracking-widest hover:bg-secondary transition-colors text-center shadow-sm"
              style={{ letterSpacing: "0.12em" }}>
              ORDER NOW
            </button>
          </div>
        </div>
    </div>
  );
}
