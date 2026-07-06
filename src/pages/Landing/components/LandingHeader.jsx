import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";

export default function LandingHeader({ t }) {
  const { currentLang, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const clickCountRef = useRef(0);

  const handleLogoClick = () => {
    clickCountRef.current += 1;
    if (clickCountRef.current >= 7) {
      navigate("/admin");
      clickCountRef.current = 0;
    }
  };

  return (
    <header className="landing-header">
      <div className="logo-section" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
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
      </div>
    </header>
  );
}
