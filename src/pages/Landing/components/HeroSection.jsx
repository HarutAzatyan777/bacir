import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelopeOpenText } from "react-icons/fa";

export default function HeroSection({ t }) {
  const navigate = useNavigate();

  return (
    <section className="hero-viewport">
      <div className="hero-container">
        <div className="hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-main-title"
          >
            {t.heroTitle}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-subtitle-text"
          >
            {t.heroSubtitle}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hero-cta-buttons"
          >
            <button className="cta-btn primary-gold" onClick={() => navigate("/invitations")}>
              <FaEnvelopeOpenText className="btn-icon" /> {t.viewDemo}
            </button>
          </motion.div>
        </div>

        <motion.div 
          className="hero-image-wrapper"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="hero-image-frame">
            <div className="hero-image-glow"></div>
            <img 
              src="images/1758566259-hero-adovasio3.avif" 
              alt="Premium Digital Invitation Mockup" 
              className="hero-display-image"
            />
            <div className="floating-badge-glass badge-left">
              <span className="badge-icon">✨</span>
              <span className="badge-text">Premium Design</span>
            </div>
            <div className="floating-badge-glass badge-right">
              <span className="badge-icon">💌</span>
              <span className="badge-text">Interactive 3D</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
