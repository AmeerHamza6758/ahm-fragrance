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
          <Link href="/mens">Men's Collection</Link>
          <Link href="/womens">Women's Collection</Link>
          <Link href="/collections">Gift Sets</Link>
          <Link href="/collections">New Arrivals</Link>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <Link href="/about-us">About Us</Link>
          <Link href="/contact-us">Contact Us</Link>
          <Link href="/company/privacy-policy">Privacy Policy</Link>
          <Link href="/company/terms-of-service">Terms of Service</Link>
          <Link href="/company/shipping-returns">Shipping &amp; Returns</Link>
        </div>

        <div className="footer-col">
          <h4>Connect</h4>
          <a href="tel:03044524449">03044524449</a>
          <a href="mailto:ahmfragrance@gmail.com">ahmfragrance@gmail.com</a>
          <div className="flex gap-4 mt-1">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#7e525c] transition-colors">Instagram</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#7e525c] transition-colors">Facebook</a>
          </div>
          
          <div className="mt-6">
            <h4 className="!mb-3">Join Fragrance Circle</h4>
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
