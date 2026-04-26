"use client";

import { useGetAllReviews } from "@/lib/api/hooks/useCart";

const STATIC_FALLBACK = [
  {
    _id: "1",
    rating: 5,
    reviewText:
      "I'm amazed by the quality of Ocean Drift. It lasts literally 12+ hours on my skin. Definitely my new go-to fragrance.",
    userName: "Ahmed Khan",
    productName: "Ocean Drift",
    avatarUrl: "https://i.pravatar.cc/96?img=12",
  },
  {
    _id: "2",
    rating: 5,
    reviewText:
      "The Velvet Peony is identical to my favorite high-end designer perfume. I can't believe I can get this quality for this price.",
    userName: "Sara Malik",
    productName: "Velvet Peony",
    avatarUrl: "https://i.pravatar.cc/96?img=5",
  },
  {
    _id: "3",
    rating: 4,
    reviewText:
      "Premium packaging and fast delivery. Reached me in Lahore in just 2 days. Highly recommend AHM for luxury lovers.",
    userName: "Bilal Sheikh",
    productName: "Amber Reserve",
    avatarUrl: "https://i.pravatar.cc/96?img=15",
  },
  {
    _id: "4",
    rating: 5,
    reviewText:
      "Elegant scent profile and excellent projection. I received compliments all evening at a wedding event.",
    userName: "Hira Nadeem",
    productName: "Rose Noir",
    avatarUrl: "https://i.pravatar.cc/96?img=32",
  },
  {
    _id: "5",
    rating: 4,
    reviewText:
      "Beautiful presentation and authentic fragrance notes. Great value for anyone building a premium fragrance collection.",
    userName: "Usman Tariq",
    productName: "Cedar Bloom",
    avatarUrl: "https://i.pravatar.cc/96?img=22",
  },
];

function StarRating({ rating = 5 }) {
  return (
    <div className="review-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= rating ? "#7e525c" : "#d4c4c8" }}>
          &#9733;
        </span>
      ))}
    </div>
  );
}

export default function Reviews() {
  const { data, isLoading } = useGetAllReviews();

  const reviews = (() => {
    const raw = Array.isArray(data)
      ? data
      : (data?.data ?? data?.reviews ?? []);
    return raw.length > 0 ? raw.slice(0, 6) : STATIC_FALLBACK;
  })();

  const getInitials = (name = "Anonymous") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("");

  return (
    <section className="reviews-section">
      <h2 className="reviews-heading">Voices of Luxury</h2>

      {isLoading ? (
        <div
          className="flex justify-center py-10"
        >
          <div className="w-8 h-8 border-4 border-[#7e525c] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="reviews-grid">
          {reviews.map((review) => {
            const name = review.userName || "Anonymous User";
            const productName = review.productName || "";
            const text = review.reviewText || review.review || "";
            const avatarUrl = review.avatarUrl || "";

            return (
              <div key={review.reviewId ?? review._id} className="review-card">
                <div className="flex flex-col items-start gap-2">
                <StarRating rating={review.rating ?? 5} />
                {productName && (
                  <p className="text-xs sm:text-sm text-secondary font-manrope uppercase tracking-wide" 
                  >
                    {productName}
                  </p>
                )}
                </div>
                <p className="text-base sm:text-lg text-muted font-manrope">&ldquo;{text}&rdquo;</p>
                <div className="review-user">
                  <div className="review-user-circle">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={name} className="review-user-image" />
                    ) : (
                      <span className="review-user-initials">{getInitials(name)}</span>
                    )}
                  </div>
                  <div>
                    <h4>{name}</h4>
                    <span>Verified Buyer</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
