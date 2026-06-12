"use client";
import { useProducts } from "@/lib/api/hooks/useProducts";
import ProductCard from "@/Components/ProductCard";
import Loader from "@/Components/Loader/Loader";

export default function BestSellers() {
  // Fetch top-rated products
  const { data: products = [], isLoading, isError } = useProducts({ rating: "desc" });
  const visibleProducts = products.slice(0, 8);

  return (
    <section className="py-10 md:py-24 bg-[#fdf9f5] relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-[#6c444e]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-[#6c444e]/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Heading Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-3">
            <span className="text-[#6c444e] text-sm md:text-base font-semibold tracking-wider uppercase">
              Signature Collection
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-4 font-['Noto_Serif',Georgia,serif]">
            The Best Sellers
          </h2>
          <div className="w-20 h-0.5 bg-[#6c444e]/30 mx-auto mb-4"></div>
          <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto">
            Our most loved signature fragrances
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : isError ? (
          /* ERROR MESSAGE */
          <div className="w-full text-center py-16 bg-white/50 rounded-2xl backdrop-blur-sm">
            <p className="text-[#6c444e] font-['Noto_Serif',Georgia,serif] italic text-base md:text-lg">
              Unable to load our collection at the moment. Please try again later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {visibleProducts.map((product) => (
              <div key={product._id || product.id} className="w-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
        
      </div>
    </section>
  );
}