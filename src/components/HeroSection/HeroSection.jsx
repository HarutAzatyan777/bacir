import React, { useState, useEffect } from "react";
import "./HeroSection.css";
import { useLanguage } from "../../context/LanguageContext";

const translations = {
  am: {
    names: "Ռոբերտ և Լուսինե",
    title: "Հարսանյաց Օր",
    date: "06. 06. 2026",
    scrollDown: "Շարունակել"
  },
  ru: {
    names: "Роберт и Лусине",
    title: "День Свадьбы",
    date: "06. 06. 2026",
    scrollDown: "Продолжить"
  }
};

export default function HeroSection({ heroData, eventDate }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { currentLang } = useLanguage();
  const t = translations[currentLang];

  // Լսում ենք էկրանի չափսի փոփոխությանը
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Սահուն սքրոլ դեպի հաջորդ բաժին
  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth"
    });
  };

  // Որոշում ենք նկարի հասցեն (ճիշտ նույնը, ինչ Preload-ի ժամանակ)
  const bgImage = isMobile 
    ? (heroData?.bgMobileUrl || "images/wedding-hero-mobile.webp") 
    : (heroData?.bgDesktopUrl || "images/wedding-hero.webp");

  // Դինամիկ անուններ, վերնագիր և ամսաթիվ
  const displayNames = heroData?.names?.[currentLang] || heroData?.names?.am || t.names;
  const displayTitle = heroData?.title?.[currentLang] || heroData?.title?.am || t.title;
  
  let displayDate = t.date;
  if (eventDate) {
    const dateObj = new Date(eventDate);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    displayDate = `${day}. ${month}. ${year}`;
  }

  return (
    <section 
      className="hero" 
      style={{ 
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="hero-content" data-aos="fade-zoom-in">
        <h1>{displayNames}</h1>
        <h2 className="subtitle">{displayTitle}</h2>
        <p>{displayDate}</p>
      </div>
      <div className="scroll-down-wrapper" onClick={handleScrollDown}>
        <span className="scroll-text">{t.scrollDown}</span>
        <span className="scroll-arrow">↓</span>
      </div>
    </section>
  );
}

