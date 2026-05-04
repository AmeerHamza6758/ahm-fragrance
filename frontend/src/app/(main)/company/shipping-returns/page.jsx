import { getCMSContent } from "@/lib/api/endpoints/cms";
import Image from "next/image";
import icon_truck from "/public/icons/shipping-truck-icon.svg";
import icon_clock from "/public/icons/shipping-clock-icon.svg";
import icon_badge from "/public/icons/shipping-returns-badge-icon.svg";

export default async function ShippingReturnsPage() {
  const data = await getCMSContent('shipping-returns').catch(() => null);

  return (
    <main className="shipping-returns-page">
      {/* Hero Section - Consistent with original static design */}
      <section className="shipping-hero">
        <div className="shipping-hero-overlay"></div>

        <div className="shipping-hero-content">
          <p className="shipping-hero-label">CUSTOMER SERVICE</p>
          <h1 className="shipping-hero-title">
            Shipping & Returns
          </h1>
          <p className="shipping-hero-text">
            Our signature scents travel with care. Here is everything you need to
            know about our delivery and exchange process.
          </p>
        </div>
      </section>

      {/* Content Section - Dynamic or Fallback */}
      <section className="shipping-info-section">
        <div className="container mx-auto px-6 py-16">
          {data?.content && data.content !== '<p><br></p>' ? (
            <div 
              className="cms-content-render"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          ) : (
            <div className="shipping-info-grid">
              <div className="shipping-info-card">
                <div className="shipping-info-heading">
                  <span className="shipping-info-heading-icon">
                    <Image src={icon_truck} alt="Truck Icon" width={24} height={24} />
                  </span>
                  <h2 className="shipping-info-title">The Journey</h2>
                </div>
                
                <p className="shipping-info-description">
                  We ensure each bottle is meticulously packaged to preserve its 
                  olfactory integrity during its voyage to you.
                </p>

                <div className="shipping-info-points">
                  <div className="shipping-info-point">
                    <span className="shipping-info-point-icon">
                      <Image src={icon_clock} alt="Clock Icon" width={20} height={20} />
                    </span>
                    <div>
                      <h4 className="shipping-info-point-title">Express Delivery</h4>
                      <p className="shipping-info-point-text">3-5 working days across Pakistan.</p>
                    </div>
                  </div>

                  <div className="shipping-info-point">
                    <span className="shipping-info-point-icon">
                      <Image src={icon_badge} alt="Badge Icon" width={20} height={20} />
                    </span>
                    <div>
                      <h4 className="shipping-info-point-title">Quality Assurance</h4>
                      <p className="shipping-info-point-text">Hassle-free 7-day return policy for damaged items.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Card - Using a known background or empty state with branding */}
              <div className="shipping-visual-card">
                <div className="shipping-visual-image-wrap bg-[#1a1716] flex items-center justify-center p-10">
                   <div className="text-center border border-[#7e525c]/30 p-8 rounded-3xl">
                      <h3 className="shipping-visual-overlay-title text-[#FFD9DF]">AHM Logistics</h3>
                      <p className="shipping-visual-overlay-text text-[#a08a8a] mt-2">HANDLED WITH PRECISION</p>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
