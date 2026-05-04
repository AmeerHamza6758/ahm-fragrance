import { getCMSContent } from "@/lib/api/endpoints/cms";

export default async function TermsOfServicePage() {
  const data = await getCMSContent('terms-service').catch(() => null);

  return (
    <main className="terms-page">
      {/* Hero Section - Consistent with static design */}
      <section className="terms-hero">
        <div className="terms-hero-image"></div>

        <div className="terms-hero-content">
          <p className="terms-hero-date">LAST UPDATED: APRIL 2026</p>
          <h1 className="terms-hero-title">
            Terms of Service
          </h1>
          <div className="terms-hero-divider"></div>
        </div>
      </section>

      {/* Content Section - Dynamic or Fallback */}
      <section className="terms-content-section">
        <div className="terms-content-container">
          {data?.content && data.content !== '<p><br></p>' ? (
            <div 
              className="cms-content-render"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          ) : (
            <>
              <article className="terms-block">
                <div className="terms-block-heading">
                  <span className="terms-block-number">01.</span>
                  <h2 className="terms-block-title">General Agreement</h2>
                </div>

                <div className="terms-card">
                  <p className="terms-card-text">
                    By accessing and using the AHM Fragrances website, you
                    acknowledge that you have read, understood, and agree to be
                    bound by these Terms of Service. These terms constitute a legally
                    binding agreement between you and AHM Fragrances regarding your
                    use of our digital platform.
                  </p>

                  <p className="terms-card-text">
                    Our website is intended for individuals who are at least 18 years
                    of age. If you are under 18, you may only use this site under the
                    supervision of a parent or legal guardian.
                  </p>
                </div>
              </article>

              <article className="terms-block">
                <div className="terms-block-heading">
                  <span className="terms-block-number">02.</span>
                  <h2 className="terms-block-title">Products & Usage</h2>
                </div>

                <div className="terms-card">
                  <ul className="terms-list">
                    <li>All fragrances are for external cosmetic use only.</li>
                    <li>
                      Avoid contact with eyes and mucous membranes. In case of
                      contact, rinse immediately with water.
                    </li>
                    <li>
                      Keep all products strictly out of reach of children and pets.
                    </li>
                    <li>
                      Due to the artisanal nature of our botanical ingredients,
                      slight variations between batches may occur, enhancing the
                      unique character of each bottle.
                    </li>
                  </ul>
                </div>
              </article>

              <article className="terms-block">
                <div className="terms-block-heading">
                  <span className="terms-block-number">03.</span>
                  <h2 className="terms-block-title">Orders & Payments</h2>
                </div>

                <div className="terms-card">
                  <p className="terms-card-text">
                    We currently operate exclusively via <strong>Cash on Delivery (COD)</strong> to
                    ensure a seamless and trusted transaction process. You agree to
                    provide current, complete, and accurate purchase and account
                    information for all purchases made at our store.
                  </p>

                  <p className="terms-card-text">
                    AHM Fragrances reserves the right to refuse any order you place
                    with us. Prices for our products are subject to change without
                    notice, though once an order is confirmed, the price at the time
                    of confirmation will apply.
                  </p>
                </div>
              </article>

              <article className="terms-block">
                <div className="terms-block-heading">
                  <span className="terms-block-number">04.</span>
                  <h2 className="terms-block-title">Shipping & Delivery</h2>
                </div>

                <div className="terms-card">
                  <p className="terms-card-text">
                    Our signature scents travel with care. We offer nationwide
                    delivery across Pakistan with an estimated timeframe of{" "}
                    <strong>3-5 working days</strong> from the date of order
                    confirmation.
                  </p>

                  <p className="terms-card-text">
                    While we strive for punctuality, delivery times may vary during
                    peak seasons or due to unforeseen courier delays. We will provide
                    tracking information once your package has been dispatched.
                  </p>
                </div>
              </article>

              <article className="terms-block">
                <div className="terms-block-heading">
                  <span className="terms-block-number">05.</span>
                  <h2 className="terms-block-title">Returns & Refunds</h2>
                </div>

                <div className="terms-card">
                  <p className="terms-card-text">
                    We maintain a meticulous quality control process. However, if you
                    receive a damaged or incorrect item, we offer a{" "}
                    <strong>7-day return policy</strong>.
                  </p>

                  <p className="terms-card-text">
                    To be eligible for a return, your item must be in the same
                    condition that you received it, unworn or unused, with tags, and
                    in its original packaging. Please contact our support team with
                    photographic evidence of the damage to initiate the process.
                  </p>
                </div>
              </article>

              <article className="terms-block">
                <div className="terms-block-heading">
                  <span className="terms-block-number">06.</span>
                  <h2 className="terms-block-title">Intellectual Property</h2>
                </div>

                <div className="terms-card">
                  <p className="terms-card-text">
                    The Site and its original content, features, and functionality
                    are and will remain the exclusive property of AHM Fragrances. Our
                    trademarks and trade dress may not be used in connection with any
                    product or service without our prior written consent.
                  </p>
                </div>
              </article>

              <article className="terms-block">
                <div className="terms-block-heading">
                  <span className="terms-block-number">07.</span>
                  <h2 className="terms-block-title">Limitation of Liability</h2>
                </div>

                <div className="terms-card">
                  <p className="terms-card-text">
                    In no case shall AHM Fragrances, our directors, or employees be
                    liable for any injury, loss, claim, or any direct, indirect,
                    incidental, punitive, special, or consequential damages of any
                    kind arising from your use of any of our products or the website.
                  </p>
                </div>
              </article>

              <article className="terms-block">
                <div className="terms-block-heading">
                  <span className="terms-block-number">08.</span>
                  <h2 className="terms-block-title">Updates to Terms</h2>
                </div>

                <div className="terms-card">
                  <p className="terms-card-text">
                    We reserve the right, at our sole discretion, to update, change
                    or replace any part of these Terms of Service by posting updates
                    and changes to our website. It is your responsibility to check
                    our website periodically for changes.
                  </p>
                </div>
              </article>
            </>
          )}
        </div>
      </section>
    </main>
  );
}