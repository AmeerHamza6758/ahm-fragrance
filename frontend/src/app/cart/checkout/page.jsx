"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useGetCart, useCreateOrder } from "@/lib/api";
import { buildProductImageUrl } from "@/lib/utils/imageUrl";

export default function CheckoutPage() {
  const { data: cartData } = useGetCart();
  const { mutate: placeOrder, isPending: isPlacingOrder } = useCreateOrder();

  const cartItems = Array.isArray(cartData)
    ? cartData
    : (cartData?.items ?? cartData?.data?.items ?? []);

  const [promoCode, setPromoCode] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postal: "",
    province: "",
    agreed: false,
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [orderError, setOrderError] = useState("");

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + (item.price ?? item.productId?.price ?? 0) * (item.quantity ?? 1),
    0,
  );
  const total = subtotal;

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOrder = (e) => {
    e.preventDefault();
    if (!form.agreed) return;
    setOrderError("");

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      window.location.assign("/auth/login");
      return;
    }

    const items = cartItems.map((item) => ({
      productId:
        typeof item.productId === "object" && item.productId !== null
          ? item.productId._id
          : (item.productId ?? item._id),
      quantity: Number(item.quantity ?? 1),
    }));

    const payload = {
      items,
      customerInfo: {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        city: form.city,
        postalCode: form.postal,
        province: form.province,
      },
      agreedToTerms: true,
    };

    console.log("[Order Payload]", JSON.stringify(payload, null, 2));

    placeOrder(payload, {
      onSuccess: (res) => {
        setOrderData(res?.data?.order ?? res);
        setOrderPlaced(true);
      },
      onError: (err) => {
        const msg =
          err?.response?.data?.message ??
          err?.response?.data?.error ??
          err?.message ??
          "Failed to place order. Please try again.";
        console.error("[Order Error]", err?.response?.data ?? err);
        setOrderError(msg);
      },
    });
  };

  const [orderNumber] = useState(
    () => `AHM-2026-${Math.floor(10 + Math.random() * 90)}`,
  );
  const displayOrderNumber = orderData?.orderNumber ?? orderNumber;

  if (orderPlaced) {
    // Use API response values for financial summary
    const orderSubtotal = orderData?.subtotal ?? subtotal;
    const orderDeliveryCharges = orderData?.deliveryCharges ?? 0;
    const orderTotal = orderData?.totalAmount ?? total;

    // Use API response products if available, otherwise fall back to cart items
    const orderProducts = orderData?.products ?? null;

    return (
      <main className="min-h-screen bg-[#FDF9F5] pt-10 pb-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Success Icon */}
          <div className="w-16 h-16 rounded-full border border-[#c9a84c] flex items-center justify-center mb-6">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path
                d="M5 13l4 4L19 7"
                stroke="#c9a84c"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-[2rem] md:text-[2.25rem] font-normal text-[#7e525c] mb-3 text-center">
            Order Placed Successfully!
          </h1>
          <p className="text-[#6b6460] text-sm text-center max-w-md leading-relaxed mb-10">
            Your order #{displayOrderNumber} has been confirmed and will be
            delivered in 3–5 working days.
          </p>

          {/* Two Column Details */}
          <div className="w-full grid grid-cols-1 md:grid-cols-[300px_1fr] gap-5 items-start">
            {/* Delivery Details Card */}
            <div className="bg-white rounded-2xl border border-[#e8e2dc] p-7 flex flex-col gap-5">
              <h2 className="font-serif text-base font-normal text-[#7e525c]">
                Delivery Details
              </h2>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-[9px] tracking-[0.18em] font-bold text-[#9a8c87] uppercase mb-1">
                    Recipient
                  </p>
                  <p className="text-sm text-[#1c1c19] font-medium">
                    {orderData?.customerInfo?.name ?? form.name}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] tracking-[0.18em] font-bold text-[#9a8c87] uppercase mb-1">
                    Shipping Address
                  </p>
                  <p className="text-sm text-[#1c1c19] leading-relaxed">
                    {orderData?.customerInfo?.address ?? form.address}
                    <br />
                    {orderData?.customerInfo?.city ?? form.city}
                    {(orderData?.customerInfo?.postalCode ?? form.postal) ? `, ${orderData?.customerInfo?.postalCode ?? form.postal}` : ""}
                    <br />
                    {orderData?.customerInfo?.province ?? form.province}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] tracking-[0.18em] font-bold text-[#9a8c87] uppercase mb-1">
                    Contact
                  </p>
                  <p className="text-sm text-[#1c1c19]">{orderData?.customerInfo?.phone ?? form.phone}</p>
                </div>
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="bg-[#faf7f3] rounded-2xl border border-[#e8e2dc] p-7 flex flex-col gap-0">
              <h2 className="font-serif text-base font-normal text-[#7e525c] mb-4">
                Order Summary
              </h2>

              {/* Items - use API response products when available */}
              <div className="flex flex-col divide-y divide-[#e8e2dc]">
                {orderProducts
                  ? orderProducts.map((product, idx) => (
                      <div key={idx} className="flex items-center gap-4 py-4">
                        <div className="flex-1 min-w-0">
                          <div className="font-serif text-sm font-normal text-[#1c1c19]">
                            {product.name}
                          </div>
                          <div className="text-xs text-[#9a8c87] mt-0.5">
                            Qty: {product.quantity}
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-[#1c1c19] shrink-0">
                          PKR {(product.total ?? product.price * product.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))
                  : cartItems.map((item, idx) => {
                      const name = item.productId?.name ?? item.name ?? "Product";
                      const price = item.price ?? item.productId?.price ?? 0;
                      const qty = item.quantity ?? 1;
                      const imageRaw =
                        item.productId?.image_id?.path ??
                        item.image_id?.path ??
                        item.productId?.image ??
                        item.image ??
                        null;
                      let imageSrc = "/Images/best-1.svg";
                      if (imageRaw) {
                        imageSrc = buildProductImageUrl(imageRaw);
                      }
                      return (
                        <div key={idx} className="flex items-center gap-4 py-4">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#ede9e3]">
                            <Image
                              src={imageSrc}
                              alt={name}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                e.target.src = "/Images/best-1.svg";
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-serif text-sm font-normal text-[#1c1c19]">
                              {name} — {item.size ?? "50ml"}
                            </div>
                            <div className="text-xs text-[#9a8c87] mt-0.5">
                              Eau de Parfum
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-[#1c1c19] shrink-0">
                            PKR {(price * qty).toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
              </div>

              {/* Totals - from API response */}
              <div className="flex flex-col gap-2 pt-4 border-t border-[#e8e2dc] mt-2">
                <div className="flex justify-between text-sm text-[#6b6460]">
                  <span>Subtotal</span>
                  <span>PKR {orderSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-[#6b6460]">
                  <span>Delivery Charges</span>
                  <span>{orderDeliveryCharges > 0 ? `PKR ${orderDeliveryCharges.toLocaleString()}` : "Free"}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#e8e2dc] mt-1">
                  <span className="font-serif text-base text-[#7e525c]">
                    Total
                  </span>
                  <span className="font-serif text-base text-[#7e525c] font-semibold">
                    PKR {orderTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-10">
            <Link
              href="/collections"
              className="bg-[#7e525c] text-white px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide hover:bg-[#6a3f47] transition"
            >
              Continue Shopping
            </Link>
            <a
              href={`https://wa.me/?text=Track my order ${displayOrderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#ede9e3] text-[#6b6460] px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide hover:bg-[#e3ded7] transition"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M3 7l9 6 9-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Track on WhatsApp
            </a>
          </div>

          {/* Social Footer */}
          <div className="mt-12 flex flex-col items-center gap-3">
            <p className="text-[9px] tracking-[0.2em] text-[#9a8c87] uppercase font-semibold">
              Follow Our Journey on Instagram &amp; Facebook
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#ddd8d2] flex items-center justify-center text-[#6b6460] hover:border-[#7e525c] hover:text-[#7e525c] transition"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#ddd8d2] flex items-center justify-center text-[#6b6460] hover:border-[#7e525c] hover:text-[#7e525c] transition"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M15 8h-2a1 1 0 00-1 1v2H9v3h3v6h3v-6h2l.5-3H15V9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDF9F5] pt-10 pb-16 px-4 md:px-8">
      {/* Breadcrumb */}
      {/* <div className="max-w-5xl mx-auto mb-8">
        <p className="text-[10px] tracking-[0.18em] font-semibold text-[#6b6460] uppercase flex items-center gap-2">
          <Link href="/cart" className="hover:text-[#7e525c] transition">
            CART
          </Link>
          <span className="text-[#b8a9a7]">&rsaquo;</span>
          <span className="text-[#7e525c]">DETAILS</span>
          <span className="text-[#b8a9a7]">&rsaquo;</span>
          <span>CONFIRMED</span>
        </p>
      </div> */}

      {/* Step Indicator */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="flex items-center justify-center gap-0 relative">
          {/* Step 1 - Cart (completed) */}
          <div className="flex flex-col items-center gap-2 z-10">
            <div className="w-10 h-10 rounded-full bg-[#7e525c] flex items-center justify-center shadow-sm">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-[10px] tracking-[0.15em] font-semibold text-[#7e525c] uppercase">
              CART
            </span>
          </div>
          {/* Line */}
          <div
            className="flex-1 h-px bg-[#ccc5be] mx-4"
            style={{ maxWidth: 180, marginTop: "-18px" }}
          ></div>
          {/* Step 2 - Details (active) */}
          <div className="flex flex-col items-center gap-2 z-10">
            <div className="w-10 h-10 rounded-full border-2 border-[#7e525c] flex items-center justify-center bg-[#f5f0eb] shadow-sm">
              <span className="text-[#7e525c] text-sm font-semibold">02</span>
            </div>
            <span className="text-[10px] tracking-[0.15em] font-semibold text-[#7e525c] uppercase">
              DETAILS
            </span>
          </div>
          {/* Line */}
          <div
            className="flex-1 h-px bg-[#ccc5be] mx-4"
            style={{ maxWidth: 180, marginTop: "-18px" }}
          ></div>
          {/* Step 3 - Confirmed */}
          <div className="flex flex-col items-center gap-2 z-10">
            <div className="w-10 h-10 rounded-full border border-[#ccc5be] flex items-center justify-center bg-[#f5f0eb]">
              <span className="text-[#b8a9a7] text-sm font-semibold">03</span>
            </div>
            <span className="text-[10px] tracking-[0.15em] font-semibold text-[#b8a9a7] uppercase">
              CONFIRMED
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
        {/* Left: Delivery Form */}
        <form onSubmit={handleOrder} className="flex flex-col gap-7">
          <div>
            <h1 className="font-serif text-[2rem] font-normal text-[#1c1c19] mb-1 leading-tight">
              Delivery Information
            </h1>
            <p className="text-[#6b6460] text-sm">
              Please provide your details for secure botanical delivery.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {/* Full Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-[0.15em] font-semibold text-[#6b6460] uppercase">
                  Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleInput}
                  placeholder="Julianne Vane"
                  required
                  className="rounded-full border border-[#ddd8d2] bg-[#faf7f4] px-5 py-3 text-sm text-[#1c1c19] placeholder:text-[#c5bdb8] focus:outline-none focus:ring-1 focus:ring-[#7e525c] transition"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-[0.15em] font-semibold text-[#6b6460] uppercase">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleInput}
                  placeholder="+44 (0) 7700 900000"
                  required
                  className="rounded-full border border-[#ddd8d2] bg-[#faf7f4] px-5 py-3 text-sm text-[#1c1c19] placeholder:text-[#c5bdb8] focus:outline-none focus:ring-1 focus:ring-[#7e525c] transition"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] tracking-[0.15em] font-semibold text-[#6b6460] uppercase">
                Email
              </label>
              <input
                name="email"
                value={form.email}
                onChange={handleInput}
                placeholder="j.vane@editorial.com"
                required
                type="email"
                className="rounded-full border border-[#ddd8d2] bg-[#faf7f4] px-5 py-3 text-sm text-[#1c1c19] placeholder:text-[#c5bdb8] focus:outline-none focus:ring-1 focus:ring-[#7e525c] transition"
              />
            </div>

            {/* Complete Address */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] tracking-[0.15em] font-semibold text-[#6b6460] uppercase">
                Complete Address
              </label>
              <input
                name="address"
                value={form.address}
                onChange={handleInput}
                placeholder="Flat 4, The Willow Apartments, 22 Botanic Lane"
                required
                className="rounded-full border border-[#ddd8d2] bg-[#faf7f4] px-5 py-3 text-sm text-[#1c1c19] placeholder:text-[#c5bdb8] focus:outline-none focus:ring-1 focus:ring-[#7e525c] transition"
              />
            </div>

            {/* City + Postal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-[0.15em] font-semibold text-[#6b6460] uppercase">
                  City
                </label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleInput}
                  placeholder="London"
                  required
                  className="rounded-full border border-[#ddd8d2] bg-[#faf7f4] px-5 py-3 text-sm text-[#1c1c19] placeholder:text-[#c5bdb8] focus:outline-none focus:ring-1 focus:ring-[#7e525c] transition"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-[0.15em] font-semibold text-[#6b6460] uppercase">
                  Postal Code
                </label>
                <input
                  name="postal"
                  value={form.postal}
                  onChange={handleInput}
                  placeholder="EC1V 2NX"
                  required
                  className="rounded-full border border-[#ddd8d2] bg-[#faf7f4] px-5 py-3 text-sm text-[#1c1c19] placeholder:text-[#c5bdb8] focus:outline-none focus:ring-1 focus:ring-[#7e525c] transition"
                />
              </div>
            </div>

            {/* Province */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] tracking-[0.15em] font-semibold text-[#6b6460] uppercase">
                Province
              </label>
              <div className="relative">
                <select
                  name="province"
                  value={form.province}
                  onChange={handleInput}
                  required
                  className="w-full appearance-none rounded-full border border-[#ddd8d2] bg-[#faf7f4] px-5 py-3 text-sm text-[#1c1c19] focus:outline-none focus:ring-1 focus:ring-[#7e525c] transition"
                >
                  <option value="" disabled>
                    Select Province
                  </option>
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Islamabad Capital Territory">
                    Islamabad Capital Territory
                  </option>
                  <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                  <option value="Azad Jammu & Kashmir">
                    Azad Jammu &amp; Kashmir
                  </option>
                </select>
                <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#6b6460]">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Agreement */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="agreed"
              checked={form.agreed}
              onChange={handleInput}
              className="mt-0.5 w-4 h-4 rounded border border-[#ddd8d2] accent-[#7e525c] cursor-pointer"
            />
            <span className="text-sm text-[#6b6460] leading-relaxed">
              I agree to the{" "}
              <Link
                href="/company/terms-of-service"
                className="underline text-[#7e525c]"
              >
                Terms &amp; Conditions
              </Link>{" "}
              and acknowledge the privacy policy regarding my olfactory journey.
            </span>
          </label>

          {/* Place Order Button */}
          {orderError && (
            <p className="text-red-500 text-sm text-center">{orderError}</p>
          )}
          <button
            type="submit"
            disabled={!form.agreed || isPlacingOrder}
            className="w-full bg-[#7e525c] disabled:opacity-50 text-white py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-[#6a3f47] transition"
          >
            {isPlacingOrder ? "PLACING ORDER..." : "PLACE ORDER (COD)"}
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>

        {/* Right: Order Summary */}
        <aside className="bg-white rounded-2xl shadow-sm p-7 flex flex-col gap-0">
          <h2 className="font-serif text-xl font-normal text-[#7e525c] mb-5">
            Order Summary
          </h2>

          {/* Cart Items */}
          <div className="flex flex-col divide-y divide-[#ede9e4]">
            {cartItems.map((item, idx) => {
              const name = item.productId?.name ?? item.name ?? "Product";
              const price = item.price ?? item.productId?.price ?? 0;
              const qty = item.quantity ?? 1;
              const imageRaw =
                item.productId?.image_id?.path ??
                item.image_id?.path ??
                item.productId?.image ??
                item.image ??
                null;
              let imageSrc = "/Images/best-1.svg";
              if (imageRaw) {
                imageSrc = buildProductImageUrl(imageRaw);
              }
              return (
                <div key={idx} className="flex items-center gap-4 py-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#f0ebe4]">
                    <Image
                      src={imageSrc}
                      alt={name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.target.src = "/Images/best-1.svg";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-serif text-base font-normal text-[#1c1c19] leading-snug">
                      {name}
                    </div>
                    <div className="text-[10px] tracking-widest text-[#9a8c87] uppercase mt-0.5">
                      EAU DE PARFUM &bull; {item.size ?? "50ml"}
                    </div>
                    <div className="text-xs text-[#9a8c87] mt-1">
                      Qty: {qty}
                    </div>
                  </div>
                  <div className="text-[#7e525c] font-semibold text-sm shrink-0">
                    PKR {(price * qty).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Promo Code */}
          <div className="flex items-center gap-2 py-4 border-t border-[#ede9e4] mt-1">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Promo Code"
              className="flex-1 bg-transparent text-sm text-[#1c1c19] placeholder:text-[#c5bdb8] focus:outline-none"
            />
            <button
              type="button"
              className="text-[10px] tracking-[0.15em] font-bold text-[#6b6460] uppercase hover:text-[#7e525c] transition"
            >
              APPLY
            </button>
          </div>

          {/* Totals */}
          <div className="flex flex-col gap-3 pt-4 border-t border-[#ede9e4]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6b6460]">Subtotal</span>
              <span className="font-semibold text-[#1c1c19]">
                PKR {subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6b6460]">Shipping</span>
              <span className="inline-flex items-center gap-1 bg-[#f5f0eb] text-[#7e525c] text-[10px] tracking-widest font-bold px-3 py-1 rounded-full uppercase">
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                  <rect
                    x="2"
                    y="7"
                    width="15"
                    height="11"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M17 11h2l3 4v2h-5V11z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="7"
                    cy="19"
                    r="1.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="17"
                    cy="19"
                    r="1.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                COD
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#ede9e4]">
              <span className="font-serif text-base text-[#7e525c]">
                Total Amount
              </span>
              <span className="font-serif text-2xl text-[#7e525c] font-normal">
                PKR {total.toLocaleString()}
              </span>
            </div>
          </div>
        </aside>
      </div>

      {/* Trust Bar */}
      <div className="max-w-5xl mx-auto mt-16 bg-[#ede9e4] rounded-2xl py-10 px-6">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
              <svg
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 24 24"
                className="text-[#7e525c]"
              >
                <rect
                  x="3"
                  y="6"
                  width="14"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M17 10h1.5A2.5 2.5 0 0121 12.5V16h-4V10z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle
                  cx="7"
                  cy="17.5"
                  r="1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle
                  cx="16"
                  cy="17.5"
                  r="1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <div>
              <div className="text-[10px] tracking-[0.2em] font-bold text-[#7e525c] uppercase mb-1">
                COD ONLY
              </div>
              <div className="text-xs text-[#6b6460]">
                Pay only when you hold your essence.
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
              <svg
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 24 24"
                className="text-[#7e525c]"
              >
                <path
                  d="M12 2C8 6 4 7.5 4 12c0 4 3.5 8 8 9 4.5-1 8-5 8-9 0-4.5-4-6-8-10z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <div className="text-[10px] tracking-[0.2em] font-bold text-[#7e525c] uppercase mb-1">
                FREE DELIVERY
              </div>
              <div className="text-xs text-[#6b6460]">
                On all domestic orders over £50.
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
              <svg
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 24 24"
                className="text-[#7e525c]"
              >
                <path
                  d="M12 3l2.5 5.5L20 9.5l-4 4 1 5.5L12 16l-5 3 1-5.5-4-4 5.5-.5L12 3z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <div className="text-[10px] tracking-[0.2em] font-bold text-[#7e525c] uppercase mb-1">
                100% AUTHENTIC
              </div>
              <div className="text-xs text-[#6b6460]">
                Certified artisanal origin guaranteed.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
