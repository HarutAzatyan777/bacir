import React from "react";
import { 
  FaEnvelopeOpenText, 
  FaTelegramPlane, 
  FaMapMarkedAlt, 
  FaPalette, 
  FaImages, 
  FaCogs 
} from "react-icons/fa";
import "./FeaturesSection.css";

export default function FeaturesSection({ t }) {
  return (
    <section className="features-section">
      <div className="section-header">
        <h2>{t.featuresTitle}</h2>
        <p>{t.featuresSubtitle}</p>
      </div>

      <div className="features-grid">
        <div className="feature-glass-card">
          <div className="feat-icon-box">
            <FaEnvelopeOpenText />
          </div>
          <h3>{t.feat1Title}</h3>
          <p>{t.feat1Desc}</p>
        </div>

        <div className="feature-glass-card">
          <div className="feat-icon-box">
            <FaTelegramPlane />
          </div>
          <h3>{t.feat2Title}</h3>
          <p>{t.feat2Desc}</p>
        </div>

        <div className="feature-glass-card">
          <div className="feat-icon-box">
            <FaMapMarkedAlt />
          </div>
          <h3>{t.feat3Title}</h3>
          <p>{t.feat3Desc}</p>
        </div>

        <div className="feature-glass-card">
          <div className="feat-icon-box">
            <FaPalette />
          </div>
          <h3>{t.feat4Title}</h3>
          <p>{t.feat4Desc}</p>
        </div>

        <div className="feature-glass-card">
          <div className="feat-icon-box">
            <FaImages />
          </div>
          <h3>{t.feat5Title}</h3>
          <p>{t.feat5Desc}</p>
        </div>

        <div className="feature-glass-card">
          <div className="feat-icon-box">
            <FaCogs />
          </div>
          <h3>{t.feat6Title}</h3>
          <p>{t.feat6Desc}</p>
        </div>
      </div>
    </section>
  );
}
