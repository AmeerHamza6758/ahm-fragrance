"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Truck, Search, Package, Calendar, MapPin, CheckCircle2, ChevronDown, ChevronUp, History, CreditCard, Clock, X } from "lucide-react";
import { useTrackOrder } from "@/lib/api";
import { errorToaster } from "@/utils/alert-service";
import { buildProductImageUrl } from "@/lib/utils/imageUrl";

function OrderCard({ order, defaultExpanded = false }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getStatusStep = (status) => {
    const steps = ["pending", "confirmed", "shipped", "delivered"];
    const index = steps.indexOf(status?.toLowerCase());
    if (index === -1) {
      if (status?.toLowerCase() === 'cancelled') return -1;
      return 0;
    }
    return index;
  };

  const statusColors = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    confirmed: "bg-blue-50 text-blue-600 border-blue-100",
    shipped: "bg-indigo-50 text-indigo-600 border-indigo-100",
    delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
    cancelled: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(126,82,92,0.05)] border border-[#f0ebe5] overflow-hidden transition-all duration-500 hover:shadow-[0_8px_30px_rgba(126,82,92,0.08)] mb-6">
      {/* Summary Header */}
      <div
        className="p-3 md:p-6 cursor-pointer flex flex-wrap items-center justify-between gap-1 sm:gap-6 md:gap-10"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-1 sm:gap-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${order.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-[#7e525c]/5 text-[#7e525c]'}`}>
            <Package size={24} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#9a8c87] uppercase tracking-[0.2em] mb-1.5">Order Reference</p>
            <h3 className="text-sm font-semibold md:font-normal md:text-2xl font-serif text-[#1c1c19] tracking-tight">#{order.orderNumber}</h3>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-1 sm:gap-6 md:gap-12">
          <div className="hidden lg:block">
            <p className="text-[10px] font-bold text-[#9a8c87] uppercase tracking-[0.2em] mb-1.5">Date Placed</p>
            <p className="text-sm font-medium text-[#1c1c19]">{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-[10px] font-bold text-[#9a8c87] uppercase tracking-[0.2em] mb-1.5">Total Amount</p>
            <p className="text-sm font-bold text-[#7e525c]">PKR {order.totalAmount?.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className=" hidden sm:block text-[10px] font-bold text-[#9a8c87] uppercase tracking-[0.2em] mb-1.5">Current Status</p>
            <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${statusColors[order.orderStatus?.toLowerCase()] || "bg-gray-50 text-gray-600"}`}>
              {order.orderStatus}
            </span>
          </div>
          <div className="text-[#9a8c87] transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(0deg)' }}>
            {isExpanded ? <ChevronUp size={24} strokeWidth={1.5} /> : <ChevronDown size={24} strokeWidth={1.5} />}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-6 md:px-10 pb-10 border-t border-[#f0ebe5] animate-in slide-in-from-top-4 duration-500">
          {/* Progress Timeline */}
          {order.orderStatus !== 'cancelled' ? (
            <div className="py-8 md:py-16 max-w-3xl mx-auto w-full overflow-hidden">
              <div className="relative px-2">
                {/* Background Line */}
                <div className="absolute top-[14px] md:top-[18px] left-[10%] right-[10%] h-[2px] bg-[#f0ebe5]"></div>

                {/* Active Line */}
                <div
                  className="absolute top-[14px] md:top-[18px] left-[10%] h-[2px] bg-[#7e525c] transition-all duration-1000 ease-out"
                  style={{ width: `${Math.max(0, (getStatusStep(order.orderStatus) / 3) * 80)}%` }}
                ></div>

                <div className="flex justify-between relative z-10">
                  {["Pending", "Confirmed", "Shipped", "Delivered"].map((step, idx) => {
                    const statusIdx = getStatusStep(order.orderStatus);
                    const active = statusIdx >= idx;
                    const isCurrent = statusIdx === idx;

                    return (
                      <div key={step} className="flex flex-col items-center flex-1">
                        <div className={`
                            relative w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center border-2 transition-all duration-700
                            ${active ? 'bg-[#7e525c] border-[#7e525c] shadow-[0_0_15px_rgba(126,82,92,0.2)]' : 'bg-white border-[#f0ebe5]'}
                            ${isCurrent ? 'scale-110 md:scale-125 z-20 ring-4 ring-[#7e525c]/10' : ''}
                          `}>
                          {active ? <CheckCircle2 size={14} className="md:size-[18px]" color="white" /> : <Clock size={12} className="md:size-[16px] text-[#f0ebe5]" />}
                        </div>
                        <div className="text-center mt-2 md:mt-4">
                          <span className={`text-[8px] md:text-[11px] font-bold uppercase tracking-[0.1em] md:tracking-[0.15em] block transition-colors duration-500 ${active ? 'text-[#7e525c]' : 'text-[#b8a9a7]'}`}>
                            {step}
                          </span>
                          {isCurrent && (
                            <span className="text-[7px] md:text-[9px] text-[#7e525c]/60 font-medium italic">Currently</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50/50 text-red-600 p-6 rounded-2xl text-center font-bold uppercase tracking-[0.2em] text-xs my-10 border border-red-100">
              <span className="flex items-center justify-center gap-2">
                <X size={16} /> This order was cancelled
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Products */}
            <div className="lg:col-span-2 space-y-5">
              <div className="flex items-center gap-3 mb-4">
                <h4 className="text-[11px] font-bold text-[#1c1c19] uppercase tracking-[0.2em]">Order Composition</h4>
                <div className="h-px flex-1 bg-[#f0ebe5]"></div>
              </div>
              {order.products.map((item, idx) => (
                <div key={idx} className="group flex items-center justify-between py-5 border-b border-[#f0ebe5] last:border-0 hover:bg-[#7e525c]/[0.01] px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-5">
                    <div className="relative w-20 h-20 rounded-2xl bg-[#F9F6F2] overflow-hidden border border-[#f0ebe5] shrink-0 transition-transform group-hover:scale-105 duration-300">
                      <Image
                        src={buildProductImageUrl(item.productId?.image_id?.[0]?.path)}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-base font-serif text-[#1c1c19] mb-1">{item.name}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-[#9a8c87] uppercase tracking-wider bg-[#f0ebe5]/50 px-2 py-0.5 rounded">{item.size}</span>
                        <span className="text-xs text-[#9a8c87]">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#1c1c19]">PKR {item.total?.toLocaleString()}</p>
                    <p className="text-[10px] text-[#9a8c87] mt-1">{item.quantity} x {item.price?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery & Billing */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <h4 className="text-[11px] font-bold text-[#1c1c19] uppercase tracking-[0.2em]">Shipment Logistics</h4>
                  <div className="h-px flex-1 bg-[#f0ebe5]"></div>
                </div>
                <div className="bg-[#FDF9F5] border border-[#f0ebe5] rounded-[1.5rem] p-6 space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#7e525c] shrink-0 border border-[#f0ebe5]">
                      <MapPin size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-[#9a8c87] uppercase tracking-widest mb-1">Destination</p>
                      <p className="text-sm leading-relaxed text-[#4e4543]">
                        <span className="font-bold text-[#1c1c19] block mb-0.5">{order.customerInfo.name}</span>
                        {order.customerInfo.address}<br />
                        {order.customerInfo.city}, {order.customerInfo.province}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#7e525c] shrink-0 border border-[#f0ebe5]">
                      <CreditCard size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-[#9a8c87] uppercase tracking-widest mb-1">Payment Method</p>
                      <p className="text-sm font-bold text-[#1c1c19] uppercase tracking-wider">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#f0ebe5]">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[11px] font-medium text-[#6b6460] uppercase tracking-wider">Subtotal</span>
                      <span className="text-sm font-medium text-[#1c1c19]">PKR {order.subtotal?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-5">
                      <span className="text-[11px] font-medium text-[#6b6460] uppercase tracking-wider">Shipping</span>
                      <span className="text-sm font-medium text-emerald-600">Free</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#f0ebe5]">
                      <span className="text-xs font-bold text-[#1c1c19] uppercase tracking-[0.1em]">Grand Total</span>
                      <span className="text-xl font-bold text-[#7e525c]">PKR {order.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("orderNumber") || "");
  const [contact, setContact] = useState(searchParams.get("contact") || "");
  const [results, setResults] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { mutate: track, isPending } = useTrackOrder();

  const handleTrack = (e, oNum, cInfo, isAuthOverride) => {
    if (e) e.preventDefault();
    const finalOrderNumber = oNum !== undefined ? oNum : orderNumber;
    const finalContact = cInfo !== undefined ? cInfo : contact;
    const isAuth = isAuthOverride !== undefined ? isAuthOverride : isLoggedIn;

    // Validation for Guest
    if (!isAuth && (!finalOrderNumber || !finalContact)) {
      errorToaster("Please provide both Order Number and Contact info.");
      return;
    }

    track({
      orderNumber: finalOrderNumber.trim(),
      contact: finalContact.trim()
    }, {
      onSuccess: (res) => {
        setResults(res.data);
      },
      onError: (err) => {
        if (e || !isAuth) {
          errorToaster(err.response?.data?.message || "Could not retrieve orders.");
        }
        setResults([]);
      }
    });
  };

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const hasToken = Boolean(token);
    setIsLoggedIn(hasToken);

    if (hasToken) {
      handleTrack(null, "", "", true);
    } else if (searchParams.get("orderNumber") && searchParams.get("contact")) {
      handleTrack(null, searchParams.get("orderNumber"), searchParams.get("contact"), false);
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-background pt-6 pb-10 md:pt-10 md:pb-16">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center pb-12">
          <h1 className="text-[#7e525c] text-4xl sm:text-5xl md:text-6xl font-serif font-normal mb-8 tracking-tight">
            {isLoggedIn ? "Order Dashboard" : "Track Your Order"}
          </h1>
          <div className="flex items-center justify-center gap-4">
            <span className="block h-px w-8 md:w-16 bg-[#e8e2dc]" />
            <p className="text-[#4e4543] text-[9px] md:text-[11px] uppercase tracking-[0.3em] font-bold max-w-[280px] md:max-w-none">
              {isLoggedIn
                ? "Your artisanal fragrance journey history"
                : "Locate your shipment in our delivery network"}
            </p>
            <span className="block h-px w-8 md:w-16 bg-[#e8e2dc]" />
          </div>
        </div>

        {/* Search Bar */}
        <div className={`mb-12 transition-all duration-700 px-2 ${!isLoggedIn ? 'max-w-2xl mx-auto' : 'max-w-5xl mx-auto'}`}>
          <form onSubmit={handleTrack} className="bg-white p-1 md:p-2 rounded-2xl shadow-[0_10px_40px_rgba(126,82,92,0.08)] border border-[#f0ebe5] flex flex-wrap sm:flex-nowrap gap-2 group focus-within:border-[#7e525c]/30 transition-all">
            <div className="flex-1 flex items-center px-2 gap-2">
              <input
                type="text"
                placeholder={isLoggedIn ? "Find by Order Number..." : "AHM-2026-001"}
                className="w-full py-3.5 bg-transparent focus:outline-none text-[#1c1c19] text-sm font-medium placeholder:text-[#ccc5be]"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
              />
            </div>
            {!isLoggedIn && (
              <div className="flex-1 flex items-center px-5 border-t sm:border-t-0 sm:border-l border-[#f0ebe5]">
                <input
                  type="text"
                  placeholder="Email or Phone"
                  className="w-full py-3.5 bg-transparent focus:outline-none text-[#1c1c19] text-sm font-medium placeholder:text-[#ccc5be]"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
            )}
            <button
              type="submit"
              disabled={isPending}
              className="bg-[#7e525c] flex items-center justify-center gap-2 text-white w-full sm:w-auto px-6 py-3.5 rounded-[1.5rem] font-bold uppercase tracking-widest text-xs hover:bg-[#6a4450] hover:shadow-lg transition-all disabled:opacity-50 active:scale-95"
            >
              <Search size={18} />
              <span>{isPending ? "Searching..." : (isLoggedIn ? "Search History" : "Track Shipment")}</span>
            </button>
          </form>
        </div>

        {/* Results List */}
        <div className="space-y-8 min-h-[400px]">
          {isPending && !results && (
            <div className="flex flex-col items-center justify-center py-24 animate-pulse">
              <div className="w-16 h-16 border-2 border-[#7e525c]/10 border-t-[#7e525c] rounded-full animate-spin mb-6"></div>
              <p className="text-[#9a8c87] font-bold uppercase tracking-[0.4em] text-[10px]">Retrieving Records</p>
            </div>
          )}

          {results && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              {Array.isArray(results) ? (
                results.length > 0 ? (
                  results.map((order, idx) => (
                    <OrderCard key={order._id} order={order} defaultExpanded={idx === 0} />
                  ))
                ) : (
                  <div className="bg-white rounded-[2.5rem] p-24 text-center border border-[#f0ebe5] shadow-sm">
                    <div className="w-20 h-20 bg-[#FDF9F5] rounded-full flex items-center justify-center mx-auto mb-8">
                      <Search size={32} className="text-[#ccc5be]" />
                    </div>
                    <h3 className="text-xl font-serif text-[#1c1c19] mb-2">No Records Found</h3>
                    <p className="text-sm text-[#9a8c87] max-w-xs mx-auto">We couldn't find any orders matching those details. Please verify your reference number.</p>
                  </div>
                )
              ) : (
                <OrderCard order={results} defaultExpanded={true} />
              )}
            </div>
          )}

          {!isLoggedIn && !results && !isPending && (
            <div className="flex flex-col items-center justify-center py-20 opacity-30 select-none grayscale">
              <Truck size={80} strokeWidth={1} className="mb-6 text-[#9a8c87]" />
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#9a8c87]">Awaiting your details</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FDF9F5] text-[#7e525c] font-bold uppercase tracking-widest animate-pulse">Initializing Portal...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
