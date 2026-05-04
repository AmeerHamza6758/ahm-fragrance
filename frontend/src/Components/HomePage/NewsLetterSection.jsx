"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { joinFragranceCircle } from "@/lib/api/endpoints/circle";
import Swal from "sweetalert2";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire({
        title: "Email Required",
        text: "Please enter your email address to join.",
        icon: "warning",
        confirmButtonColor: "#7e525c"
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await joinFragranceCircle(email);
      
      Swal.fire({
        title: "Welcome!",
        text: res.message || "You have successfully joined the Fragrance Circle.",
        icon: "success",
        confirmButtonColor: "#7e525c"
      });

      setEmail("");
    } catch (error) {
      Swal.fire({
        title: "Submission Failed",
        text: error.response?.data?.message || "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonColor: "#7e525c"
      });
    } finally {
      setIsLoading(false);
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

        <form onSubmit={handleSubmit} className="newsletter-form">
          <input
            type="email"
            placeholder="Enter your email"
            className="newsletter-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className={`newsletter-btn ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? "..." : "Join"}
          </button>
        </form>
      </div>
    </section>
  );
}