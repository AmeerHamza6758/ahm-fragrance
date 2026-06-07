"use client";
import React from 'react';
import { useGetAllReviews } from "@/lib/api/hooks/useCart";
import Loader from "@/Components/Loader/Loader";

const STATIC_FALLBACK = [
  { _id: "1", rating: 5, reviewText: "Best purchase of the year. The longevity is better than original designer brands.", userName: "Mariam J.", productName: "Golden Sillage" },
  { _id: "2", rating: 4, reviewText: "The dry down of Royal Leather is incredible. It smells like pure wealth!", userName: "Sana Parvez", productName: "Royal Leather" },
  { _id: "3", rating: 3.5, reviewText: "Midnight Oud is simply masterpiece. Dark, smoky, and extremely sophisticated.", userName: "Zain Ali", productName: "Midnight Oud" },
];

function StarRating({ rating = 5 }) {
  // Ensure rating is a number between 0 and 5
  const normalizedRating = Math.min(5, Math.max(0, Number(rating) || 0));
  
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span 
          key={s} 
          className={`text-sm md:text-base ${
            s <= normalizedRating ? "text-yellow-400" : "text-gray-200"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function Reviews() {
  const { data, isLoading } = useGetAllReviews();

  const reviews = (() => {
    const raw = Array.isArray(data) ? data : (data?.data ?? data?.reviews ?? []);
    if (raw.length > 0) {
      return raw.slice(0, 3);
    }
    return STATIC_FALLBACK;
  })();

  return (
    <section className="py-10 md:py-20 sm:py-10 bg-[#fdf9f5] relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-0 w-64 h-64 bg-[#6c444e]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-0 w-80 h-80 bg-[#6c444e]/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 bg-white">
        
        {/* Heading */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl pt-15 font-bold text-[#1a1a1a] mb-3 font-['Noto_Serif',Georgia,serif]">
            Voices of <span className="text-[#6c444e]">Luxury</span>
          </h2>
          <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto">
            Hear genuine feedback from our customers who trust us for quality, reliability, and great results.
          </p>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-10">
            {reviews.map((review, idx) => {
              const name = review.userName || "Anonymous User";
              const text = review.reviewText || review.review || "";
              const rating = review.rating ?? 5;
              const productName = review.productName || "";

              return (
                <div 
                  key={`review-${review._id || idx}`}
                  className="bg-white rounded-2xl p-5 md:p-6 border-2 border-[#6c444e]/20 shadow-md hover:shadow-lg hover:border-[#6c444e]/40 transition-all duration-300 h-full flex flex-col"
                >
                  {/* Rating Stars */}
                  <div className="mb-3">
                    <StarRating rating={rating} />
                  </div>
                  
                  {/* Product Name Badge */}
                  {productName && (
                    <div className="inline-block self-start mb-2">
                      <span className="text-[10px] md:text-[11px] bg-[#6c444e]/10 text-[#6c444e] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {productName}
                      </span>
                    </div>
                  )}
                  
                  {/* Review Text */}
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-4 flex-grow">
                    “{text}”
                  </p>
                  
                  {/* Customer Name */}
                  <div className="border-t border-gray-100 pt-3 mt-2">
                    <h4 className="font-bold text-gray-800 text-sm md:text-base">
                      {name}
                    </h4>
                  
                    {/* Verified Buyer */}
                    <span className="text-[10px] text-green-600 font-medium mt-1 inline-block">
                      ✓ Verified Buyer
                    </span>
                  </div>
                  
                </div>
              );
            })}
          </div>
        )}
        
      </div>
    </section>
  );
}