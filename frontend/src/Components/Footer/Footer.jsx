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
      {/* Decorative Wave Divider - More Prominent Height */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform -translate-y-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-32 rotate-180 opacity-40">
          <path fill="#7E525C" opacity="0.1" d="M473,67.3c-203.9,88.3-263.1-34-320.3,0C66,119.1,0,59.7,0,59.7V0h1000v59.7 c0,0-62.1,26.1-94.9,29.3c-32.8,3.3-62.8-12.3-75.8-22.1C806,49.6,745.3,8.7,694.9,4.7S492.4,59,473,67.3z"></path>
          <path fill="#7E525C" opacity="0.2" d="M734,67.3c-45.5,0-77.2-23.2-129.1-39.1c-28.6-8.7-150.3-10.1-254,39.1 s-91.7-34.4-149.2,0C115.7,118.3,0,39.8,0,39.8V0h1000v36.5c0,0-28.2-18.5-92.1-18.5C810.2,18.1,775.7,67.3,734,67.3z"></path>
          <path fill="#7E525C" opacity="0.3" d="M766.1,28.9c-200-57.5-266,65.5-395.1,19.5C242,1.8,242,5.4,184.8,20.6C128,35.8,132.3,44.9,89.9,52.5C28.6,63.7,0,0,0,0 h1000c0,0-9.9,40.9-83.6,48.1S829.6,47,766.1,28.9z"></path>
        </svg>
      </div>

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
