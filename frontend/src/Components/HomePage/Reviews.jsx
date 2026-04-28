"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import { useGetAllReviews } from "@/lib/api/hooks/useCart";

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

const STATIC_FALLBACK = [
  { _id: "1", rating: 5, reviewText: "I'm amazed by the quality of Ocean Drift. It lasts literally 12+ hours on my skin.", userName: "Ahmed Khan", productName: "Ocean Drift", avatarUrl: "https://i.pravatar.cc/96?img=12" },
  { _id: "2", rating: 5, reviewText: "The Velvet Peony is identical to my favorite high-end designer perfume. High quality!", userName: "Sara Malik", productName: "Velvet Peony", avatarUrl: "https://i.pravatar.cc/96?img=5" },
  { _id: "3", rating: 4, reviewText: "Premium packaging and fast delivery. Highly recommend AHM for luxury lovers.", userName: "Bilal Sheikh", productName: "Amber Reserve", avatarUrl: "https://i.pravatar.cc/96?img=15" },
  { _id: "4", rating: 5, reviewText: "Elegant scent profile and excellent projection. I received compliments all evening.", userName: "Hira Nadeem", productName: "Rose Noir", avatarUrl: "https://i.pravatar.cc/96?img=32" },
  { _id: "5", rating: 5, reviewText: "Midnight Oud is simply masterpiece. Dark, smoky, and extremely sophisticated.", userName: "Zain Ali", productName: "Midnight Oud", avatarUrl: "https://i.pravatar.cc/96?img=11" },
  { _id: "6", rating: 5, reviewText: "Best purchase of the year. The longevity is better than original designer brands.", userName: "Mariam J. ", productName: "Golden Sillage", avatarUrl: "https://i.pravatar.cc/96?img=26" },
  { _id: "7", rating: 4, reviewText: "Fresh and energetic. Perfect for daily office wear. Will definitely buy again.", userName: "Usman Ghani", productName: "Aqua Intense", avatarUrl: "https://i.pravatar.cc/96?img=18" },
  { _id: "8", rating: 5, reviewText: "The dry down of Royal Leather is incredible. It smells like pure wealth!", userName: "Sana Parvez", productName: "Royal Leather", avatarUrl: "https://i.pravatar.cc/96?img=44" },
];

function StarRating({ rating = 5 }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= rating ? "#7e525c" : "#d4c4c8" }} className="text-lg">
          &#9733;
        </span>
      ))}
    </div>
  );
}

export default function Reviews() {
  const { data, isLoading } = useGetAllReviews();

  const reviews = (() => {
    const raw = Array.isArray(data) ? data : (data?.data ?? data?.reviews ?? []);
    return raw.length > 0 ? raw : STATIC_FALLBACK;
  })();

  const getInitials = (name = "Anonymous") =>
    name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("");

  return (
    <section className="py-12 bg-white overflow-hidden mx-2 ">
       <h1 className="text-[#7E525C] text-2xl sm:text-2xl md:text-4xl font-noto font-normal text-center pb-12">
         Voices of Luxury
        </h1>
 
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-[#7e525c] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
       <div className="px-4 md:px-10">
          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            loop={true}
          
           slidesPerView={1.2}
            spaceBetween={0}
            breakpoints={{
      
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 120,
              modifier: 2.5,
              slideShadows: false,
            }}
            pagination={{ clickable: true }}
            modules={[EffectCoverflow, Pagination, Autoplay]}
            className="max-w-6xl !pb-14 overflow-hidden"
          >
            {reviews.map((review) => {
              const name = review.userName || "Anonymous User";
              const text = review.reviewText || review.review || "";
              const avatarUrl = review.avatarUrl || "";

              return (
                <SwiperSlide key={review.reviewId ?? review._id}>
                  <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#7e525c] shadow-lg h-full flex flex-col transition-all duration-300 mx-2">
                    <div className="mb-4">
                      <StarRating rating={review.rating ?? 5} />
                      {review.productName && (
                        <p className="text-[10px] md:text-xs mt-2 text-[#7e525c] font-semibold uppercase tracking-widest">
                          {review.productName}
                        </p>
                      )}
                    </div>

                    <p className="text-gray-600 italic mb-8 flex-grow leading-relaxed text-sm md:text-base">
                      &ldquo;{text}&rdquo;
                    </p>

                    <div className="flex items-center gap-4 border-t border-gray-100 pt-4 mt-auto">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-[#f3edf0] flex items-center justify-center border-2 border-[#7e525c]/20">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[#7e525c] font-bold text-xs md:text-sm">{getInitials(name)}</span>
                        )}
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-gray-800 text-xs md:text-sm">{name}</h4>
                        <span className="text-[10px] text-gray-400 uppercase font-medium">Verified Buyer</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}

      <style jsx global>{`
        .swiper-pagination-bullet-active {
          background: #7e525c !important;
        }
        .swiper-slide {
          opacity: 1;
          transition: all 0.4s ease;
          transform: scale(0.85); 
        }
        .swiper-slide-active {
          opacity: 1;
          transform: scale(1); 
        }
        .swiper-slide-next, .swiper-slide-prev {
          opacity: 1;
        }
      
        .swiper {
            overflow: hidden;
        }
      `}</style>
    </section>
  );
}