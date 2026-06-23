import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full min-h-screen bg-[#fdf9f5] relative overflow-hidden">
      
<img
  src="/Images/hero-bg-pic.svg"
  alt=""
  className="absolute inset-0 w-full h-full object-cover object-[85%_center]"
/>      
      <div className="absolute inset-0 bg-gradient-to-r from-[#fdf9f5]/40 via-transparent to-transparent"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 lg:px-12 py-16 md:py-24 lg:py-22 ">
        
        <div className="md:max-w-xl sm:max-w-lg max-w-lg bg-white/30 backdrop-blur-sm rounded-2xl p-6  md:p-8 lg:p-7">
          
          <h1 className="text-[28px] sm:text-4xl md:text-5xl lg:text-5xl font-bold leading-[1.2] mb-3 font-['Noto_Serif',Georgia,serif] tracking-[-1px] text-[#1a1a1a]">
            Discover premium
            <br />
            quality perfumes
            <br />
            at <span className="font-normal italic text-[#6c444e] whitespace-nowrap">AHM Fragrance</span>
          </h1>
          
          <p className="text-base sm:text-lg leading-relaxed mb-8 max-w-lg font-['Arial',sans-serif] text-[#4a4a4a]">
            Long-lasting, affordable and luxury-inspired scents perfect for
            every occasion. Experience the art of botanical alchemy.
          </p>
          
          <Link href="/collections">
            <button className="bg-[#6c444e] hover:bg-[#5a3a42] text-white font-bold py-3.5 px-8 rounded-full text-base transition-all duration-300 cursor-pointer active:scale-95 mb-8 inline-block">
              Explore Collection
            </button>
          </Link>
          
        </div>
        
      
      </div>
    </section>
  );
}