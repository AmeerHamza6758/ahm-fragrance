"use client";

import { useGetAllReviews } from "@/lib/api/hooks/useCart";

const STATIC_FALLBACK = [
  {
    _id: "1",
    rating: 5,
    review:
      "I'm amazed by the quality of Ocean Drift. It lasts literally 12+ hours on my skin. Definitely my new go-to fragrance.",
    userId: { userName: "Ahmed Khan" },
  },
  {
    _id: "2",
    rating: 5,
    review:
      "The Velvet Peony is identical to my favorite high-end designer perfume. I can't believe I can get this quality for this price.",
    userId: { userName: "Sara Malik" },
  },
  {
    _id: "3",
    rating: 4,
    review:
      "Premium packaging and fast delivery. Reached me in Lahore in just 2 days. Highly recommend AHM for luxury lovers.",
    userId: { userName: "Bilal Sheikh" },
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

  return (
    <section className="reviews-section">
      <h2 className="reviews-heading">Voices of Luxury</h2>

      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "40px 0",
          }}
        >
          <div className="w-8 h-8 border-4 border-[#7e525c] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="reviews-grid">
          {reviews.map((review) => {
            const name = review.userName || "Anonymous";
            const productName = review.productName || "";
            const text =
              review.reviewText || review.review || review.comment || "";

            return (
              <div key={review.reviewId ?? review._id} className="review-card">
                <StarRating rating={review.rating ?? 5} />
                {productName && (
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#b09090",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {productName}
                  </p>
                )}
                <p className="review-text">&ldquo;{text}&rdquo;</p>
                <div className="review-user">
                  <div className="review-user-circle" />
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
