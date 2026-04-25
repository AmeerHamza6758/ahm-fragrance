import Link from "next/link";

export default function GenderCategories() {
  return (
    <section className="gender-categories">
      <div className="gender-grid">
        <div className="gender-card gender-card-men">
          <div className="gender-overlay"></div>
          <div className="gender-content">
            <h3>For Him</h3>
            <p>
              Bold, sophisticated, and enduring scents designed for the modern
              gentleman.
            </p>
            <Link href="/mens">SHOP MEN</Link>
          </div>
        </div>

        <div className="gender-card gender-card-women">
          <div className="gender-overlay"></div>
          <div className="gender-content">
            <h3>For Her</h3>
            <p>
              Delicate, floral, and empowering fragrances that capture the
              essence of grace.
            </p>
            <Link href="/womens">SHOP WOMEN</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
