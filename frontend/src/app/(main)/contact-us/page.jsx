"use client";

import React, { useEffect, useState } from "react";
import { getFaqs } from "@/lib/api/endpoints/faq";
import { sendContactInquiry } from "@/lib/api/endpoints/contact";
import Swal from "sweetalert2";

export default function ContactPage() {
  const [open, setOpen] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [faqLoading, setFaqLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      Swal.fire({
        title: "Missing Information",
        text: "Please provide your name, email, and message.",
        icon: "warning",
        confirmButtonColor: "#7e525c"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await sendContactInquiry(formData);
      
      Swal.fire({
        title: "Message Sent!",
        text: "Our artisans will respond to your inquiry shortly.",
        icon: "success",
        confirmButtonColor: "#7e525c"
      });

      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      Swal.fire({
        title: "Delivery Failed",
        text: "We couldn't deliver your message. Please try again.",
        icon: "error",
        confirmButtonColor: "#7e525c"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchFaqs = async () => {
      try {
        const list = await getFaqs();
        if (isMounted) {
          setFaqs(list);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        if (isMounted) {
          setFaqLoading(false);
        }
      }
    };

    fetchFaqs();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#fdf9f5] page-main-spacing">
      {/* Hero Section */}
      <section className="w-full bg-[#fdf9f5] relative">
        <div className="absolute inset-0 h-75 w-full bg-[url('/Images/best-1.svg')] bg-cover bg-center opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center justify-center pt-16 pb-10">
          <h1
            className="text-[#7e525c] font-bold mb-4 text-center"
            style={{
              fontFamily: '"Noto Serif", Georgia, serif',
              fontSize: "56px",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            Get in Touch
          </h1>
          <p
            className="max-w-md text-center text-[#4e4543] text-[17px] leading-[1.7] font-normal"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            We’re here to help you find your signature scent. Whether it’s a
            query about our collections or a bespoke request, reach out to our
            artisans.
          </p>
        </div>
      </section>

      <section className="flex justify-center mt-24">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl bg-white/0 rounded-2xl border border-[#ede6e1] p-8 md:p-6 flex flex-col gap-6 shadow-none"
          style={{ boxShadow: "0 0 0 0 transparent" }}
        >
          <div className="flex flex-col sm:flex-row gap-4 ">
            <div className="flex-1 flex flex-col gap-2">
              <label
                className="text-[12px] font-semibold tracking-[1px] font-Manrope uppercase  text-[#999] mb-1"
                htmlFor="name"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Full Name"
                className="rounded-md border border-[#ede6e1] bg-[#fdf9f5] px-4 py-2 text-[15px] text-[#1c1c19] font-normal focus:outline-none focus:border-[#7e525c] transition"
                style={{ fontFamily: "Arial, sans-serif" }}
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label
                className="text-[12px] font-semibold tracking-[1px] uppercase text-[#999] mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="hello@example.com"
                className="rounded-md border border-[#ede6e1] bg-[#fdf9f5] px-4 py-2 text-[15px] text-[#1c1c19] font-normal focus:outline-none focus:border-[#7e525c] transition"
                style={{ fontFamily: "Arial, sans-serif" }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-[12px] font-semibold tracking-[1px] uppercase text-[#999] mb-1"
              htmlFor="subject"
            >
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              placeholder="How can we help?"
              className="rounded-md border border-[#ede6e1] bg-[#fdf9f5] px-4 py-2 text-[15px] text-[#1c1c19] font-normal focus:outline-none focus:border-[#7e525c] transition"
              style={{ fontFamily: "Arial, sans-serif" }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-[12px] font-semibold tracking-[1px] uppercase text-[#999] mb-1"
              htmlFor="message"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your botanical inquiry here..."
              className="rounded-md border border-[#ede6e1] bg-[#fdf9f5] px-4 py-2 text-[15px] text-[#1c1c19] font-normal focus:outline-none focus:border-[#7e525c] transition resize-none"
              style={{ fontFamily: "Arial, sans-serif" }}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-2 w-50 self-start rounded-full bg-[#7e525c] px-8 py-3 text-white text-[15px] font-semibold tracking-[1px] uppercase shadow-none transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#6a4450]'}`}
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>

      {/* FAQ Section */}
      {!faqLoading && faqs.length > 0 && (
        <section className="mt-24 flex flex-col items-center">
          <h2
            className="text-[#7e525c] text-[32px] font-normal italic mb-10"
            style={{ fontFamily: '"Noto Serif", Georgia, serif' }}
          >
            Frequent Curiosities
          </h2>
          <div className="w-full max-w-xl flex flex-col divide-y divide-[#ede6e1] bg-white/0 rounded-xl border-0">
            {faqs.map((faq, i) => (
              <div key={faq._id}>
                <button
                  type="button"
                  className="w-full flex items-center justify-between py-5 text-left text-[#1c1c19] font-semibold text-[17px] focus:outline-none"
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{ fontFamily: "Arial, sans-serif" }}
                >
                  <span>{faq.question}</span>
                  <span className="text-[22px] text-[#7e525c] font-light">
                    {open === i ? "−" : "+"}
                  </span>
                </button>
                {open === i && (
                  <div
                    className="pb-5 pl-1 pr-2 text-[#4e4543] text-[15px] leading-[1.7]"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            className="mt-10 text-[11px] font-semibold tracking-[1px] uppercase text-[#7e525c] border-t border-[#ede6e1] pt-6 hover:underline"
            style={{ fontFamily: "Arial, sans-serif", letterSpacing: "1px" }}
          >
            View All FAQs
          </button>
        </section>
      )}
    </main>
  );
}
