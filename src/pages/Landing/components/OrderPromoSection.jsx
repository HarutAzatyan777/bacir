import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaPaperPlane, FaTelegramPlane, FaWhatsapp, FaPhoneAlt } from "react-icons/fa";

export default function OrderPromoSection({ t, selectedPlan }) {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    eventType: "",
    plan: "",
    notes: ""
  });
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  useEffect(() => {
    if (selectedPlan) {
      setFormData((prev) => ({ ...prev, plan: selectedPlan }));
    }
  }, [selectedPlan]);

  const eventTypes = [
    { value: "wedding", label: t.orderEventWedding },
    { value: "birthday", label: t.orderEventBirthday },
    { value: "baptism", label: t.orderEventBaptism },
    { value: "other", label: t.orderEventOther }
  ];

  const plans = [
    { value: "basic", label: t.orderPlanBasic },
    { value: "custom", label: t.orderPlanCustom },
    { value: "vip", label: t.orderPlanVip }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contact.trim() || !formData.eventType || !formData.plan) {
      return;
    }

    setStatus("loading");

    const selectedEvent = eventTypes.find(e => e.value === formData.eventType)?.label || formData.eventType;
    const selectedPlan = plans.find(p => p.value === formData.plan)?.label || formData.plan;

    const botMessage =
      `🛍️ ՆՈՐ ՊԱՏՎԵՐ (bacir.online) 🛍️\n\n` +
      `👤 Պատվիրատու: ${formData.name}\n` +
      `📞 Կապ: ${formData.contact}\n` +
      `🎉 Միջոցառում: ${selectedEvent}\n` +
      `💳 Սակագին: ${selectedPlan}\n` +
      `📝 Ցանկություններ: ${formData.notes || "Չկան"}`;

    try {
      const response = await fetch("/api/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: botMessage }),
      });

      if (!response.ok) throw new Error("Server error");

      setStatus("success");
      setFormData({ name: "", contact: "", eventType: "", plan: "", notes: "" });
    } catch (error) {
      console.error("Order submission error:", error);
      setStatus("error");
    }
  };

  return (
    <section className="order-promo-section" id="order-section">
      <div className="order-promo-container">
        {/* Left Side: Pitch and Contact info */}
        <motion.div
          className="order-pitch-box"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="order-pretitle">BACIR.ONLINE</span>
          <h2>{t.orderTitle}</h2>
          <p className="order-description">{t.orderSubtitle}</p>

          <div className="order-benefits-checklist">
            <h3>{t.orderBenefitsTitle}</h3>
            <ul>
              <li>
                <span className="benefit-icon-wrapper"><FaCheck /></span>
                <div>
                  <strong>{t.orderBenefit1}</strong>
                </div>
              </li>
              <li>
                <span className="benefit-icon-wrapper"><FaCheck /></span>
                <div>
                  <strong>{t.orderBenefit2}</strong>
                </div>
              </li>
              <li>
                <span className="benefit-icon-wrapper"><FaCheck /></span>
                <div>
                  <strong>{t.orderBenefit3}</strong>
                </div>
              </li>
              <li>
                <span className="benefit-icon-wrapper"><FaCheck /></span>
                <div>
                  <strong>{t.orderBenefit4}</strong>
                </div>
              </li>
            </ul>
          </div>

          <div className="direct-contact-block">
            <h4>{t.orderOrContact}</h4>
            <div className="direct-contact-buttons">
              <a href="https://t.me/bacir_online" target="_blank" rel="noopener noreferrer" className="contact-btn telegram">
                <FaTelegramPlane /> Telegram
              </a>
              <a href="https://wa.me/37443099070" target="_blank" rel="noopener noreferrer" className="contact-btn whatsapp">
                <FaWhatsapp /> WhatsApp
              </a>
              <a href="tel:+37443099070" className="contact-btn phone">
                <FaPhoneAlt /> Call Us
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Glassmorphic Order Form */}
        <motion.div
          className="order-form-box"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="glass-card-accent"></div>
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                className="order-success-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="success-icon-badge">✨</div>
                <h3>{t.orderSuccessTitle}</h3>
                <p>{t.orderSuccessDesc}</p>
                <button onClick={() => setStatus("idle")} className="btn-back-to-form">
                  Go Back
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="interactive-order-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {status === "error" && (
                  <div className="form-error-banner">
                    {t.orderError}
                  </div>
                )}

                <div className="form-group-row">
                  <div className="input-group">
                    <label htmlFor="name">{t.orderNameLabel} *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t.orderNamePlaceholder}
                      required
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="input-group">
                    <label htmlFor="contact">{t.orderContactLabel} *</label>
                    <input
                      type="text"
                      id="contact"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      placeholder={t.orderContactPlaceholder}
                      required
                    />
                  </div>
                </div>

                <div className="form-group-row grid-2">
                  <div className="input-group">
                    <label htmlFor="eventType">{t.orderEventLabel} *</label>
                    <select
                      id="eventType"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled hidden>
                        {t.orderEventPlaceholder}
                      </option>
                      {eventTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group">
                    <label htmlFor="plan">{t.orderPlanLabel} *</label>
                    <select
                      id="plan"
                      name="plan"
                      value={formData.plan}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled hidden>
                        {t.orderPlanLabel}
                      </option>
                      {plans.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="notes">{t.orderNotesLabel}</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder={t.orderNotesPlaceholder}
                    rows="3"
                  />
                </div>

                <button
                  type="submit"
                  className="order-submit-button"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <span className="spinner"></span>
                  ) : (
                    <>
                      <FaPaperPlane className="plane-icon" /> {t.orderSubmitBtn}
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
