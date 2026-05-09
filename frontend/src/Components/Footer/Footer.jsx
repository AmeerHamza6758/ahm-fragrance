"use client";

import { useState } from "react";
import Link from "next/link";
import { joinFragranceCircle } from "@/lib/api/endpoints/circle";
import { successToaster, warningToaster, errorToaster } from "@/utils/alert-service";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      warningToaster("Please enter your email address to join.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await joinFragranceCircle(email);
      successToaster(res.message || "You have successfully joined the Fragrance Circle.");
      setEmail("");
    } catch (error) {
      errorToaster(error.response?.data?.message || "Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="footer relative">
      <div className="footer-top">
        <div className="footer-col footer-brand">
          <h3>AHM Fragrances</h3>
          <p>
            AHM Fragrances brings the world of luxury scents to Pakistan with an
            emphasis on quality and longevity.
          </p>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <Link href="/mens">Men&apos;s Collection</Link>
          <Link href="/womens">Women&apos;s Collection</Link>
          <Link href="/collections">Gift Sets</Link>
          <Link href="/collections">New Arrivals</Link>
        </div>

        <div className="footer-col footer-company">
          <h4>Company</h4>
          <Link href="/about-us">About Us</Link>
          <Link href="/contact-us">Contact Us</Link>
          <Link href="/company/privacy-policy">Privacy Policy</Link>
          <Link href="/company/terms-of-service">Terms of Service</Link>
          <Link href="/company/shipping-returns">Shipping &amp; Returns</Link>
        </div>

        <div className="footer-col footer-connect">
          <h4 className="mb-6!">Connect With Us</h4>
          
          <div className="flex flex-wrap gap-3 items-center">
            {/* Phone */}
            <a href="tel:03044524449" className="w-12 h-12 rounded-full bg-[#7e525c] text-white flex items-center justify-center cursor-default" aria-label="Call Us">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.11-.27 11.72 11.72 0 0 0 3.7.59 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A19 19 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.72 11.72 0 0 0 .59 3.7 1 1 0 0 1-.27 1.11l-2.2 2.2z"/>
              </svg>
            </a>

            {/* Email */}
            <a href="mailto:ahmfragrance@gmail.com" className="w-12 h-12 rounded-full bg-[#7e525c] text-white flex items-center justify-center cursor-default" aria-label="Email Us">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a href="https://www.instagram.com/ahmfrangrances?igsh=MXJsdGNnYjJ6Y2h4cg==" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#7e525c] text-white flex items-center justify-center" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a href="https://www.facebook.com/share/186oNKVfZP/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#7e525c] text-white flex items-center justify-center" aria-label="Facebook">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
          </div>

          <div className="mt-6">
            <h4 className="mb-3!">Join Fragrance Circle</h4>
            <form onSubmit={handleSubmit} className="flex flex-row items-center gap-0 max-w-[320px]">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white/5 border border-white/20 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:border-[#7e525c] transition-all min-w-0"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-[#7e525c] text-white px-4 py-[9px] rounded-r-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#6a4450] transition-all disabled:opacity-50 whitespace-nowrap"
                disabled={isLoading}
              >
                {isLoading ? "..." : "Join"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 AHM Fragrances. Curated Botanical Luxury.</p>
      </div>
    </footer>
  );
}
