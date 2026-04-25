"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useProducts } from "@/lib/api/hooks/useProducts";
import { buildProductImageUrl } from "@/lib/utils/imageUrl";

export default function BestSellers() {
  // Fetch top-rated products
  const { data: products = [], isLoading } = useProducts({ rating: "desc" });
  // Carousel state
  const [startIdx, setStartIdx] = useState(0);
  const visibleCount = 4;
  const maxIdx = Math.max(0, products.length - visibleCount);

  const handlePrev = () => {
    setStartIdx((prev) => Math.max(0, prev - 1));
  };
  const handleNext = () => {
    setStartIdx((prev) => Math.min(maxIdx, prev + 1));
  };

  return (
    <section className="best-sellers">
      <div className="best-sellers-top">
        <div>
          <h2>The Best Sellers</h2>
          <p>Our most loved signature fragrances</p>
        </div>

        <div className="best-sellers-arrows">
          <button onClick={handlePrev} disabled={startIdx === 0}>
            &larr;
          </button>
          <button onClick={handleNext} disabled={startIdx === maxIdx}>
            &rarr;
          </button>
        </div>
      </div>

      <div className="best-sellers-grid">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          products.slice(startIdx, startIdx + visibleCount).map((product) => (
            <Link
              key={product._id || product.id}
              href={`/product/${product._id || product.id}`}
              className="best-seller-product-link"
            >
              <div className="product-card">
                <div className="product-image-wrap">
                  <Image
                    src={buildProductImageUrl(product.image_id?.path)}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="product-image"
                    unoptimized
                  />
                </div>
                <p className="product-category">
                  {product.category_id?.name || "-"}
                </p>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">
                  Rs. {product.price?.toLocaleString()}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
