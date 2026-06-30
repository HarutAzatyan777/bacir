import React, { useState, useEffect, useMemo } from "react";
import "./Galery.css";
import photo from "../../assets/photo2.jpg"; // տեղադրեք Ձեր լուսանկարը public պապկայում
import { useLanguage } from "../../context/LanguageContext";

const translations = {
  am: {
    days: "օր",
    hours: "ժամ",
    minutes: "րոպե",
    seconds: "վայրկյան",
  },
  ru: {
    days: "дней",
    hours: "часов",
    minutes: "минут",
    seconds: "секунд",
  }
};

export default function Galery({ galleryData, eventDate }) {
  const { currentLang } = useLanguage();
  const t = translations[currentLang];

  // Դինամիկ կամ լռելյայն ամսաթիվ հաշվարկի համար
  const targetDate = useMemo(() => {
    if (eventDate) {
      return new Date(eventDate);
    }
    return new Date(2026, 5, 6, 14, 30, 0);
  }, [eventDate]);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const images = galleryData?.images || [];

  return (
    <div className="galery-container">
      
      <div className="countdown-container" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', maxWidth: '300px', margin: '10px auto' }}>
          {/* Days Card */}
          <div className="countdown-card">
            <span style={{ display: 'block', fontWeight: "bold", fontSize: "2.5rem", lineHeight: '1.2' }}>
              {timeLeft.days}
            </span>
            <span style={{ fontSize: "1rem" }}>{t.days}</span>
          </div>

          {/* Hours Card */}
          <div className="countdown-card">
            <span style={{ display: 'block', fontWeight: "bold", fontSize: "2.5rem", lineHeight: '1.2' }}>
              {timeLeft.hours}
            </span>
            <span style={{ fontSize: "1rem" }}>{t.hours}</span>
          </div>

          {/* Minutes Card */}
          <div className="countdown-card">
            <span style={{ display: 'block', fontWeight: "bold", fontSize: "2.5rem", lineHeight: '1.2' }}>
              {timeLeft.minutes}
            </span>
            <span style={{ fontSize: "1rem" }}>{t.minutes}</span>
          </div>

          {/* Seconds Card */}
          <div className="countdown-card">
            <span style={{ display: 'block', fontWeight: "bold", fontSize: "2.5rem", lineHeight: '1.2' }}>
              {timeLeft.seconds}
            </span>
            <span style={{ fontSize: "1rem" }}>{t.seconds}</span>
          </div>
        </div>
      </div>

      <div className="galery-photo-grid">
        {images.length > 0 ? (
          images.map((src, index) => (
            <div key={index} className="galery-photo-wrapper">
              <img src={src} alt={`Event ${index + 1}`} className="galery-photo" loading="lazy" />
            </div>
          ))
        ) : (
          <div className="galery-photo-wrapper">
            <img src={photo} alt="Event" className="galery-photo" />
          </div>
        )}
      </div>
    </div>
  );
}

