"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Heart, Star, Minus, Plus , Package } from "lucide-react";
import { successToaster } from "@/utils/alert-service";
import {
  useFavorites,
  useProduct,
  useProducts,
  useToggleFavorite,
  useAddToCart,
  useAddRatingReview,
  useCheckReviewStatus,
  queryClient,
} from "@/lib/api";
import ProductCard from "@/Components/ProductCard";
import { buildProductImageUrl } from "@/lib/utils/imageUrl";

export default function ProductDetails() {
  const { mutate: addToCartApi, isPending: isAddingToCart } = useAddToCart();
  const { mutate: submitReview, isPending: isSubmittingReview } =
    useAddRatingReview();
  const params = useParams();
  const router = useRouter();
  const productId = Array.isArray(params?.id) ? params.id[0] : (params?.id || "");
  const { data: product, isLoading, isError } = useProduct(productId);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("50ml");
  const [activeTab, setActiveTab] = useState("description");
  const [reviewRating, setReviewRating] = useState(4);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const { data: reviewData } = useCheckReviewStatus(productId);
  const hasAlreadyReviewed = reviewData?.hasReviewed;

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

  const handleWishlistToggle = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      window.location.href = "/auth/login";
      return;
    }
    toggleFavorite(productId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["favorites"] });
      },
    });
  };

  const { data: allProducts = [], isLoading: recLoading } = useProducts();

  if (isLoading) {
    return <div className="py-32 text-center text-lg">Loading product...</div>;
  }
  if (isError || !product) {
    return (
      <div className="py-32 text-center text-red-500">Product not found.</div>
    );
  }

  // Find the selected variant (if any)
  const selectedVariant = product.variants?.find(
    (v) => v.size === selectedSize,
  );
  // Use variant price if available, else fallback to product.price
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const displayDiscount = selectedVariant
    ? selectedVariant.discountPercentage
    : product.discountPercentage;

  // Robust image URL logic
  let imageUrl = "/Images/best-1.svg";
  if (product?.image_id?.path) {
    imageUrl = buildProductImageUrl(product.image_id.path);
  } else if (product?.image) {
    imageUrl = product.image;
  }

  const handleAddToCart = () => {
    // Check login/session by checking token in localStorage
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      window.location.href = "/auth/login";
      return;
    }
    // Call /api/cart/add
    addToCartApi({
      productId: product._id,
      quantity,
      size: selectedSize,
    });
  };
console.log(product,"pro");

  const renderStars = (rating) => {
    return (
      <div className="stars-container">
        {[...Array(5)].map((_, i) => (
         <Star
            key={i}
            size={18}
            fill={i < Math.floor(rating) ? "#FFD700" : "none"}
            stroke={i < Math.floor(rating) ? "#FFD700" : "#D1D5DB"}
            className="shrink-0"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="pt-4 pb-10 sm:pt-10 sm:pb-16 flex flex-col gap-10">
      <main className="product-details-main">
        <section className="product-details-section">
          <div className="product-details-container">
            {/* Product Images */}
           {/* Product Images Section */}

<div className="flex flex-col gap-4 items-end">
  {/* Main Large Image */}
  <div 
  className="relative aspect-square w-[90%] bg-[#faf8f5] rounded-xl! overflow-hidden ">
  <Image
  src={imageUrl}
  alt={product.name}
  fill
  className="object-contain p-4 rounded-lg! detail-img"
  priority
/>
  </div>

  {/* Thumbnails Row */}
  <div className="flex flex-row justify-center gap-3 relative w-[90%] rounded-lg!">
  {[1, 2].map((_, index) => (
  <div 
    key={index} 
    className="relative aspect-square bg-[#faf8f5] !rounded-xl overflow-hidden transition-colors h-[30%] w-[30%]"
  >
    <Image
      src={imageUrl}
      alt={`${product.name} thumb ${index}`}
      fill
      className="object-contain p-2 detail-img"
    />
  </div>
))}
  
  
</div>
</div>

            {/* Product Details */}
            <div className="product-info mt-10">
              <h1 className="product-title capitalize">{product.name}</h1>

              <p className="product-notes-detail capitalize!">{product.description}</p>

              <div className="rating-section">
                {renderStars(product.rating || 4)}
                {/* <span className="review-text">(104 reviews)</span> */}
              </div>

              {/* <p className="product-description">{product.description}</p> */}

              <div className="price-section">
                {displayDiscount > 0 ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[#a08a8a] text-lg font-medium line-through whitespace-nowrap">
                        Rs. {displayPrice?.toLocaleString()}
                      </span>
                      <span className="product-discount whitespace-nowrap">
                        -{displayDiscount}%
                      </span>
                    </div>
                    <span className="price whitespace-nowrap">
                      Rs. {(displayPrice - (displayPrice * displayDiscount) / 100).toLocaleString()}
                    </span>
                  </div>
                ) : (
                  <span className="price whitespace-nowrap">
                    Rs. {displayPrice?.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Size Selection (static for now) */}
              <div className="size-selection">
                <label>CHOOSE SIZE</label>
                <div className="size-options">
                  <button
                    className={`size-btn ${selectedSize === "50ml" ? "active" : ""}`}
                    onClick={() => setSelectedSize("50ml")}
                  >
                    50ml
                  </button>
                  <button
                    className={`size-btn ${selectedSize === "100ml" ? "active" : ""}`}
                    onClick={() => setSelectedSize("100ml")}
                  >
                    100ml
                  </button>
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="quantity-section">
                <label>QUANTITY</label>
                <div className="quantity-control">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
             
                <button
                  className="order-btn"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? "Adding..." : "Order Now (COD)"}
                </button>
                <button
                  className={`wishlist-btn ${isWishlisted ? "active" : ""} fit`}
                  onClick={handleWishlistToggle}
                  disabled={isTogglingFavorite}
                >
                  <Heart
                    size={20}
                    fill={isWishlisted ? "currentColor" : "none"}
                  />
                  {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                </button>
              </div>

              {/* Info Badges (static for now) */}
              <div className="info-badges p-0! gap-0!">
                <div className="badge  bg-[#FDF9F5]!">
                  <span className="badge-icon">
                    <Image
                      src="/Icons/product-details-truck-icon.svg"
                      alt="Delivery"
                      width={20}
                      height={20}
                    />
                  </span>
                  <div className="badge-content">
                    <p>Quick Dispatch</p>
                  </div>
                </div>
                <div className="badge  bg-[#FDF9F5]!">
                  <span className="badge-icon">
                    <Image
                      src="/Icons/product-details-cash-icon.svg"
                      alt="Payment"
                      width={20}
                      height={20}
                    />
                  </span>
                  <div className="badge-content">
                    <p>CASH ON DELIVERY</p>
                  </div>
                </div>
                <div className="badge  bg-[#FDF9F5]!">
                  <span className="badge-icon">
                    <Image
                      src="/Icons/product-details-time-icon.svg"
                      alt="Returns"
                      width={20}
                      height={20}
                    />
                  </span>
                  <div className="badge-content">
                    <p>7-DAY RETURN</p>
                  </div>
                </div>
                <div className="badge bg-[#FDF9F5]!">
                  <span className="badge-icon">
                    <Image
                      src="/Icons/product-details-authentic-icon.svg"
                      alt="Authentic"
                      width={20}
                      height={20}
                    />
                  </span>
                  <div className="badge-content">
                    <p>100% AUTHENTIC</p>
                  </div>
                </div>
              </div>

              <p className="delivery-estimate badge rounded-full! w-fit px-4!">
                <Package /> Delivery estimate: 3-5 Working Days
              </p>
            </div>
          </div>
        </section>
        {/* Tabs Section (static for now) */}
        <section className="tabs-section">
          <div className="tabs-container">
            <div className="tabs-header">
              <button
                className={`tab ${activeTab === "description" ? "active" : ""}`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`tab ${activeTab === "usage" ? "active" : ""}`}
                onClick={() => setActiveTab("usage")}
              >
                Product Usage
              </button>
              <button
                className={`tab ${activeTab === "returns" ? "active" : ""}`}
                onClick={() => setActiveTab("returns")}
              >
                Returns & Refunds
              </button>
            </div>
            <div className="tab-content">
              {activeTab === "description" && (
                <div className="description-content">
                  <h3>The Scent Narrative</h3>
                  <p>{product.description}</p>
                </div>
              )}
              {activeTab === "usage" && (
                <div className="usage-content">
                  <h3>USAGE & CARE</h3>
                  <ul className="usage-list">
                    <li>External use only, avoid direct eye contact.</li>
                    <li>Keep away from children and direct heat.</li>
                    <li>If irritation occurs, discontinue use immediately.</li>
                  </ul>
                  <p className="usage-note">
                    Note: Right aerosols in scent or packaging may occur due to
                    production.
                  </p>
                </div>
              )}
              {activeTab === "returns" && (
                <div className="returns-content">
                  <h3>Returns & Refunds Policy</h3>
                  <p>
                    We offer a 7-day return policy on all products. If
                    you&apos;re not completely satisfied, you can return items
                    within 7 days of purchase for a full refund.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

    {/* Customer Reviews & Feedback */}
<section className="w-full bg-[#faf8f5]  px-4 flex flex-col items-center justify-center">
  {/* Header Container */}
  <div className="text-center mb-4 max-w-md">
    <h2
      className="text-[#7e525c] font-normal leading-tight text-[22px] sm:text-[26px] md:text-[28px] mb-2"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      Customer Reviews &amp; Feedback
    </h2>
    <p className="text-[#b0909a] text-[12px] font-sans tracking-wide">
      Share your experience with {product.name}
    </p>
  </div>

  {/* Form Container - Even more compact */}
  <div className="bg-white/80 backdrop-blur-sm border border-[#e8dde0] rounded-3xl p-4 sm:p-5 shadow-sm w-full max-w-md mx-auto transition-all hover:shadow-md">
    {hasAlreadyReviewed ? (
      <div className="text-center py-3 flex flex-col items-center">
        <div className="bg-[#fff9f0] w-10 h-10 rounded-full flex items-center justify-center mb-2">
          <Star className="text-[#FFD700]" fill="#FFD700" size={20} />
        </div>
        <h3
          className="text-[#7e525c] text-base font-semibold mb-0.5"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Feedback Received
        </h3>
        <p className="text-[#b0909a] text-[10px] leading-relaxed max-w-[180px]">
          Thank you for sharing your experience.
        </p>
      </div>
    ) : reviewSuccess ? (
      <div className="text-center py-4">
        <div className="bg-green-50 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
          <Star className="text-green-500" fill="currentColor" size={20} />
        </div>
        <p
          className="text-[#7e525c] text-base font-semibold mb-0.5"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Message Received
        </p>
        <p className="text-[#b0909a] text-[10px]">
          Redirecting back to collection...
        </p>
      </div>
    ) : (
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          setReviewError("");
          submitReview(
            {
              productId: product._id,
              rating: reviewRating,
              review: reviewText,
            },
            {
              onSuccess: () => {
                setReviewSuccess(true);
                queryClient.invalidateQueries({ queryKey: ["review-status", productId] });
                successToaster("Thank you! Your review has been submitted successfully.");
                setTimeout(() => {
                  router.back();
                }, 2000);
              },
              onError: (err) => {
                setReviewError(
                  err?.response?.data?.message ??
                    err?.response?.data?.error ??
                    "Failed to submit review. Please try again."
                );
              },
            }
          );
        }}
      >
        <div className="flex flex-col items-center gap-0.5">
          <h4 className="text-[#7e525c] text-[10px] font-semibold uppercase tracking-wider mb-1">Share Your Experience</h4>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`cursor-pointer transition-all hover:scale-110 ${
                  (reviewHover || reviewRating) >= star
                    ? "text-[#FFD700] fill-[#FFD700]"
                    : "text-gray-300"
                }`}
                size={20}
                onMouseEnter={() => setReviewHover(star)}
                onMouseLeave={() => setReviewHover(0)}
                onClick={() => setReviewRating(star)}
              />
            ))}
          </div>
        </div>

        <div className="relative">
          <textarea
            placeholder="Describe your scent journey..."
            className="w-full bg-[#fdf9f5] border border-[#e8dde0] rounded-xl p-2.5 text-[11px] text-[#4e4543] focus:outline-none focus:ring-1 focus:ring-[#7e525c] transition-all min-h-[70px] resize-none"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
        {reviewError && (
          <p className="text-red-500 text-[10px] text-center font-medium mt-1">{reviewError}</p>
        )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmittingReview || !reviewText.trim()}
            className="w-full bg-[#7e525c] text-white py-2 rounded-full text-[10px] font-bold tracking-[2px] uppercase hover:bg-[#6a4450] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
          >
            {isSubmittingReview ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
    )}
  </div>
</section>

      {/* You May Also Like */}
   <section className="w-full bg-[#faf8f5] pb-16 overflow-x-hidden">
  
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    {/* HEADER */}
    <div className="flex justify-between items-center mb-8 sm:mb-10 gap-4">
      
      <h2
        className="text-[#7e525c] font-normal leading-tight
                   text-[24px] sm:text-[30px] md:text-[38px]"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        You May Also Like
      </h2>

      <Link
        href="/collections"
        className="text-[#7e525c] text-[13px] sm:text-[15px]
                   font-semibold flex items-center gap-1 whitespace-nowrap"
      >
        View Collection <span className="text-[16px] sm:text-[18px]">→</span>
      </Link>

    </div>

    {/* CONTENT */}
    {recLoading ? (
      <div className="flex justify-center py-10">
        <div className="w-8 h-8 border-4 border-[#7e525c] border-t-transparent rounded-full animate-spin" />
      </div>
    ) : allProducts.length > 0 ? (
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {allProducts
          .filter((p) => p._id !== productId)
          .slice(0, 4)
          .map((rec) => (
            <ProductCard key={rec._id} product={rec} />
          ))}
      </div>

    ) : (
      <div className="text-center py-10 text-[#7e525c]">
        No recommendations found.
      </div>
    )}

  </div>

</section>
    </div>
  );
}
