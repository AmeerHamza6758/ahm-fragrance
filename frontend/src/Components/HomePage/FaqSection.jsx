"use client";

import { useState, useEffect } from "react";
import { getFaqs } from "@/lib/api/endpoints/faq";

export default function FaqSection() {
  const [faqs, setFaqs] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchFaqs = async () => {
      try {
        const list = await getFaqs();
        if (isMounted) {
          setFaqs(list);
          if (list.length > 0) {
            setExpandedId(list[0]._id);
          }
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFaqs();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleFaq = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!loading && faqs.length === 0) {
    return null;
  }

  return (
    <section className="faq-section">
      <div className="faq-box">
        <div className="faq-list">
          {loading ? (
            <p className="text-center py-8 text-gray-500">Loading FAQs...</p>
          ) : faqs.length > 0 ? (
            faqs.map((faq, idx) => (
              <div key={faq._id}>
                <div
                  className="flex items-start justify-between w-full cursor-pointer py-4"
                  onClick={() => toggleFaq(faq._id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && toggleFaq(faq._id)
                  }
                >
                  <span
                    className="font-bold text-[1.6rem] leading-snug text-[#23201c]"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    {faq.question}
                  </span>
                  <span
                    className="text-[2rem] font-bold text-[#7e525c] select-none"
                    style={{ lineHeight: 1 }}
                  >
                    {expandedId === faq._id ? "−" : "+"}
                  </span>
                </div>
                {expandedId === faq._id && (
                  <div className="pl-2 pt-2 pb-4">
                    <div
                      className="text-[1.25rem] text-[#5a524a] font-normal leading-[1.5]"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    >
                      {faq.answer}
                    </div>
                  </div>
                )}
                {idx !== faqs.length - 1 && (
                  <div className="w-full h-px bg-[#e7e0da] my-2" />
                )}
              </div>
            ))
          ) : null}
        </div>
      </div>
    </section>
  );
}
