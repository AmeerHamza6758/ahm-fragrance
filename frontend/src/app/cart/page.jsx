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
    <main className="cart-page-main">
      <section className="cart-section">
        <div className="cart-container">
          {/* Cart Items */}
          <div className="cart-items-section">
            <h1 className="cart-title">Your Shopping Bag</h1>
            <p className="cart-subtitle">
              A COLLECTION OF YOUR MEMORY SELECTIONS
            </p>

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
                    <div key={`${productId}-${idx}`} className="cart-item">
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
                          onClick={() => removeItem(String(productId))}
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
            <div className="cart-badges">
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
          <div className="order-summary">
            <h2 className="summary-title">Order Summary</h2>

            <div className="summary-content">
              <div className="summary-row">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">
                  PKR {subtotal.toLocaleString()}
                </span>
              </div>

              <div className="summary-row">
                <span className="summary-label">Shipping</span>
                <span className="summary-value shipping-free">Free</span>
              </div>

              {discount > 0 && (
                <div className="summary-row discount">
                  <span className="summary-label">Discount</span>
                  <span className="summary-value">
                    -PKR {discount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span className="summary-label">Total</span>
                <span className="summary-value">
                  PKR {total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              className="checkout-btn"
              onClick={() => router.push("/cart/checkout")}
            >
              PROCEED TO CHECKOUT
            </button>

            <div className="promo-section">
              <label className="promo-label">Apply Promo Code</label>
              <div className="promo-input-group">
                <input
                  type="text"
                  placeholder="OFF7200A"
                  className="promo-input"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button className="promo-apply-btn" onClick={handleApplyPromo}>
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
