"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import { useGetAllReviews } from "@/lib/api/hooks/useCart";

import 'swiper/css';
import 'swiper/css/effect-coverflow';

const STATIC_FALLBACK = [
  { _id: "1", rating: 5, reviewText: "I'm amazed by the quality of Ocean Drift. It lasts literally 12+ hours on my skin.", userName: "Ahmed Khan", productName: "Ocean Drift", avatarUrl: "https://i.pravatar.cc/96?img=12" },
  { _id: "2", rating: 5, reviewText: "The Velvet Peony is identical to my favorite high-end designer perfume. High quality!", userName: "Sara Malik", productName: "Velvet Peony", avatarUrl: "https://i.pravatar.cc/96?img=5" },
  { _id: "4", rating: 5, reviewText: "Elegant scent profile and excellent projection. I received compliments all evening.", userName: "Hira Nadeem", productName: "Rose Noir", avatarUrl: "https://i.pravatar.cc/96?img=32" },
  { _id: "5", rating: 5, reviewText: "Midnight Oud is simply masterpiece. Dark, smoky, and extremely sophisticated.", userName: "Zain Ali", productName: "Midnight Oud", avatarUrl: "https://i.pravatar.cc/96?img=11" },
  { _id: "6", rating: 5, reviewText: "Best purchase of the year. The longevity is better than original designer brands.", userName: "Mariam J.", productName: "Golden Sillage", avatarUrl: "https://i.pravatar.cc/96?img=26" },
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
    const sorted = [...raw].sort((a, b) => {
      if ((b.rating || 0) !== (a.rating || 0)) {
        return (b.rating || 0) - (a.rating || 0);
      }
      return (b._id || "").toString().localeCompare((a._id || "").toString());
    });
    const final = sorted.length > 0 ? sorted : STATIC_FALLBACK.sort((a, b) => b.rating - a.rating);
    if (final.length > 0 && final.length < 6) {
      return [...final, ...final, ...final];
    }
    return final;
  })();

  const getInitials = (name = "Anonymous") =>
    name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("");

  return (
    <section className="py-12 bg-white overflow-hidden mx-2">
      <h1 className="text-[#7E525C] text-2xl sm:text-2xl md:text-4xl font-noto font-normal text-center pb-12">
        Voices of Luxury
      </h1>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-[#7e525c] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="relative w-full max-w-[90%] md:max-w-6xl mx-auto">
          <Swiper
            key={`rev-v4-${reviews.length}`}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            loopedSlides={6}
            speed={800}
            slidesPerView={1.2}
            spaceBetween={0}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            autoplay={{
              delay: 1000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 120,
              modifier: 2.5,
              slideShadows: false,
            }}
            modules={[EffectCoverflow, Autoplay]}
            className="max-w-6xl !pb-14 overflow-hidden"
          >
            {reviews.map((review, idx) => {
              const name = review.userName || "Anonymous User";
              const text = review.reviewText || review.review || "";

              return (
                <SwiperSlide key={`rev-v4-${review._id || idx}-${idx}`}>
                  <div className="bg-white rounded-2xl p-6 m-2 md:p-8 border border-[#7e525c] shadow-lg h-full flex flex-col transition-all duration-300 hover:shadow-xl">
                    <div className="mb-4">
                      <StarRating rating={review.rating ?? 5} />
                      {review.productName && (
                        <p className="text-[10px] md:text-xs mt-2 text-[#7e525c] font-semibold uppercase tracking-widest">
                          {review.productName}
                        </p>
                      )}
                    </div>

                    <p className="text-gray-600 italic mb-4 flex-grow leading-relaxed text-sm md:text-base">
                      &ldquo;{text}&rdquo;
                    </p>

                    <div className="flex items-center gap-4 border-t border-gray-100 pt-4 mt-auto">
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
        .swiper-slide {
          height: auto;
        }
      `}</style>

      {/* Decorative Wave Divider */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none" className="rotate-180 mt-8">
        <path fill="#7E525C" opacity="0.1" d="M473,67.3c-203.9,88.3-263.1-34-320.3,0C66,119.1,0,59.7,0,59.7V0h1000v59.7 c0,0-62.1,26.1-94.9,29.3c-32.8,3.3-62.8-12.3-75.8-22.1C806,49.6,745.3,8.7,694.9,4.7S492.4,59,473,67.3z"></path>
        <path fill="#7E525C" opacity="0.2" d="M734,67.3c-45.5,0-77.2-23.2-129.1-39.1c-28.6-8.7-150.3-10.1-254,39.1 s-91.7-34.4-149.2,0C115.7,118.3,0,39.8,0,39.8V0h1000v36.5c0,0-28.2-18.5-92.1-18.5C810.2,18.1,775.7,67.3,734,67.3z"></path>
        <path fill="#7E525C" opacity="0.3" d="M766.1,28.9c-200-57.5-266,65.5-395.1,19.5C242,1.8,242,5.4,184.8,20.6C128,35.8,132.3,44.9,89.9,52.5C28.6,63.7,0,0,0,0 h1000c0,0-9.9,40.9-83.6,48.1S829.6,47,766.1,28.9z"></path>
      </svg>
    </section>
  );
}