
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-box">
        <div className="hero-content">
          <h1 className="hero-title">
            Discover premium
            <br />
            quality perfumes
            <br />
            at <span>AHM Fragrance</span>
          </h1>

          <p className="hero-text">
            Long-lasting, affordable and luxury-inspired scents perfect for
            every occasion. Experience the art of botanical alchemy.
          </p>

          <div className="hero-actions">
            <Link href="/collections">
              <button className="hero-btn">Explore Collection</button>
            </Link>
            <button className="hero-icon-btn" aria-label="Wishlist">
            <Image src="/Icons/home-hero-icon.svg"alt="Wishlist"
                    width={20}
                    height={18}/>
           </button>
          </div>
        </div>
      </div>
    </section>
  );
}
