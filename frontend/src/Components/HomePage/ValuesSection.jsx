import { Hourglass, Package, ShoppingBag } from "lucide-react";

export default function ValuesSection() {
  return (
    <section className="values-section">
      <div className="values-container">

        <div className="value-card">
          <div className="value-icon">
            <Hourglass size={28} />
          </div>
          <h3>Long Lasting</h3>
          <p>
            Our perfumes are crafted with high oil concentration to ensure they
            stay with you all day long.
          </p>
        </div>

        <div className="value-card">
          <div className="value-icon">
            <Package size={28} />
          </div>
          <h3>Premium Packaging</h3>
          <p>
            Luxury starts from the box. Every bottle is housed in meticulously
            crafted aesthetic packaging.
          </p>
        </div>

        <div className="value-card">
          <div className="value-icon">
            <ShoppingBag size={28} />
          </div>
          <h3>Affordable Luxury</h3>
          <p>
            We believe high-end scents should be accessible. Luxury quality
            without the designer price tag.
          </p>
        </div>

      </div>
    </section>
  );
}