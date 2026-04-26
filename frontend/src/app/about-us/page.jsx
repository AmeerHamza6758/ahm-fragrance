"use client";

import Image from "next/image";
import Link from "next/link";
import for_him from "/public/Images/for-him.svg";
import for_her from "/public/Images/for-her.svg";
import about_bg from "/public/Images/Background.jpg.jpeg";

export default function AboutUsPage() {
  return (
    <main className="bg-[#fdf9f5] w-full min-h-screen page-main-spacing">
      {/* Hero Section with Text Overlay */}
      <section className="relative w-full h-125 sm:h-150 md:h-175 flex items-center justify-center overflow-hidden">
        <Image
          src={about_bg}
          alt="Our Story Background"
          fill
          className="object-cover object-center z-0"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 z-10"></div>

        {/* Text Content */}
        <div className="relative z-20 text-center px-4 sm:px-8 max-w-2xl mx-auto">
          <h1
            className="text-[#FFD9DF] text-5xl sm:text-6xl md:text-7xl font-serif mb-6"
            style={{
              fontFamily: "Noto Serif, Georgia, serif",
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            Our Story
          </h1>
          <p className="text-white/90 text-lg sm:text-xl md:text-2xl font-light leading-relaxed">
            Born from a passion for luxury fragrance — made affordable for
            everyone in Pakistan.
          </p>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center bg-[#fdf9f5]">
        <div className=" ">
          <Image
            src="/Images/best-1.svg"
            alt="Premium Fragrance Bottle"
            width={420}
            height={420}
            className="w-full h-90.5  object-cover rounded-tr-[48px] rounded-bl-[48px] rounded-tl-none rounded-br-none"
            priority
          />
        </div>
        <div>
          <div
            className="uppercase tracking-[2.5px] text-xs text-[#a08a8a] font-semibold mb-2"
            style={{ letterSpacing: 2.5 }}
          >
            Who we are
          </div>
          <h2
            className="text-[#1c1c19] text-3xl md:text-4xl font-serif mb-4"
            style={{
              fontFamily: "Noto Serif, Georgia, serif",
              fontWeight: 600,
            }}
          >
            More Than Just a Fragrance
          </h2>
          <p className="text-[#4e4543] text-base md:text-lg leading-relaxed mb-4">
            At AHM Fragrances, we believe that luxury should be an experience
            accessible to all. Our journey began in the heart of Lahore, fueled
            by the desire to bridge the gap between high-end international
            scents and the local market.
            <br />
            <br />
            We source the finest botanical essences and rare oils from around
            the globe, hand-blending each batch to ensure the longevity and
            projection expected from the world’s most prestigious perfume
            houses.
          </p>
          <blockquote
            className="italic text-[#7e525c] text-base md:text-lg mt-4 border-l-4 border-[#ede6e1] pl-4"
            style={{ fontFamily: "Noto Serif, Georgia, serif" }}
          >
            “Every scent tells a story. What’s yours?”
          </blockquote>
        </div>
      </section>

      {/* Mission Section */}
      <section className="w-full py-16 bg-[#a07b86] flex flex-col items-center justify-center">
        <div
          className="uppercase tracking-[2.5px] text-xs text-[#f7e7e7] font-semibold mb-2"
          style={{ letterSpacing: 2.5 }}
        >
          Our Mission
        </div>
        <h2
          className="text-white text-2xl sm:text-4xl md:text-5xl font-serif text-center mb-6 px-4"
          style={{ fontFamily: "Noto Serif, Georgia, serif", fontWeight: 600 }}
        >
          Luxury Fragrance.
          <br />
          Affordable Price.
        </h2>
        <div className="bg-white/10 rounded-2xl px-4 sm:px-8 py-6 max-w-2xl mx-4 sm:mx-auto">
          <p className="text-[#f7e7e7] text-base sm:text-lg text-center font-normal">
            To redefine the olfactory landscape of Pakistan by crafting premium,
            world-class fragrances that inspire confidence and elegance, without
            the luxury markup.
          </p>
        </div>
      </section>

      {/* Promise Bar */}
      <section className="w-full py-14 bg-[#fcf7f3]">
        <h3
          className="text-center text-2xl md:text-3xl font-serif mb-10 text-[#1c1c19]"
          style={{ fontFamily: "Noto Serif, Georgia, serif", fontWeight: 600 }}
        >
          The AHM Promise
        </h3>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4">
          <div className="bg-white rounded-2xl shadow-md border border-[#ede6e1] flex flex-col items-center p-6">
            <span className="block w-10 h-10 mb-3">
              <svg
                width="32"
                height="32"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#7e525c"
                strokeWidth="1.8"
              >
                <path
                  d="M12 20v-6m0 0V4m0 10l3-3m-3 3l-3-3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="3"
                  y="12"
                  width="18"
                  height="8"
                  rx="2"
                  stroke="#7e525c"
                  strokeWidth="1.8"
                />
              </svg>
            </span>
            <h4
              className="font-semibold text-[#1c1c19] mb-1"
            >
              Authentic Ingredients
            </h4>
            <p className="text-[#4e4543] text-sm text-center">
              Pure botanical extracts and premium oils sourced worldwide.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-[#ede6e1] flex flex-col items-center p-6">
            <span className="block w-10 h-10 mb-3">
              <svg
                width="32"
                height="32"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#7e525c"
                strokeWidth="1.8"
              >
                <rect
                  x="3"
                  y="7"
                  width="18"
                  height="13"
                  rx="2"
                  stroke="#7e525c"
                  strokeWidth="1.8"
                />
                <path
                  d="M16 3v4M8 3v4M3 11h18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h4
              className="font-semibold text-[#1c1c19] mb-1"
            >
              Fast Delivery
            </h4>
            <p className="text-[#4e4543] text-sm text-center">
              Express shipping across all major cities in Pakistan.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-[#ede6e1] flex flex-col items-center p-6">
            <span className="block w-10 h-10 mb-3">
              <svg
                width="32"
                height="32"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#7e525c"
                strokeWidth="1.8"
              >
                <rect
                  x="3"
                  y="7"
                  width="18"
                  height="13"
                  rx="2"
                  stroke="#7e525c"
                  strokeWidth="1.8"
                />
                <path
                  d="M12 11v4m0 0l2-2m-2 2l-2-2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h4
              className="font-semibold text-[#1c1c19] mb-1"
            >
              7-Day Return
            </h4>
            <p className="text-[#4e4543] text-sm text-center">
              Hassle-free returns if our scent doesn’t speak to you.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-[#ede6e1] flex flex-col items-center p-6">
            <span className="block w-10 h-10 mb-3">
              <svg
                width="32"
                height="32"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#7e525c"
                strokeWidth="1.8"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#7e525c"
                  strokeWidth="1.8"
                />
                <path
                  d="M12 8v4l3 3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h4
              className="font-semibold text-[#1c1c19] mb-1"
            >
              Customer Support
            </h4>
            <p className="text-[#4e4543] text-sm text-center">
              Dedicated fragrance consultants available 24/7.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-12 text-center text-[#a07b86] text-sm sm:text-lg font-semibold px-4">
          <div className="min-w-25">
            <span className="text-xl sm:text-2xl font-bold text-[#7e525c]">
              500+
            </span>
            <br />
            HAPPY CUSTOMERS
          </div>
          <div className="min-w-25">
            <span className="text-xl sm:text-2xl font-bold text-[#7e525c]">
              20+
            </span>
            <br />
            LUXURY FRAGRANCES
          </div>
          <div className="min-w-25">
            <span className="text-xl sm:text-2xl font-bold text-[#7e525c]">
              PAK
            </span>
            <br />
            NATIONWIDE DELIVERY
          </div>
          <div className="min-w-25">
            <span className="text-xl sm:text-2xl font-bold text-[#7e525c]">
              4.8
            </span>
            <br />
            AVERAGE RATING
          </div>
        </div>
      </section>

      {/* Explore Our Fragrances - Gender Cards */}
      <section className="w-full pt-16 pb-24 bg-[#fdf9f5]">
        <h2
          className="text-center text-[2.7rem] md:text-5xl font-serif mb-12 text-[#1c1c19] font-normal"
          style={{ fontFamily: "Noto Serif, Georgia, serif", fontWeight: 400 }}
        >
          Explore Our Fragrances
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-4">
          {/* For Him Card */}
          <div
            className="rounded-[2.5rem] overflow-hidden shadow-xl bg-black relative flex flex-col justify-end min-h-[480px] h-full"
            style={{ background: "#18171c" }}
          >
            <Image
              src={for_him}
              alt="For Him Collection"
              fill
              className="object-cover object-center absolute inset-0 z-0"
              priority
            />
            <div className="absolute inset-0 bg-black/40 z-10" />
            <div className="relative z-20 p-8 pb-10 flex flex-col h-full justify-end">
              <div
                className="uppercase text-[13px] tracking-[3px] mb-1 font-normal text-[#b48b9b]"
                style={{
                  letterSpacing: 3,
                }}
              >
                COLLECTIONS
              </div>
              <h3
                className="text-white font-serif text-3xl md:text-4xl mb-4 font-normal"
                style={{
                  fontFamily: "Noto Serif, Georgia, serif",
                  fontWeight: 400,
                }}
              >
                For Him
              </h3>
              <Link href="/mens" className="block mt-2">
                <button
                  className="w-55 text-[14px] rounded-full bg-white text-[#18171c] font-semibold text-base py-3 px-0 tracking-wide shadow-md hover:bg-gray-100 transition-colors duration-200"
                >
                  SHOP THE COLLECTION
                </button>
              </Link>
            </div>
          </div>
          {/* For Her Card */}
          <div className="rounded-[2.5rem] overflow-hidden shadow-xl bg-[#f7e6e7] relative flex flex-col justify-end min-h-120 h-full">
            <Image
              src={for_her}
              alt="For Her Collection"
              fill
              className="object-cover object-center absolute inset-0 z-0"
              priority
            />
            <div className="absolute inset-0 bg-[#f7e6e7]/60 z-10" />
            <div className="relative z-20 p-8 pb-10 flex flex-col h-full justify-end">
              <div
                className="uppercase text-[13px] tracking-[3px] mb-1 font-normal text-[#b48b9b]"
                style={{
                  letterSpacing: 3,
                }}
              >
                COLLECTIONS
              </div>
              <h3
                className="text-white font-serif text-3xl md:text-4xl mb-4 font-normal"
                style={{
                  fontFamily: "Noto Serif, Georgia, serif",
                  fontWeight: 400,
                }}
              >
                For Her
              </h3>
              <Link href="/womens" className="block mt-2">
                <button
                  className="w-55 text-[14px] rounded-full bg-white text-[#18171c] font-semibold text-base py-3 px-0 tracking-wide shadow-md hover:bg-gray-100 transition-colors duration-200"
                >
                  SHOP THE COLLECTION
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
