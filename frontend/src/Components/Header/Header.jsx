"use client";

import { usePathname, useRouter } from "next/navigation";
import { Heart, Menu, ShoppingCart, Truck, User, X } from "lucide-react";
import Link from "next/link";
import { queryClient, useFavorites, useGetCart } from "@/lib/api";
import { useEffect, useState } from "react";
import logo from "@/public/Images/brand-logo.png"
import Image from "next/image";
import { getCartSnapshot } from "@/lib/cart/getCartSnapshot";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

function PreHeader() {
  const messages = [
    { text: "FREE DELIVERY ON ALL ORDERS ACROSS PAKISTAN", icon: "🚚", highlight: "LIMITED TIME" },
    { text: "PREMIUM QUALITY INSPIRED FRAGRANCES", icon: "✨", highlight: "HANDCRAFTED" },
    { text: "UPTO 30% OFF ON SELECTED COLLECTIONS", icon: "🔥", highlight: "SALE LIVE" },
    { text: "EXPERIENCE THE ESSENCE OF LUXURY", icon: "💎", highlight: "PURE OIL" },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-[#633e47] via-[#7e525c] to-[#633e47] py-2 overflow-hidden border-b border-white/5 shadow-sm">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        speed={1000}
        className="w-full h-full"
      >
        {messages.map((item, idx) => (
          <SwiperSlide key={idx}>
            <div className="flex items-center justify-center gap-2 md:gap-4 text-white py-1">
              {/* Highlight Tag */}
              <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-white/10 text-[8px] font-bold tracking-widest border border-white/20">
                {item.highlight}
              </span>

              <div className="flex items-center gap-2 text-[9px] md:text-[11px] font-medium tracking-[0.25em] uppercase">
                <span className="text-sm md:text-base animate-pulse">{item.icon}</span>
                <span className="drop-shadow-sm">{item.text}</span>
                <span className="text-sm md:text-base animate-pulse">{item.icon}</span>
              </div>

              <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-white/10 text-[8px] font-bold tracking-widest border border-white/20">
                {item.highlight}
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: cartData } = useGetCart();
  const { data: wishlistProducts = [] } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isActive = (href) => {
    return pathname === href ? "active" : "";
  };

  const cartItems = getCartSnapshot(cartData).items;
  const cartCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity ?? 1),
    0,
  );
  const wishlistCount = Array.isArray(wishlistProducts)
    ? wishlistProducts.length
    : 0;

  useEffect(() => {
    const syncAuthState = () => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      setIsLoggedIn(Boolean(token));
    };

    syncAuthState();
    window.addEventListener("storage", syncAuthState);
    return () => window.removeEventListener("storage", syncAuthState);
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("ahm_checkout_profile");
    }
    queryClient.setQueryData(["cart"], []);
    queryClient.setQueryData(["favorites"], []);
    queryClient.removeQueries({ queryKey: ["cart"] });
    queryClient.removeQueries({ queryKey: ["favorites"] });
    setIsLoggedIn(false);
    router.replace("/");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/collections", label: "Collections" },
    { href: "/mens", label: "Men" },
    { href: "/womens", label: "Women" },
  ];

  return (
    <>
      <PreHeader />
      <header className="header">
        <Link href="/" className="logo flex items-center justify-center">
          <Image
            src={logo}
            alt="logo"
            width={100}
            height={100}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-icons">

          <Link href="/wishlist" className="wishlist-icon-wrapper group">
            <Heart
              size={30}
              fill={pathname === "/wishlist" ? "#7e525c" : "none"}
              stroke="#7e525c"
              strokeWidth={2}
              className="transition-colors"
            />
            {wishlistCount > 0 && (
              <span className="wishlist-count">{wishlistCount}</span>
            )}
          </Link>
          <div className="relative group">
            {isLoggedIn ? (
              <button
                type="button"
                aria-label="User menu"
                className="inline-flex items-center justify-center"
              >
                <User size={30} fill="#7e525c" stroke="#7e525c" strokeWidth={2} />
              </button>
            ) : (
              <Link href="/auth/login" aria-label="Go to login">
                <User
                  size={30}
                  fill={pathname === "/auth/login" ? "#7e525c" : "none"}
                  stroke="#7e525c"
                  strokeWidth={2}
                />
              </Link>
            )}
            {isLoggedIn && (
              <div className="absolute right-0 top-full mt-1 z-50 min-w-[150px] rounded-xl border border-border bg-white shadow-lg py-2
               opacity-0 invisible translate-y-1 transition-all duration-150 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm font-manrope text-foreground hover:bg-background"
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm font-manrope text-error hover:bg-background"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          <Link href="/cart" className="cart-icon-wrapper">
            <ShoppingCart
              size={30}
              fill={pathname === "/cart" ? "#7e525c" : "none"}
              stroke="#7e525c"
              strokeWidth={2}
            />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
          <Link href="/track-order" className="wishlist-icon-wrapper group" title="Track Order">
            <Truck
              size={30}
              fill={pathname === "/track-order" ? "#7e525c" : "none"}
              stroke="#7e525c"
              strokeWidth={2}
              className="transition-colors"
            />
          </Link>
          {/* Hamburger Button — visible only on mobile */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X size={24} color="#7e525c" />
            ) : (
              <Menu size={24} color="#7e525c" />
            )}
          </button>
        </div>
      </header>


      {menuOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMenuOpen(false)}>
          <nav className="mobile-nav" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-nav-header">
              <span className="logo" style={{ fontSize: "20px" }}>
                AHM Fragrances
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={22} color="#7e525c" />
              </button>
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`mobile-nav-link ${isActive(link.href)}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
