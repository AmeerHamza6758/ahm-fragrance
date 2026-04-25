import { CreditCard, Truck, BadgeCheck, MapPin } from "lucide-react";

export default function TrustBar() {
  return (
    <section className="trust-bar-wrap">
      <div className="trust-bar">

        <div className="trust-item">
          <div className="trust-icon">
            <CreditCard size={20} strokeWidth={1.8} />
          </div>
          <div className="trust-text">
            <h4>Cash on Delivery</h4>
            <p>Pay at your doorstep</p>
          </div>
        </div>

        <div className="trust-item">
          <div className="trust-icon">
            <Truck size={20} strokeWidth={1.8} />
          </div>
          <div className="trust-text">
            <h4>3-5 Days Delivery</h4>
            <p>Swift nationwide shipping</p>
          </div>
        </div>

        <div className="trust-item">
          <div className="trust-icon">
            <BadgeCheck size={20} strokeWidth={1.8} />
          </div>
          <div className="trust-text">
            <h4>100% Authenticity</h4>
            <p>Guaranteed premium quality</p>
          </div>
        </div>

        <div className="trust-item">
          <div className="trust-icon">
            <MapPin size={20} strokeWidth={1.8} />
          </div>
          <div className="trust-text">
            <h4>All Over Pakistan</h4>
            <p>Reaching every corner</p>
          </div>
        </div>

      </div>
    </section>
  );
}