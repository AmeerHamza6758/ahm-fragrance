"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import truck_icon from "/public/Icons/product-details-truck-icon.svg";
import cash_icon from "/public/Icons/product-details-cash-icon.svg";
import auth_icon from "/public/Icons/product-details-authentic-icon.svg";
import { useGetCart, useRemoveFromCart } from "@/lib/api";
import { buildProductImageUrl } from "@/lib/utils/imageUrl";

export default function CartPage() {
  const { data: cartData, isLoading: cartLoading } = useGetCart();
  const { mutate: removeItem } = useRemoveFromCart();
  const [promoCode, setPromoCode] = useState("");
  const [discount] = useState(0);
  const router = useRouter();

  // Support both { items: [...] } and direct array responses
  const cartItems = Array.isArray(cartData)
    ? cartData
    : (cartData?.items ?? cartData?.data?.items ?? []);

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + (item.price ?? item.productId?.price ?? 0) * (item.quantity ?? 1),
    0,
  );
  const total = subtotal - discount;

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setPromoCode("");
    }
  };

  return (
    <main className="cart-page-main pt-10 pb-16">
      <section className="cart-section">
        <div className="cart-container">
          {/* Cart Items */}
          <div className="cart-items-section">
          <div className="flex flex-col items-center text-center px-4 mb-12 md:mb-16">
  <h1 
    className="text-[#7e525c] font-noto leading-tight mb-4"
    style={{ fontSize: "clamp(40px, 7vw, 50px)" }}
  >
    Your Shopping Bag
  </h1>
  <div className="w-12 h-[1px] bg-[#7e525c]/30 mb-4"></div> {/* Decorative Line */}
  <p className="max-w-xl text-[13px] md:text-[15px] tracking-[0.2em] text-[#7e525c]/70 uppercase font-light leading-relaxed">
    A curated collection of your memory selections and timeless elixirs
  </p>
</div>
            <div className="cart-items-list">
              {cartLoading ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-4 border-[#7e525c] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : cartItems.length === 0 ? (
                <div className="empty-cart">
                  <p>Your cart is empty</p>
                  <a href="/collections">Continue Shopping</a>
                </div>
              ) : (
                cartItems.map((item, idx) => {
                  const cartId = item.cartId ?? item._id ?? idx;
                  const productId =
                    item.productId?._id ?? item.productId ?? item._id ?? idx;
                  const name = item.productId?.name ?? item.name ?? "Product";
                  const price = item.price ?? item.productId?.price ?? 0;
                  const imageRaw =
                    item.productId?.image_id?.path ??
                    item.productId?.image ??
                    item.image ??
                    null;
                  let imageSrc = "/Images/best-1.svg";
                  if (imageRaw) {
                    imageSrc = buildProductImageUrl(imageRaw);
                  }
                  return (
                    <div
                      key={`${cartId}-${productId}-${idx}`}
                      className="cart-item"
                    >
                      <div className="item-image">
                        <Image
                          src={imageSrc}
                          alt={name}
                          width={100}
                          height={100}
                          className="item-image-img"
                          onError={(e) => {
                            e.target.src = "/Images/best-1.svg";
                          }}
                        />
                      </div>

                      <div className="item-details">
                        <h3 className="item-name">{name}</h3>
                        <p className="item-size">
                          Eau de Parfum | {item.size ?? "50ml"}
                        </p>
                        <div className="item-quantity-control">
                          <span>{item.quantity ?? 1}</span>
                        </div>
                      </div>

                      <div className="item-price-section">
                        <p className="item-price">
                          PKR {(price * (item.quantity ?? 1)).toLocaleString()}
                        </p>
                        <button
                          className="remove-btn"
                          onClick={() => removeItem(String(cartId))}
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Trust Badges */}
            <div className="cart-badges m-8">
              <div className="badge">
                <span className="badge-icon">
                  <Image
                    src={truck_icon}
                    alt="Delivery"
                    width={20}
                    height={20}
                  />
                </span>

                <div>
                  <p className="badge-title">Free Delivery All Over Pakistan</p>
                </div>
              </div>

              <div className="badge">
                <span className="badge-icon">
                  <Image
                    src={cash_icon}
                    alt="Cash on Delivery"
                    width={20}
                    height={20}
                  />
                </span>
                <div>
                  <p className="badge-title">Cash on Delivery Available</p>
                </div>
              </div>

              <div className="badge">
                <span className="badge-icon">
                  <Image
                    src={auth_icon}
                    alt="Authentic Products"
                    width={20}
                    height={20}
                  />
                </span>
                <div>
                  <p className="badge-title">100% Authentic Products</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary m-6 max-w-md mx-auto rounded-[32px] p-8">

  <h2 className="  text-[#7e525c] md:mb-12 font-noto text-2xl md:text-4xl lg:text-4xl">Order Summary</h2>

  <div className="summary-content  space-x-5">

    <div className="summary-row flex justify-between items-center">
      <span className="summary-label">Subtotal</span>
      <span className="summary-value">
        PKR {subtotal.toLocaleString()}
      </span>
    </div>

    <div className="summary-row flex justify-between items-center">
      <span className="summary-label">Shipping</span>
      <span className="summary-value shipping-free">Free</span>
    </div>

    {discount > 0 && (
      <div className="summary-row flex justify-between items-center discount">
        <span className="summary-label">Discount</span>
        <span className="summary-value">
          -PKR {discount.toLocaleString()}
        </span>
      </div>
    )}

    {/* Divider */}
    <div className="summary-divider  my-4"></div>

    <div className=" total flex justify-between items-center mt-2">
      <span className="summary-label text-lg">Total</span>
      <span className="summary-value text-lg">
        PKR {total.toLocaleString()}
      </span>
    </div>
  </div>

  {/* Button */}
  <button
    className="checkout-btn w-full mt-8 py-4 rounded-full text-sm tracking-widest"
    onClick={() => router.push("/cart/checkout")}
  >
    PROCEED TO CHECKOUT
  </button>

  {/* Promo Section */}
  <div className="promo-section mt-8">
    <label className="promo-label block text-center mb-4">
      Apply Promo Code
    </label>

    <div className="promo-input-group flex items-center gap-3">
      <input
        type="text"
        placeholder="OFF7200A"
        className="promo-input flex-1 px-4 py-3 rounded-xl outline-none"
        value={promoCode}
        onChange={(e) => setPromoCode(e.target.value)}
      />

      <button
        className="promo-apply-btn text-sm font-medium"
        onClick={handleApplyPromo}
      >
        APPLY
      </button>
    </div>
  </div>

</div>
        </div>
      </section>
    </main>
  );
}
