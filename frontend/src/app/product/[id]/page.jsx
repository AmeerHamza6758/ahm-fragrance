"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Heart, Star, Minus, Plus , Package } from "lucide-react";
import {
  useProduct,
  useProducts,
  useToggleFavorite,
  useAddToCart,
  useAddRatingReview,
  queryClient,
} from "@/lib/api";
import ProductCard from "@/Components/ProductCard";
import { buildProductImageUrl } from "@/lib/utils/imageUrl";

export default function ProductDetails() {
  const { mutate: addToCartApi, isPending: isAddingToCart } = useAddToCart();
  const { mutate: submitReview, isPending: isSubmittingReview } =
    useAddRatingReview();
  const params = useParams();
  const productId = params?.id || "";
  const { data: product, isLoading, isError } = useProduct(productId);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("50ml");
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviewRating, setReviewRating] = useState(4);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const { mutate: toggleFavorite, isPending: isTogglingFavorite } =
    useToggleFavorite();

  const handleWishlistToggle = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      window.location.href = "/auth/login";
      return;
    }
    toggleFavorite(productId, {
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: ["favorites"] });
        setIsWishlisted(res.isFavorited ?? !isWishlisted);
      },
      onError: () => {
        // Optimistically toggle back on failure
        setIsWishlisted((prev) => !prev);
      },
    });
    // Optimistic update
    setIsWishlisted((prev) => !prev);
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

  const renderStars = (rating) => {
    return (
      <div className="stars-container">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < Math.floor(rating) ? "star-filled" : "star-empty"}
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
            <div className="product-images">
              <div className="main-image">
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  className="main-product-image"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="product-info">
              <h1 className="product-title">{product.name}</h1>

              <p className="product-notes-detail">{product.description}</p>

              <div className="rating-section">
                {renderStars(product.rating || 4)}
                {/* <span className="review-text">(104 reviews)</span> */}
              </div>

              <p className="product-description">{product.description}</p>

              <div className="price-section">
                <span className="price">
                  Rs. {displayPrice?.toLocaleString()}
                  {displayDiscount > 0 && (
                    <span className="product-discount">
                      
                      -{displayDiscount}%
                    </span>
                  )}
                </span>
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
              <div className="info-badges">
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
      <section className="w-full bg-[#faf8f5] flex flex-col items-center justify-center">
          <div className="text-center mb-8 w-1/2">
            <h2
              className="text-[1.9rem] text-[#7e525c] font-normal leading-tight mb-2"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Customer Reviews &amp; Feedback
            </h2>
            <p className="text-[#b0909a] text-[13px] font-sans tracking-wide">
              Share your experience with {product.name}
            </p>
          </div>

          <div className="bg-white border border-[#e8dde0] rounded-2xl px-8 py-8 shadow-sm w-1/2 mx-auto">
            {reviewSuccess ? (
              <div className="text-center py-6">
                <p
                  className="text-[#7e525c] text-lg font-semibold"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  Thank you for your feedback!
                </p>
                <p className="text-[#b0909a] text-sm mt-2">
                  Your review has been submitted.
                </p>
                <button
                  className="mt-5 text-[#7e525c] text-sm underline"
                  onClick={() => {
                    setReviewSuccess(false);
                    setReviewText("");
                    setReviewRating(4);
                    setReviewError("");
                  }}
                >
                  Write another review
                </button>
              </div>
            ) : (
              <form
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
                      onSuccess: () => setReviewSuccess(true),
                      onError: (err) => {
                        setReviewError(
                          err?.response?.data?.message ??
                            err?.response?.data?.error ??
                            "Failed to submit review. Please try again.",
                        );
                      },
                    },
                  );
                }}
              >
                {/* Star Rating */}
                <div className="mb-6">
                  <p className="text-[10px] tracking-[0.18em] text-[#b0909a] font-semibold font-sans uppercase mb-3 text-center">
                    Your Rating
                  </p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        onMouseEnter={() => setReviewHover(star)}
                        onMouseLeave={() => setReviewHover(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                      >
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill={
                            (reviewHover || reviewRating) >= star
                              ? "#7e525c"
                              : "none"
                          }
                          stroke="#7e525c"
                          strokeWidth="1.5"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div className="mb-6">
                  <p className="text-[10px] tracking-[0.18em] text-[#b0909a] font-semibold font-sans uppercase mb-3">
                    Write Your Review
                  </p>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Describe the notes, the longevity, and how it made you feel..."
                    rows={4}
                    required
                    className="w-full border border-[#e8dde0] rounded-lg px-4 py-3 text-[14px] text-[#5a3a42] placeholder-[#c4a8b0] bg-white resize-none focus:outline-none focus:border-[#7e525c] transition-colors font-sans"
                  />
                </div>

                {reviewError && (
                  <p className="text-red-500 text-sm mb-4">{reviewError}</p>
                )}

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmittingReview || !reviewText.trim()}
                    className="bg-[#6a4450] text-white text-[14px] font-semibold font-sans tracking-wide px-10 py-3  rounded-full hover:bg-[#6a4450] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmittingReview ? "Submitting..." : "Send Feedback"}
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
