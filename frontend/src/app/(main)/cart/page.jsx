"use client";

import Image from "next/image";
import { X, Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import truck_icon from "/public/Icons/product-details-truck-icon.svg";
import cash_icon from "/public/Icons/product-details-cash-icon.svg";
import auth_icon from "/public/Icons/product-details-authentic-icon.svg";
import { useGetCart, useRemoveFromCart } from "@/lib/api";
import { buildProductImageUrl } from "@/lib/utils/imageUrl";
import { Handbag } from 'lucide-react';


export default function CartPage() {
  const { data: cartData, isLoading: cartLoading } = useGetCart();
  const { mutate: removeItem } = useRemoveFromCart();

  const [discount] = useState(0);
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItems = Array.isArray(cartData)
    ? cartData
    : (cartData?.items ?? cartData?.data?.items ?? []);

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + (item.price ?? item.productId?.price ?? 0) * (item.quantity ?? 1),
    0,
  );
 const deliveryCharges = 150; 
const total = subtotal + deliveryCharges - discount;

  if (!mounted) return <div className="min-h-screen bg-[#FDF9F5]" />;

  return (
    <main className="cart-page-main pt-10 pb-16 bg-[#FDF9F5]">
      <section className="cart-section max-w-7xl mx-auto px-4 md:px-6">
        {/* Page Title Section */}
        <section className="text-center pb-12">
          <h1 className="text-[#7E525C] text-5xl md:text-7xl font-serif font-normal">
            Your Shopping Bag
          </h1>
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="block h-px w-12 bg-[#D1C3C1]" />
            <p className="text-[#4E4543] text-[10px] uppercase tracking-[2px] font-normal">
              A curated collection of your memory selections and timeless
              elixirs
            </p>
            <span className="block h-px w-12 bg-[#D1C3C1]" />
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Side: Cart Items List */}
          <div className="flex-1 space-y-6">
            {cartLoading ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-[#7e525c] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : cartItems.length === 0 ? (
             <div className="bg-[#F9F6F2] rounded-[32px] p-20 flex flex-col items-center justify-center text-center">
  <p className="text-[#7E525C] font-serif text-xl mb-10">
    Your bag is empty
  </p>
  
  <button
    onClick={() => router.push("/collections")}
    className="text-[#4E4543] text-xs  tracking-widest flex items-center gap-2 transition-opacity hover:opacity-70"
  >
   EXPLORE COLLECTIONS <Handbag className="w-4 h-4" />
  </button>
</div>
            ) : (
              cartItems.map((item, idx) => {
               
                
                const cartId = item.cartId ?? item._id ?? idx;
                const name = item.productId?.name ?? item.name ?? "Product";
                const price = item.price ?? item.productId?.price ?? 0;
                const imageRaw =
                  item.productId?.image_id?.path ??
                  item.productId?.image ??
                  item.image;
                const imageSrc = imageRaw
                  ? buildProductImageUrl(imageRaw)
                  : "/Images/best-1.svg";

               
                 return (
  <div
    key={cartId}
    className="relative flex bg-[#F9F6F2] rounded-[24px] p-4 md:p-5 items-center gap-5 group"
  >
    {/* Product Image - Reduced height from 56 to 40/48 */}
    <div className="relative w-24 h-32 md:w-36 md:h-40 shrink-0 overflow-hidden rounded-[18px]">
      <Image
        src={imageSrc}
        alt={name}
        fill
        className="object-cover"
      />
    </div>

    {/* Product Info & Controls - Removed high min-height */}
    <div className="flex flex-col flex-1 self-stretch justify-between py-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-[#7E525C] text-lg md:text-xl font-serif leading-tight">
            {name}
          </h3>
          <p className="text-[#A69391] text-[11px] mt-1">
            Eau de Parfum | {item.size ?? "50ml"}
          </p>
        </div>
        {/* Remove Button */}
        <button
          onClick={() => removeItem(String(cartId))}
          className="text-[#7e525c] hover:text-[#8b6f76] transition-colors cursor-pointer p-1"
        >
          <X size={18} strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex justify-between items-end mt-4">
        {/* Quantity Selector */}
        <div
          className="flex items-center justify-center min-w-[60px] px-4 py-1.5"
          style={{
            border: "1px solid #D1C3C1",
            borderRadius: "6px",
          }}
        >
          <span className="text-sm text-[#4E4543]">{item.quantity ?? 1}</span>
        </div>
        {/* Price */}
        <p className="text-[#7E525C] font-serif text-base md:text-lg whitespace-nowrap">
          PKR {price.toLocaleString()}
        </p>
      </div>
    </div>
  </div>
);
             
              })
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              {[
                { src: truck_icon, text: "Quick Dispatch" },
                { src: cash_icon, text: "Cash on Delivery Available" },
                { src: auth_icon, text: "100% Authentic Products" },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-4 py-2 px-4!">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0 bg-[#faead2]   rounded-full">
                    <Image
                      src={badge.src}
                      alt="icon"
                      width={40}
                      height={40}
                      className="object-contain h-6! max-w-6!"
                    />
                  </div>
                  <p className="text-[11px] uppercase tracking-[1.5px] text-[#4E4543] font-medium leading-tight max-w-[150px]">
                    {badge.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:w-[400px]">
            <div className="bg-[#F9F6F2] rounded-[40px] p-8 md:p-10 sticky top-10">
              <h2 className="text-[#7E525C] text-3xl font-serif mb-10 text-center">
                Order Summary
              </h2>

              <div className="space-y-5">
                <div className="flex justify-between items-center text-[#4E4543] font-bold">
                  <span className="text-[13px] uppercase tracking-[2px]">
                    Subtotal
                  </span>
                  <span className="text-[#7E525C] font-semibold">
                    PKR {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#4E4543]">
                  <span className="text-[13px] uppercase tracking-[2px] font-bold">
                    Shipping
                  </span>
                  <span className="text-[#7E525C] font-semibold ">
                    150
                  </span>
                </div>

                <div className="h-px bg-[#D1C3C1]/40 my-6" />

                <div className="flex justify-between items-center text-[#7E525C]">
                  <span className="text-3xl font-serif font-medium text-[#7E525C]">
        Total
      </span>
                  <span className="text-xl font-serif font-semibold">
                    PKR {total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                className="w-full mt-10 bg-[#7E525C] text-white py-5 rounded-full text-[10px] font-bold tracking-[3px] hover:bg-[#6a444d] transition-all uppercase"
                onClick={() => router.push("/cart/checkout")}
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
