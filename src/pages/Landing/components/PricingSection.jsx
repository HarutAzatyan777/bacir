import React from "react";
import { motion } from "framer-motion";
import { FaCheck, FaFire } from "react-icons/fa";

export default function PricingSection({ t, onSelectPlan }) {
  const plans = [
    {
      id: "basic",
      name: t.orderPlanPlanLabel || t.orderPlanBasic,
      oldPrice: "15,000",
      newPrice: "9,900",
      save: "5,100",
      features: [
        t.pricingFeatStandard1,
        t.pricingFeatStandard2,
        t.pricingFeatStandard3,
        t.pricingFeatStandard4,
        t.pricingFeatStandard5,
      ],
      popular: false,
    },
    {
      id: "custom",
      name: t.orderPlanCustom,
      oldPrice: "30,000",
      newPrice: "19,900",
      save: "10,100",
      features: [
        t.pricingFeatCustom1,
        t.pricingFeatCustom2,
        t.pricingFeatCustom3,
        t.pricingFeatCustom4,
        t.pricingFeatCustom5,
      ],
      popular: true,
    },
    {
      id: "vip",
      name: t.orderPlanVip,
      oldPrice: "55,000",
      newPrice: "34,900",
      save: "20,100",
      features: [
        t.pricingFeatVip1,
        t.pricingFeatVip2,
        t.pricingFeatVip3,
        t.pricingFeatVip4,
        t.pricingFeatVip5,
      ],
      popular: false,
    },
  ];

  const handleOrder = (planId) => {
    onSelectPlan(planId);
    const element = document.getElementById("order-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="pricing-section" id="pricing-section">
      <div className="pricing-container">
        
        {/* Section Header */}
        <div className="pricing-header-block">
          <span className="pricing-pretitle">BACIR.ONLINE</span>
          <h2 className="pricing-main-title">{t.pricingTitle}</h2>
          <p className="pricing-subtitle-text">{t.pricingSubtitle}</p>
        </div>

        {/* Promo Banner */}
        <motion.div 
          className="pricing-promo-banner"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="promo-banner-content">
            <FaFire className="promo-fire-icon animate-pulse" />
            <span className="promo-banner-badge">{t.pricingPromoBadge}</span>
            <span className="promo-banner-text">
              {t.pricingSubtitle.includes("սահմանափակ") 
                ? "Ամառային Ակցիա՝ -35% Զեղչ բոլոր սակագների համար սահմանափակ ժամանակով"
                : t.pricingSubtitle.includes("ограниченная")
                ? "Летняя Акция: Скидка -35% на все тарифы на ограниченное время"
                : "Summer Promotion: -35% Off on all pricing plans for a limited time"}
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`pricing-card ${plan.popular ? "popular-card" : ""}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              {plan.popular && (
                <div className="popular-badge-ribbon">
                  {t.pricingPopular}
                </div>
              )}

              <div className="card-header">
                <h3>{plan.name}</h3>
              </div>

              {/* Pricing Display */}
              <div className="card-price-container">
                <div className="price-old">
                  {plan.oldPrice} ֏
                </div>
                <div className="price-new-wrapper">
                  <span className="price-new">{plan.newPrice}</span>
                  <span className="currency">֏</span>
                </div>
                <div className="price-save-badge">
                  {t.pricingSave} {plan.save} ֏
                </div>
              </div>

              {/* Features List */}
              <ul className="card-features-list">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex}>
                    <span className="feature-check-icon">
                      <FaCheck />
                    </span>
                    <span className="feature-text">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button 
                onClick={() => handleOrder(plan.id)}
                className={`pricing-cta-button ${plan.popular ? "popular-btn" : "standard-btn"}`}
              >
                {t.pricingOrderBtn}
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
