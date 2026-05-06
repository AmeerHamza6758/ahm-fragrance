"use client";
import { useProducts } from "@/lib/api/hooks/useProducts";
import ProductCard from "@/Components/ProductCard";
import Loader from "@/Components/Loader/Loader";

export default function BestSellers() {
  // Fetch top-rated products
  const { data: products = [], isLoading, isError } = useProducts({ rating: "desc" });
  const visibleProducts = products.slice(0, 8);


  return (
    <section className="best-sellers pb-10!">
      <div className="best-sellers-top">
        <div>
          <h2>The Best Sellers</h2>
          <p>Our most loved signature fragrances</p>
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : isError ? (
      /*  ERROR MESSAGE  */
      <div className="w-full text-center py-10">
        <p className="text-[#7e525c] font-noto italic text-lg">
          Unable to load our collection at the moment. Please try again later.
        </p>
      </div>
    ) : (
        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(220px,260px))] justify-items-center md:justify-items-stretch md:justify-start gap-x-5 gap-y-10">
          {visibleProducts.map((product) => (
            <div key={product._id || product.id} className="w-full max-w-[340px] md:max-w-[260px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
