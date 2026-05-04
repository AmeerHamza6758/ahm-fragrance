import { getCMSContent } from "@/lib/api/endpoints/cms";
import Image from "next/image";
import about_bg from "/public/Images/Background.jpg.jpeg";
import { notFound } from "next/navigation";

export default async function AboutUsPage() {
  const data = await getCMSContent('about-us');

  // Fallback to static if no CMS data exists (optional, but good for SEO/initial state)
  if (!data || !data.content) {
    // If you want it to be STRICTLY dynamic, return notFound()
    // return notFound();
  }

  return (
    <main className="bg-[#fdf9f5] w-full min-h-screen page-main-spacing">
      {/* Hero Section */}
      <section className="relative w-full h-125 sm:h-150 md:h-175 flex items-center justify-center overflow-hidden">
        <Image
          src={about_bg}
          alt="Our Story Background"
          fill
          className="object-cover object-center z-0"
          priority
        />
        <div className="absolute inset-0 bg-black/30 z-10"></div>
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

      {/* Dynamic or Fallback Content Body */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-24 bg-[#fdf9f5]">
        {data?.content && data.content !== '<p><br></p>' ? (
          <div 
            className="cms-content-render"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        ) : (
          <div className="cms-content-render">
            <h2 className="text-[#1c1c19] text-4xl font-serif mb-8" style={{ fontFamily: "Noto Serif, Georgia, serif" }}>
              Our Narrative
            </h2>
            <p className="mb-8">
              At AHM Fragrances, we believe that scent is a silent language — a
              profound expression of identity and emotion. Founded in the heart of
              Pakistan, our journey began with a singular vision: to craft
              world-class fragrances that are as accessible as they are
              extraordinary.
            </p>
            <p className="mb-8">
              We meticulously source the finest botanical extracts and premium oils
              from across the globe, blending traditional artisanal techniques with
              modern olfactory innovation. Each bottle in our collection is more
              than a perfume; it is a meticulously curated sensory experience, 
              designed to evoke memories and inspire confidence.
            </p>
            <blockquote className="italic border-l-4 border-[#7e525c] pl-6 py-2 my-10 text-xl text-[#7e525c]">
              "Luxury shouldn't be a distant dream. It should be the essence you 
              carry with you every day."
            </blockquote>
            <p>
              Our commitment to excellence extends beyond the fragrance itself. From
              our sustainable sourcing practices to our dedicated customer service, 
              we strive to redefine the standards of the Pakistani fragrance 
              industry, one bottle at a time.
            </p>
          </div>
        )}
      </section>

      {/* The AHM Promise (Kept as static brand elements) */}
      <section className="w-full py-20 bg-[#fcf7f3] border-t border-[#ede6e1]">
        <h3
          className="text-center text-3xl md:text-4xl font-serif mb-16 text-[#1c1c19]"
          style={{ fontFamily: "Noto Serif, Georgia, serif", fontWeight: 600 }}
        >
          The AHM Promise
        </h3>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-6">
          <PromiseCard 
            title="Authentic Ingredients" 
            desc="Pure botanical extracts and premium oils sourced worldwide."
            icon={<path d="M12 20v-6m0 0V4m0 10l3-3m-3 3l-3-3" />}
          />
          <PromiseCard 
            title="Fast Delivery" 
            desc="Express shipping across all major cities in Pakistan."
            icon={<path d="M16 3v4M8 3v4M3 11h18" />}
          />
          <PromiseCard 
            title="7-Day Return" 
            desc="Hassle-free returns if our scent doesn’t speak to you."
            icon={<path d="M12 11v4m0 0l2-2m-2 2l-2-2" />}
          />
          <PromiseCard 
            title="Customer Support" 
            desc="Dedicated fragrance consultants available 24/7."
            icon={<circle cx="12" cy="12" r="10" />}
          />
        </div>
      </section>
    </main>
  );
}

function PromiseCard({ title, desc, icon }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-[#ede6e1] flex flex-col items-center p-8 transition-all hover:shadow-md hover:-translate-y-1">
      <span className="block w-12 h-12 mb-5">
        <svg
          width="40"
          height="40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#7e525c"
          strokeWidth="1.5"
        >
          {icon}
          <rect x="3" y="12" width="18" height="8" rx="2" stroke="#7e525c" />
        </svg>
      </span>
      <h4 className="font-bold text-[#1c1c19] text-lg mb-2">{title}</h4>
      <p className="text-[#4e4543] text-sm text-center leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
