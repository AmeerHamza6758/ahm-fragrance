"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Heart, Star, Minus, Plus, Package } from "lucide-react";
import {
  useFavorites,
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
  const params = useParams();
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
  const [activeTab, setActiveTab] = useState("description");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [reviewRating, setReviewRating] = useState(4);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState("");

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

  if (isLoading) return <div className="py-32 text-center text-lg font-sans">Loading fragrance details...</div>;
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
      productId: product._id,
      quantity,
      size: selectedSize,
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
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          <div className="flex flex-col gap-6">
            <div className="relative aspect-square w-full bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e8dde0]">
              <Image
                src={mainImageUrl}
                alt={product.name}
                fill
                className="object-contain p-8"
                priority
                unoptimized
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, index) => (
                <div 
                  key={img._id || index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative aspect-square bg-white rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${activeImageIndex === index ? "border-[#7e525c] shadow-md" : "border-transparent hover:border-[#b0909a]"}`}
                >
                  <Image
                    src={img.url || buildProductImageUrl(img.path)}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    className="object-contain p-3"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl md:text-5xl text-[#5a3a42] font-serif capitalize">{product.name}</h1>
              <div className="flex items-center gap-4">
                {renderStars(product.rating || 4.5)}
                <span className="text-[#b0909a] text-sm">(Verified Feedback)</span>
              </div>
            </div>

            <p className="text-[#7e525c] text-lg leading-relaxed">{product.description}</p>

            <div className="flex flex-col gap-1">
              {displayDiscount > 0 ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-[#a08a8a] text-xl line-through">Rs. {displayPrice.toLocaleString()}</span>
                    <span className="bg-[#e8dde0] text-[#7e525c] text-xs font-bold px-2 py-1 rounded">-{displayDiscount}% OFF</span>
                  </div>
                  <span className="text-4xl font-bold text-[#1c1c19]">Rs. {(displayPrice * (1 - displayDiscount / 100)).toLocaleString()}</span>
                </>
              ) : (
                <span className="text-4xl font-bold text-[#1c1c19]">Rs. {displayPrice.toLocaleString()}</span>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold tracking-widest text-[#b0909a] uppercase">Choose Size</span>
              <div className="flex flex-wrap gap-3">
                {product.variants?.map((v) => (
                  <button
                    key={v.size}
                    onClick={() => setSelectedSize(v.size)}
                    className={`px-6 py-3 rounded-full border-2 transition-all font-medium ${selectedSize === v.size ? "bg-[#7e525c] border-[#7e525c] text-white shadow-lg" : "border-[#e8dde0] text-[#7e525c] hover:border-[#7e525c]"}`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold tracking-widest text-[#b0909a] uppercase">Quantity</span>
              <div className="flex items-center gap-6">
                <div className="flex items-center border-2 border-[#e8dde0] rounded-full px-4 py-2 bg-white">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 hover:text-[#7e525c] transition-colors"><Minus size={18} /></button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-1 hover:text-[#7e525c] transition-colors"><Plus size={18} /></button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="flex-1 bg-[#6a4450] text-white py-5 rounded-full font-bold tracking-widest hover:bg-[#4d313a] transition-all shadow-xl disabled:opacity-50"
              >
                {isAddingToCart ? "ADDING TO BAG..." : "ORDER NOW (COD)"}
              </button>
              <button
                onClick={handleWishlistToggle}
                disabled={isTogglingFavorite}
                className={`px-8 py-5 rounded-full border-2 transition-all flex items-center justify-center gap-2 ${isWishlisted ? "bg-[#7e525c] border-[#7e525c] text-white" : "border-[#e8dde0] text-[#7e525c] hover:bg-[#fdf9f5]"}`}
              >
                <Heart size={20} fill={isWishlisted ? "white" : "none"} />
                <span className="hidden sm:inline font-bold">{isWishlisted ? "WISHLISTED" : "ADD TO WISHLIST"}</span>
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

            <div className="flex items-center gap-3 bg-[#fdf9f5] border border-[#e8dde0] p-4 rounded-2xl w-fit">
              <Package className="text-[#7e525c]" size={20} />
              <span className="text-sm font-medium text-[#7e525c]">Delivery estimate: 3-5 Working Days</span>
            </div>
          </div>
        </section>

        <section className="mt-20 border-t border-[#e8dde0] pt-12">
          <div className="flex gap-8 border-b border-[#e8dde0] mb-8 overflow-x-auto no-scrollbar">
            {["description", "usage", "returns"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-bold tracking-widest uppercase transition-all whitespace-nowrap ${activeTab === tab ? "text-[#7e525c] border-b-2 border-[#7e525c]" : "text-[#b0909a] hover:text-[#7e525c]"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="max-w-3xl leading-relaxed text-[#7e525c]">
            {activeTab === "description" && <div><h3 className="text-2xl font-serif mb-4">The Scent Narrative</h3><p>{product.description}</p></div>}
            {activeTab === "usage" && <div><h3 className="text-2xl font-serif mb-4">Usage & Care</h3><ul className="list-disc pl-5 flex flex-col gap-2"><li>External use only, avoid direct eye contact.</li><li>Keep away from children and direct heat.</li><li>If irritation occurs, discontinue use immediately.</li></ul></div>}
            {activeTab === "returns" && <div><h3 className="text-2xl font-serif mb-4">Returns & Refunds Policy</h3><p>We offer a 7-day return policy. If you're not completely satisfied, items can be returned within 7 days for a full refund or exchange.</p></div>}
          </div>
        </section>
      </main>

      <section className="bg-white py-20 border-y border-[#e8dde0]">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl text-[#7e525c] font-serif mb-2">Customer Feedback</h2>
            <p className="text-[#b0909a]">Share your experience with {product.name}</p>
          </div>

          {reviewSuccess ? (
            <div className="text-center py-12 bg-[#fdf9f5] rounded-3xl border border-[#e8dde0]">
              <p className="text-[#7e525c] text-2xl font-serif mb-4">Thank you for your feedback!</p>
              <button onClick={() => setReviewSuccess(false)} className="text-[#7e525c] font-bold underline">Write another review</button>
            </div>
          ) : (
            <form onSubmit={(e) => {
              e.preventDefault();
              submitReview({ productId: product._id, rating: reviewRating, review: reviewText }, {
                onSuccess: () => setReviewSuccess(true),
                onError: (err) => setReviewError(err?.response?.data?.message || "Failed to submit review.")
              });
            }} className="flex flex-col gap-8 bg-white p-8 rounded-3xl border border-[#e8dde0] shadow-sm">
              <div className="flex flex-col items-center gap-4">
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#b0909a]">Your Rating</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setReviewRating(star)} onMouseEnter={() => setReviewHover(star)} onMouseLeave={() => setReviewHover(0)}>
                      <Star size={32} fill={(reviewHover || reviewRating) >= star ? "#FFD700" : "none"} stroke="#FFD700" strokeWidth={1.5} className="transition-all hover:scale-110" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#b0909a]">Your Review</span>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell us about the longevity, sillage and overall vibe..."
                  rows={4}
                  required
                  className="w-full border border-[#e8dde0] rounded-2xl px-6 py-4 bg-[#fafafa] focus:outline-none focus:border-[#7e525c] transition-all"
                />
              </div>

              {reviewError && <p className="text-red-500 text-sm text-center">{reviewError}</p>}
              
              <button type="submit" disabled={isSubmittingReview || !reviewText.trim()} className="bg-[#6a4450] text-white py-4 rounded-full font-bold tracking-widest hover:bg-[#4d313a] transition-all disabled:opacity-50">
                {isSubmittingReview ? "SUBMITTING..." : "SUBMIT REVIEW"}
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 w-full py-10">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl md:text-4xl text-[#7e525c] font-serif">You May Also Like</h2>
          <Link href="/collections" className="text-[#7e525c] font-bold text-sm border-b-2 border-[#7e525c] pb-1">VIEW ALL</Link>
        </div>

        {recLoading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#7e525c] border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {allProducts.filter(p => p._id !== productId).slice(0, 4).map(rec => <ProductCard key={rec._id} product={rec} />)}
          </div>
        )}
      </section>
    </div>
  );
}
