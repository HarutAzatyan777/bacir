import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";

export default function LandingHeader({ t }) {
  const { currentLang, changeLanguage } = useLanguage();
  const navigate = useNavigate();

  return (
    <header className="landing-header">
      <div className="logo-section">
        <span className="logo-gold">BACIR</span>
        <span className="logo-sub">ONLINE</span>
      </div>
      <div className="nav-actions">
        <div className="lang-selector-glass">
          <button 
            className={currentLang === "am" ? "active" : ""} 
            onClick={() => changeLanguage("am")}
          >
            AM
          </button>
          <button 
            className={currentLang === "ru" ? "active" : ""} 
            onClick={() => changeLanguage("ru")}
          >
            RU
          </button>
          <button 
            className={currentLang === "en" ? "active" : ""} 
            onClick={() => changeLanguage("en")}
          >
            EN
          </button>
        </div>
        <button className="nav-admin-btn" onClick={() => navigate("/admin")}>
          {t.adminPanel}
        </button>
      </div>
    </header>
  );
}
