import Image from "next/image";

export const metadata = {
  title: "Shipping & Returns | AHM Fragrances",
  description:
    "Learn about our shipping and returns policy for AHM Fragrances.",
};

export default function ShippingReturnsPage() {
  return (
    <main className="shipping-returns-page">
      <section className="shipping-hero">
        <div className="shipping-hero-bg" />
        <div className="shipping-hero-content">
          <p className="shipping-hero-label">CARE & COMMITMENT</p>
          <h1 className="shipping-hero-title">Shipping & Returns</h1>
          <p className="shipping-hero-text">
            Ensuring your luxury fragrance arrives with the same care and
            precision as it was crafted. Our policies are designed to maintain
            the integrity of our scents and your satisfaction.
          </p>
        </div>
      </section>

      <section className="shipping-info-section">
        <div className="shipping-info-grid">
          <div className="shipping-info-card">
            <div className="shipping-info-heading">
              <span className="shipping-info-heading-icon">
                <Image
                  src="/Icons/shipping-truck-icon.svg"
                  alt="Shipping Truck"
                  width={24}
                  height={18}
                />
              </span>
              <h2 className="shipping-info-title">Domestic Shipping</h2>
            </div>
            <p className="shipping-info-description">
              We offer swift, secure delivery across all regions of Pakistan.
              Your order is handled by our premium courier partners to ensure it
              reaches you in pristine condition.
            </p>
            <div className="shipping-info-points">
              <div className="shipping-info-point">
                <span className="shipping-info-point-icon">
                  <Image
                    src="/Icons/shipping-clock-icon.svg"
                    alt="Delivery Time"
                    width={20}
                    height={20}
                  />
                </span>
                <div>
                  <h3 className="shipping-info-point-title">
                    3-5 Working Days
                  </h3>
                  <p className="shipping-info-point-text">
                    Estimated delivery time for all cities.
                  </p>
                </div>
              </div>
              <div className="shipping-info-point">
                <span className="shipping-info-point-icon">
                  <Image
                    src="/Icons/shipping-bag-icon.svg"
                    alt="Complimentary Delivery"
                    width={20}
                    height={20}
                  />
                </span>
                <div>
                  <h3 className="shipping-info-point-title">
                    Complimentary Delivery
                  </h3>
                  <p className="shipping-info-point-text">
                    Free shipping on all orders nationwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="shipping-visual-card">
            <div className="shipping-visual-image-wrap">
              <Image
                src="/assets/shipping-product.svg"
                alt="Shipping and returns fragrance visual"
                className="shipping-visual-image"
                width={475}
                height={440}
                priority
              />
              <div className="shipping-visual-overlay">
                <div className="shipping-visual-overlay-icon">
                  <Image
                    src="/Icons/shipping-cash-icon.svg"
                    alt="Cash on Delivery"
                    width={20}
                    height={15}
                  />
                </div>
                <h3 className="shipping-visual-overlay-title">
                  Cash on Delivery
                </h3>
                <p className="shipping-visual-overlay-text">
                  EXCLUSIVE PAYMENT METHOD
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="returns-process-section">
        <div className="returns-process-grid">
          <div className="returns-essence">
            <h2 className="returns-essence-title">The Essence of Returns</h2>
            <div className="returns-essence-item">
              <div className="returns-essence-number">01</div>
              <div className="returns-essence-content">
                <h3 className="returns-essence-heading">7-Day Return Window</h3>
                <p className="returns-essence-text">
                  If your purchase doesn&apos;t meet our strict quality
                  standards, you have 7 days from the delivery date to initiate
                  a return or refund request.
                </p>
              </div>
            </div>
            <div className="returns-essence-item">
              <div className="returns-essence-number">02</div>
              <div className="returns-essence-content">
                <h3 className="returns-essence-heading">
                  Eligibility Criteria
                </h3>
                <p className="returns-essence-text">
                  To maintain hygiene standards, returns are only accepted for
                  products that are damaged, broken, leaking, or incorrectly
                  shipped. Items must be unused and in original packaging.
                </p>
              </div>
            </div>
          </div>
          <div className="returns-process-card">
            <div className="returns-process-badge">
              <Image
                src="/Icons/shipping-returns-badge-icon.svg"
                alt="Returns Badge"
                width={28}
                height={28}
              />
            </div>
            <h2 className="returns-process-title">The Process</h2>
            <div className="returns-process-steps">
              <div className="returns-process-step">
                <div className="returns-process-step-number">1</div>
                <p className="returns-process-step-text">
                  Contact our concierge via WhatsApp (03044524449) or Email
                  (ahmfragrance@gmail.com).
                </p>
              </div>
              <div className="returns-process-step">
                <div className="returns-process-step-number">2</div>
                <p className="returns-process-step-text">
                  Provide your order number and clear photographic evidence of
                  the issue.
                </p>
              </div>
              <div className="returns-process-step">
                <div className="returns-process-step-number">3</div>
                <p className="returns-process-step-text">
                  Once approved, safely repackage the item for pickup or return
                  shipping.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
