import { Mail } from "lucide-react";

export default function NewsletterSection() {
  return (
    <section className="newsletter-section">
      <div className="newsletter-box">
        <div className="newsletter-icon">
          <Mail size={32} strokeWidth={1.8} />
        </div>

        <h2 className="newsletter-title">Join the Fragrance Circle</h2>

        <p className="newsletter-text">
          Subscribe for early access to new arrivals, exclusive sales,
          <br />
          and botanical scent stories.
        </p>

        <div className="newsletter-form">
          <input
            type="email"
            placeholder="Enter your email"
            className="newsletter-input"
          />
          <button className="newsletter-btn">Join</button>
        </div>
      </div>
    </section>
  );
}