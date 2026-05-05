"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Heart, Star, Minus, Plus , Package } from "lucide-react";
import { successToaster, errorToaster } from "@/utils/alert-service";
import {
  useFavorites,
  useProduct,
  useProducts,
  useToggleFavorite,
  useAddToCart,
  useAddRatingReview,
  useCheckReviewStatus,
  useGetAllReviews,
  queryClient,
} from "@/lib/api";
import ProductCard from "@/Components/ProductCard";
import { buildProductImageUrl } from "@/lib/utils/imageUrl";
import Loader from "@/Components/Loader/Loader";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const productId = Array.isArray(params?.id) ? params.id[0] : (params?.id || "");
  
  const { data: productResponse, isLoading, isError } = useProduct(productId);
  const product = productResponse?.data || productResponse;

  const { mutate: addToCartApi, isPending: isAddingToCart } = useAddToCart();
  const { mutate: submitReview, isPending: isSubmittingReview } = useAddRatingReview();
  const { data: wishlistProducts = [] } = useFavorites();
  const { mutate: toggleFavorite, isPending: isTogglingFavorite } = useToggleFavorite();
  const { data: productsResponse = [], isLoading: recLoading } = useProducts();
  const allProducts = Array.isArray(productsResponse) ? productsResponse : (productsResponse?.data || []);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeTab, setActiveTab] = useState("reviews");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [reviewRating, setReviewRating] = useState(4);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const { data: reviewData } = useCheckReviewStatus(productId);
  const { data: allReviewsRes } = useGetAllReviews();
  
  const productReviews = useMemo(() => {
    const raw = Array.isArray(allReviewsRes) ? allReviewsRes : (allReviewsRes?.data ?? []);
    return raw.filter(rev => rev.productName === product?.name);
  }, [allReviewsRes, product?.name]);

  const hasAlreadyReviewed = reviewData?.hasReviewed;


  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedSize(product.variants[0].size);
    }
  }, [product]);

  const isWishlisted = useMemo(
    () =>
      Array.isArray(wishlistProducts) &&
      wishlistProducts.some((item) => {
        const wishId = item?._id || item?.id;
        return String(wishId) === String(productId);
      }),
    [wishlistProducts, productId],
  );

  if (isLoading) return <Loader fullScreen={true} size="xl" />;
  if (isError || !product) return <div className="py-32 text-center text-red-500 font-sans">Fragrance not found.</div>;

  const selectedVariant = product.variants?.find((v) => v.size === selectedSize) || product.variants?.[0];
  const displayPrice = selectedVariant?.price || 0;
  const displayDiscount = selectedVariant?.discountPercentage || 0;

  const images = Array.isArray(product.image_id) ? product.image_id.slice(0, 3) : [];
  const mainImageUrl = images[activeImageIndex]?.url || images[activeImageIndex]?.path ? buildProductImageUrl(images[activeImageIndex].path) : "/Images/best-1.svg";

  const handleWishlistToggle = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
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

  const handleAddToCart = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      window.location.href = "/auth/login";
      return;
    }
    
    addToCartApi({
      productId: product._id || productId,
      quantity,
      size: selectedSize,
    }, {
      onSuccess: () => {
        successToaster("Fragrance added to your bag successfully!");
      },
      onError: (err) => {
        const errMsg = err?.response?.data?.message || "Failed to add to bag. Please try again.";
        errorToaster(errMsg);
        console.error("Add to cart error:", err);
      }
    });
  };

  const renderStars = (rating) => (
    <div className="flex gap-1">
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

  return (
    <div className="pt-4 pb-10 sm:pt-10 sm:pb-16 flex flex-col gap-10 font-sans bg-[#faf8f5]">
      <main className="max-w-7xl mx-auto px-4 w-full">
        <section className="grid grid-cols-1 md:grid-cols-[1fr_1.8fr] gap-8 items-start">
          <div className="flex flex-col gap-6">
            <div className="relative w-full h-[320px] md:h-[380px] bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e8dde0]">
              <Image
                src={mainImageUrl}
                alt={product.name}
                fill
                className="object-contain p-4"
                priority
                unoptimized
              />
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {images.map((img, index) => (
                <div 
                  key={img._id || index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative h-[80px] md:h-[100px] bg-white rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${activeImageIndex === index ? "border-[#7e525c] shadow-md" : "border-transparent hover:border-[#b0909a]"}`}
                >
                  <Image
                    src={img.url || buildProductImageUrl(img.path)}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl md:text-4xl text-[#5a3a42] font-serif capitalize">{product.name}</h1>
              <div className="flex items-center gap-3">
                {renderStars(product.rating || 4.5)}
                <span className="text-[#b0909a] text-xs font-medium tracking-wider uppercase">Verified Collection</span>
              </div>
            </div>

            <p className="text-muted text-base leading-relaxed opacity-90">{product.description}</p>

            <div className="flex items-baseline gap-3">
              {displayDiscount > 0 ? (
                <>
                  <span className="text-3xl font-bold text-[#1c1c19]">Rs. {(displayPrice * (1 - displayDiscount / 100)).toLocaleString()}</span>
                  <span className="text-[#a08a8a] text-lg line-through">Rs. {displayPrice.toLocaleString()}</span>
                  <span className="text-[#7e525c] text-[10px] font-bold uppercase tracking-widest bg-[#e8dde0] px-2 py-0.5 rounded">-{displayDiscount}%</span>
                </>
              ) : (
                <span className="text-3xl font-bold text-[#1c1c19]">Rs. {displayPrice.toLocaleString()}</span>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold tracking-widest text-[#b0909a] uppercase">Choose Size</span>
              <div className="flex flex-wrap gap-2">
                {product.variants?.map((v) => (
                  <button
                    key={v.size}
                    onClick={() => setSelectedSize(v.size)}
                    className={`px-5 py-2.5 rounded-full border-2 transition-all text-sm font-medium ${selectedSize === v.size ? "bg-[#7e525c] border-[#7e525c] text-white shadow-md" : "border-[#e8dde0] text-[#7e525c] hover:border-[#7e525c]"}`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold tracking-widest text-[#b0909a] uppercase">Quantity</span>
              <div className="flex items-center gap-6">
                <div className="flex items-center border-2 border-[#e8dde0] rounded-full px-3 py-1.5 bg-white scale-90 origin-left">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 hover:text-[#7e525c] transition-colors"><Minus size={16} /></button>
                  <span className="w-10 text-center font-bold text-base">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-1 hover:text-[#7e525c] transition-colors"><Plus size={16} /></button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full sm:w-[240px] bg-[#6a4450] text-white py-4 rounded-full text-xs font-bold tracking-widest hover:bg-[#4d313a] transition-all shadow-lg disabled:opacity-50"
              >
                {isAddingToCart ? "ADDING TO BAG..." : "ORDER NOW (COD)"}
              </button>
              <button
                onClick={handleWishlistToggle}
                disabled={isTogglingFavorite}
                className={`w-full sm:w-[200px] py-4 rounded-full border-2 transition-all flex items-center justify-center gap-2 ${isWishlisted ? "bg-[#7e525c] border-[#7e525c] text-white" : "border-[#e8dde0] text-[#7e525c] hover:bg-[#fdf9f5]"}`}
              >
                <Heart size={18} fill={isWishlisted ? "white" : "none"} />
                <span className="text-[10px] font-bold tracking-widest uppercase">{isWishlisted ? "WISHLISTED" : "ADD TO WISHLIST"}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-[#e8dde0] pt-8">
              {[
                { icon: "/Icons/product-details-truck-icon.svg", text: "Quick Dispatch" },
                { icon: "/Icons/product-details-cash-icon.svg", text: "Cash on Delivery" },
                { icon: "/Icons/product-details-time-icon.svg", text: "7-Day Return" },
                { icon: "/Icons/product-details-authentic-icon.svg", text: "100% Authentic" }
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-lg border border-[#e8dde0]"><Image src={badge.icon} alt="" width={20} height={20} /></div>
                  <span className="text-xs font-bold text-[#7e525c] uppercase tracking-wider">{badge.text}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 bg-[#fdf9f5] border border-[#e8dde0] p-3 rounded-2xl w-fit">
              <Package className="text-[#7e525c]" size={18} />
              <span className="text-[11px] font-medium text-[#7e525c]">Delivery estimate: 3-5 Working Days</span>
            </div>
          </div>
        </section>

        <section className="mt-14 border-t border-[#e8dde0] pt-10">
          <div className="flex gap-8 border-b border-[#e8dde0] mb-8 overflow-x-auto no-scrollbar">
            {["reviews", "usage", "returns"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  if (tab === 'reviews') {
                    // Scroll to tabs section if needed, or just let them see it
                  }
                }}
                className={`pb-4 text-sm font-bold tracking-[0.2em] uppercase transition-all whitespace-nowrap ${activeTab === tab ? "text-[#7e525c] border-b-2 border-[#7e525c]" : "text-[#b0909a] hover:text-[#7e525c]"}`}
              >
                {tab} {tab === 'reviews' && `(${productReviews.length})`}
              </button>
            ))}
          </div>
          <div className="max-w-4xl leading-relaxed text-[#7e525c]">
            {activeTab === "reviews" && (
              <div className="flex flex-col gap-14">
                {/* Review Form Component - Centered */}
                <div className="flex justify-center w-full">
                  <div className="bg-white border border-[#e8dde0] rounded-3xl p-6 shadow-sm w-full max-w-lg">
                    <h4 className="text-xl font-serif mb-4 text-center">Share Your Experience</h4>
                    {hasAlreadyReviewed ? (
                      <div className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-xl border border-green-100">
                        <Star fill="currentColor" size={20} />
                        <span className="text-sm font-medium">Thank you! You have already shared your feedback for this fragrance.</span>
                      </div>
                    ) : (
                      <form
                        className="flex flex-col gap-4"
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
                                queryClient.invalidateQueries({ queryKey: ["all-reviews"] });
                                successToaster("Thank you! Your review has been submitted successfully.");
                                setReviewText("");
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
                        <div className="flex justify-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`cursor-pointer transition-all ${
                                (reviewHover || reviewRating) >= star
                                  ? "text-[#FFD700] fill-[#FFD700]"
                                  : "text-gray-200"
                              }`}
                              size={24}
                              onMouseEnter={() => setReviewHover(star)}
                              onMouseLeave={() => setReviewHover(0)}
                              onClick={() => setReviewRating(star)}
                            />
                          ))}
                        </div>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="Write your olfactory journey..."
                          rows={3}
                          required
                          className="w-full border border-[#e8dde0] rounded-2xl px-4 py-3 bg-[#fafafa] focus:outline-none focus:border-[#7e525c] text-sm transition-all"
                        />
                        {reviewError && <p className="text-red-500 text-xs text-center">{reviewError}</p>}
                        <button type="submit" disabled={isSubmittingReview || !reviewText.trim()} className="bg-[#6a4450] text-white py-3 rounded-full text-xs font-bold tracking-widest hover:bg-[#4d313a] transition-all disabled:opacity-50">
                          {isSubmittingReview ? "SUBMITTING..." : "POST REVIEW"}
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                {/* Reviews Slider */}
                <div className="flex flex-col gap-6">
                  <h4 className="text-xl font-serif text-center">Community Feedback</h4>
                  {productReviews.length === 0 ? (
                    <p className="text-[#b0909a] italic text-center">No reviews yet for this masterpiece. Be the first to share your experience.</p>
                  ) : (
                    <div className="w-full px-4">
                      <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={20}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        breakpoints={{
                          640: { slidesPerView: 2 },
                          1024: { slidesPerView: 3 },
                        }}
                        className="pb-12"
                      >
                        {productReviews.map((rev, i) => (
                          <SwiperSlide key={i}>
                            <div className="bg-white p-6 rounded-2xl border border-[#e8dde0]/60 shadow-sm flex flex-col gap-3 h-full">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-bold text-sm text-[#5a3a42]">{rev.userName}</p>
                                  <div className="flex gap-0.5 mt-1">
                                    {[...Array(5)].map((_, si) => (
                                      <Star key={si} size={12} fill={si < rev.rating ? "#FFD700" : "none"} stroke={si < rev.rating ? "#FFD700" : "#D1D5DB"} />
                                    ))}
                                  </div>
                                </div>
                                <span className="text-[10px] text-[#b0909a]">{new Date(rev.submittedAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-sm text-[#7e525c] opacity-80 leading-relaxed italic">"{rev.reviewText}"</p>
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === "usage" && <div><h3 className="text-2xl font-serif mb-4">Usage & Care</h3><ul className="list-disc pl-5 flex flex-col gap-2"><li>External use only, avoid direct eye contact.</li><li>Keep away from children and direct heat.</li><li>If irritation occurs, discontinue use immediately.</li></ul></div>}
            {activeTab === "returns" && <div><h3 className="text-2xl font-serif mb-4">Returns & Refunds Policy</h3><p>We offer a 7-day return policy. If you're not completely satisfied, items can be returned within 7 days for a full refund or exchange.</p></div>}
          </div>
        </section>
      </main>


      <section className="max-w-7xl mx-auto px-4 w-full py-10">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl md:text-4xl text-[#7e525c] font-serif">You May Also Like</h2>
          <Link href="/collections" className="text-[#7e525c] font-bold text-sm border-b-2 border-[#7e525c] pb-1">VIEW ALL</Link>
        </div>

        {recLoading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {allProducts.filter(p => p._id !== productId).slice(0, 4).map(rec => <ProductCard key={rec._id} product={rec} />)}
          </div>
        )}
      </section>
    </div>
  );
}
