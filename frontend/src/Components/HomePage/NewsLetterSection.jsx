"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { joinCircle } from "@/lib/api/endpoints/circle";
import Swal from "sweetalert2";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await joinCircle(email);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Welcome!',
          text: res.message || 'You have successfully joined the Fragrance Circle.',
          confirmButtonColor: '#7e525c'
        });
        setEmail("");
      } else {
        throw new Error(res.message || "Failed to join circle");
      }
    } catch (error) {
      console.error("Join circle error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.response?.data?.message || error.message || 'Something went wrong. Please try again later.',
        confirmButtonColor: '#7e525c'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="newsletter-section my-5">
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

        <form onSubmit={handleJoin} className="newsletter-form">
          <input
            type="email"
            placeholder="Enter your email"
            className="newsletter-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="newsletter-btn"
            disabled={loading}
          >
            {loading ? "Joining..." : "Join"}
          </button>
        </form>
      </div>
    </section>
  );
}