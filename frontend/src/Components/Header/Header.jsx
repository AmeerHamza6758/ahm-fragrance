"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Heart, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useFavorites, useGetCart } from "@/lib/api";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: cartData } = useGetCart();
  const { data: wishlistProducts = [] } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthPage = pathname?.startsWith("/auth/");

  const isActive = (href) => {
    return pathname === href ? "active" : "";
  };

  const cartItems = Array.isArray(cartData)
    ? cartData
    : (cartData?.items ?? cartData?.data?.items ?? []);
  const cartCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity ?? 1),
    0,
  );
  const wishlistCount = Array.isArray(wishlistProducts)
    ? wishlistProducts.length
    : 0;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/collections", label: "Collections" },
    { href: "/mens", label: "Men" },
    { href: "/womens", label: "Women" },
    // { href: "/about-us", label: "About Us" },
    // { href: "/contact-us", label: "Contact Us" },
  ];

  if (isAuthPage) {
    return (
      <header className="header">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                router.back();
              } else {
                router.push("/");
              }
            }}
            aria-label="Go back"
            className="inline-flex items-center justify-center"
          >
            <ArrowLeft size={24} color="#7e525c" />
          </button>
          <Link href="/" className="logo">
            AHM Fragrances
          </Link>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="header">
        <div className="logo">AHM Fragrances</div>

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
          <Link href="/cart" className="cart-icon-wrapper">
            <Image
              src="/Icons/cart_icon.svg"
              alt="Shopping Bag"
              width={20}
              height={20}
            />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
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

      {/*
        Rendered OUTSIDE <header> — the header has backdrop-filter which creates a
        CSS stacking context, trapping any position:fixed child inside the header bounds.
        As a sibling element this renders correctly over the full viewport.
      */}
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
