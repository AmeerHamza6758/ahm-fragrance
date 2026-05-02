import { useState, useEffect } from "react";
import PageSection from "../components/PageSection";
import "../styles/admin.css"
import { NavLink } from "react-router-dom";

const faqData = [
  {
    id: 1,
    question: "How can I track my fragrance order?",
    answer: "Customers can track their order from dashboard using tracking ID.",
  },
  {
    id: 2,
    question: "Can users return opened products?",
    answer: "Opened products are not eligible for return or exchange.",
  },
  {
    id: 3,
    question: "How to manage stock alerts?",
    answer: "Admin can manage stock alerts from inventory settings.",
  },
];
function FaqPage() {

  const [openFAQ, setOpenFAQ] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  useEffect(() => {
  const closeMenu = () => {
    setMenuOpen(null);
  };

  document.addEventListener("click", closeMenu);

  return () => {
    document.removeEventListener("click", closeMenu);
  };
}, []);
  return (
    <div className="faq-admin-page">
      <div className="faq-header-section">
        <div>
          <h1 className="faq-main-title">FAQ</h1>
          <p className="faq-sub-title">
          Manage frequently asked questions and customer help content.
          </p>
        </div>
        <NavLink to="add" className="add-faq-btn" >+ Add FAQ</NavLink>
      </div>

      <div className="faq-list-container">
        {faqData.map((item, index) => (
          <div className="faq-card-item" key={item.id}>
            <div className="faq-question-row">
              <h3
                className="faq-question-text"
                onClick={() =>
                  setOpenFAQ(openFAQ === index ? null : index)
                }
              >
                {item.question}
              </h3>

              <div className="faq-actions-wrapper">
                <button
                  className="faq-menu-button"
                  onClick={(e) =>{
                    e.stopPropagation();
                    setMenuOpen(menuOpen === index ? null : index)
                  }}
                >
                  ⋮
                </button>

                {menuOpen === index && (
                  <div className="faq-dropdown-menu">
                    <p onClick={() => handleEdit(item.id)}>Edit</p>
                    <p onClick={() => handleDelete(item.id)}>Delete</p>
                  </div>
                )}
              </div>
            </div>

            {openFAQ === index && (
              <p className="faq-answer-text">{item.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FaqPage;
