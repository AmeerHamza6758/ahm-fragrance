import Hero from "@/Components/HomePage/Hero";
import TrustBar from "@/Components/HomePage/TrustBar";
import BestSellers from "@/Components/HomePage/BestSellers";
import GenderCategories from "@/Components/HomePage/GenderCategories";
import ValuesSection from "@/Components/HomePage/ValuesSection";
import Reviews from "@/Components/HomePage/Reviews";
import NewsletterSection from "@/Components/HomePage/NewsLetterSection";
import FaqSection from "@/Components/HomePage/FaqSection";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <BestSellers />
      <GenderCategories />
      <ValuesSection />
      <Reviews />
      <NewsletterSection />
      <FaqSection />
    </>
  );
}
