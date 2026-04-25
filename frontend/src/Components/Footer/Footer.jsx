import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
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
          <Link href="/contact-us">Contact Us</Link>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pinterest
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 AHM Fragrances. Curated Botanical Luxury.</p>
      </div>
    </footer>
  );
}
