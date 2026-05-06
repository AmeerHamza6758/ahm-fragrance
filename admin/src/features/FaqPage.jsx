import React, { useState, useEffect } from "react";
import "../styles/admin.css";
import { faqApi } from "../services/endpoints";
import { successToaster, errorToaster, confirmationPopup } from "../utils/alert-service";

function FaqPage() {
  const [faqData, setFaqData] = useState([]);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);

  // Fetch FAQs on mount
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await faqApi.list();
        if (res.data && res.data.data) {
          setFaqData(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch FAQs:", err);
      }
    };
    fetchFaqs();
  }, []);

  useEffect(() => {
    const closeMenu = () => {
      setMenuOpen(null);
    };
    document.addEventListener("click", closeMenu);
    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, []);

  const handleAddFaq = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    setSubmitting(true);
    try {
      const res = await faqApi.create({
        question: newQuestion.trim(),
        answer: newAnswer.trim(),
      });
      if (res.data && res.data.data) {
        setFaqData((prev) => [...prev, res.data.data]);
        successToaster("FAQ added successfully.");
      }
      closeModal();
    } catch (err) {
      console.error("Failed to add FAQ:", err);
      errorToaster("Failed to add FAQ. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateFaq = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    setSubmitting(true);
    try {
      const res = await faqApi.update(editingFaq._id, {
        question: newQuestion.trim(),
        answer: newAnswer.trim(),
      });
      if (res.data && res.data.data) {
        setFaqData((prev) =>
          prev.map((faq) => faq._id === editingFaq._id ? res.data.data : faq)
        );
        successToaster("FAQ updated successfully.");
      }
      closeModal();
    } catch (err) {
      console.error("Failed to update FAQ:", err);
      errorToaster("Failed to update FAQ.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await confirmationPopup("Delete this FAQ query permanently?");
    if (result.isConfirmed) {
      try {
        await faqApi.remove(id);
        setFaqData((prev) => prev.filter((faq) => faq._id !== id));
        successToaster("FAQ removed.");
      } catch (err) {
        errorToaster("Failed to remove FAQ.");
      }
    }
  };

  const handleEdit = (item) => {
    setEditingFaq(item);
    setNewQuestion(item.question);
    setNewAnswer(item.answer);
    setShowModal(true);
    setMenuOpen(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setNewQuestion("");
    setNewAnswer("");
    setEditingFaq(null);
  };

  return (
    <div className="faq-admin-page">
      <div className="faq-header-section">
        <div>
          <h1 className="faq-main-title">FAQ</h1>
          <p className="faq-sub-title">
            Manage frequently asked questions and customer help content.
          </p>
        </div>
        <button className="add-faq-btn" onClick={() => { setEditingFaq(null); setShowModal(true); }}>+ Add FAQ</button>
      </div>

      <div className="faq-list-container">
        {faqData.map((item, index) => (
          <div className="faq-card-item" key={item._id || index}>
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
                    <p onClick={() => handleEdit(item)}>Edit</p>
                    <p onClick={() => handleDelete(item._id)}>Delete</p>
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

      {showModal && (
        <div className="faq-modal-overlay" onClick={closeModal}>
          <div className="faq-modal" onClick={(e) => e.stopPropagation()}>
            <div className="faq-modal-header">
              <h2>{editingFaq ? "Edit FAQ" : "Add New FAQ"}</h2>
              <button className="faq-modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="faq-modal-body">
              <label className="faq-modal-label">Question</label>
              <input
                type="text"
                className="faq-modal-input"
                placeholder="Enter the question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
              <label className="faq-modal-label">Answer</label>
              <textarea
                className="faq-modal-textarea"
                placeholder="Enter the answer"
                rows={4}
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
              />
            </div>
            <div className="faq-modal-footer">
              <button className="faq-modal-cancel" onClick={closeModal}>Cancel</button>
              <button
                className="faq-modal-submit"
                onClick={editingFaq ? handleUpdateFaq : handleAddFaq}
                disabled={submitting || !newQuestion.trim() || !newAnswer.trim()}
              >
                {submitting ? (editingFaq ? "Updating..." : "Adding...") : (editingFaq ? "Update FAQ" : "Add FAQ")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FaqPage;
