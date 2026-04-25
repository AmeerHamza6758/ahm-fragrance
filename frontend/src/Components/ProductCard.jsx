"use client";

import Image from "next/image";
import Link from "next/link";
import { buildProductImageUrl } from "@/lib/utils/imageUrl";

/**
 * ProductCard Component
 * Reusable product card with image, name, notes, price and order button
 */
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

  // Build image URL from API or use local fallback
  const imageUrl = image_id?.path
    ? buildProductImageUrl(image_id.path)
    : image || "/Images/best-1.svg";

  const displayNotes = notes || description || "";
  //   const brandName = brand_id?.brandName || "";

  return (
    <div className="group flex flex-col bg-[#fdf9f5] rounded-none overflow-hidden">
      {/* Image */}
      <Link href={`/product/${productId}`} className="block">
        <div className="relative w-full h-85 overflow-hidden rounded-tl-[48px] rounded-br-[48px] rounded-tr-none rounded-bl-none bg-[#e8e0d8]">
          <Image
            src={imageUrl}
            alt={name}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = "/Images/best-1.svg";
            }}
          />
        </div>
      </Link>

      {/* Info */}
      <div className="pt-3 pb-1 px-1">
        {/* Name */}
        <Link href={`/product/${productId}`}>
          <h3
            className="text-[#1c1c19] text-base font-normal leading-snug hover:text-[#7e525c] transition-colors"
            style={{
              fontFamily: "Manrope, Arial, sans-serif",
              fontWeight: 500,
            }}
          >
            {name}
          </h3>
        </Link>

        {/* Notes / Description */}
        {displayNotes && (
          <p
            className="text-[#9e8a8a] text-[11px] uppercase tracking-wider mt-0.5"
            style={{
              fontFamily: "Manrope, Arial, sans-serif",
              letterSpacing: "0.08em",
            }}
          >
            {displayNotes}
          </p>
        )}

        {/* Price + Order */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span
              className="text-[#1c1c19] text-sm font-semibold"
              style={{ fontFamily: "Manrope, Arial, sans-serif" }}
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
              fontFamily: "Manrope, Arial, sans-serif",
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
