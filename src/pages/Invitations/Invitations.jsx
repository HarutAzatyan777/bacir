import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { useLanguage } from "../../context/LanguageContext";
import { FaCalendarAlt, FaHeart, FaBirthdayCake, FaCross, FaEnvelopeOpenText, FaInfoCircle } from "react-icons/fa";
import { translations as landingTranslations } from "../Landing/translations";
import "./Invitations.css";

const localTranslations = {
  am: {
    title: "Մեր հրավիրատոմսերի օրինակները",
    subtitle: "Բացահայտեք մեր հարթակում ստեղծված իրական հրավիրատոմսերը և ոգեշնչվեք",
    loading: "Բեռնվում է...",
    noInvitations: "Հրավիրատոմսեր չեն գտնվել:",
    openBtn: "Բացել հրավերը",
    types: {
      wedding: "Հարսանիք",
      birthday: "Ծննդյան օր",
      baptism: "Կնունք",
      other: "Միջոցառում"
    }
  },
  ru: {
    title: "Примеры наших пригласительных",
    subtitle: "Откройте для себя реальные приглашения, созданные на нашей платформе, и вдохновляйтесь",
    loading: "Загрузка...",
    noInvitations: "Пригласительные не найдены.",
    openBtn: "Открыть приглашение",
    types: {
      wedding: "Свадьба",
      birthday: "День рождения",
      baptism: "Крещение",
      other: "Мероприятие"
    }
  },
  en: {
    title: "Our Invitation Samples",
    subtitle: "Explore real invitations created on our platform and get inspired",
    loading: "Loading...",
    noInvitations: "No invitations found.",
    openBtn: "Open Invitation",
    types: {
      wedding: "Wedding",
      birthday: "Birthday",
      baptism: "Baptism",
      other: "Event"
    }
  }
};

export default function Invitations() {
  const { currentLang } = useLanguage();
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const t = localTranslations[currentLang] || localTranslations.am;
  const lt = landingTranslations[currentLang] || landingTranslations.am;

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "invitations"));
        const list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setInvitations(list);
      } catch (err) {
        console.error("Error fetching invitations:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, []);

  const getEventIcon = (type) => {
    switch (type) {
      case "wedding":
        return <FaHeart className="event-type-icon wedding" />;
      case "birthday":
        return <FaBirthdayCake className="event-type-icon birthday" />;
      case "baptism":
        return <FaCross className="event-type-icon baptism" />;
      default:
        return <FaInfoCircle className="event-type-icon other" />;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(currentLang === "ru" ? "ru-RU" : currentLang === "en" ? "en-US" : "hy-AM", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  const getHeroNames = (hero) => {
    if (!hero || !hero.names) return "";
    return hero.names[currentLang] || hero.names.am || hero.names.en || hero.names.ru || "";
  };

  return (
    <div className="gallery-page-layout">
      {/* Background Glows */}
      <div className="gallery-glow-1"></div>
      <div className="gallery-glow-2"></div>

      <main className="gallery-main-container">
        <div className="gallery-header-block">
          <span className="gallery-pretitle">BACIR.ONLINE</span>
          <h1 className="gallery-main-title">{t.title}</h1>
          <p className="gallery-subtitle-text">{t.subtitle}</p>
        </div>

        {loading ? (
          <div className="gallery-loader-wrapper">
            <div className="premium-spinner">
              <div className="double-bounce1"></div>
              <div className="double-bounce2"></div>
            </div>
            <p className="loader-text">{t.loading}</p>
          </div>
        ) : error ? (
          <div className="gallery-error-banner">
            <p>Տվյալների բեռնման սխալ / Ошибка загрузки данных / Data loading error</p>
          </div>
        ) : invitations.length === 0 ? (
          <div className="gallery-empty-state">
            <FaEnvelopeOpenText className="empty-icon" />
            <p>{t.noInvitations}</p>
          </div>
        ) : (
          <div className="invitations-grid">
            {invitations.map((invite) => {
              const names = getHeroNames(invite.hero);
              const eventDateStr = invite.calendar?.eventDate;
              const formattedDate = formatDate(eventDateStr);
              const eventTypeName = t.types[invite.eventType] || t.types.other;
              
              // Determine card image: prefer hero mobile, then hero desktop, then envelope, fallback to gradient
              const cardImage = invite.hero?.bgMobileUrl || invite.hero?.bgDesktopUrl || invite.envelopeBgUrl;

              return (
                <div key={invite.id} className="invitation-card-item">
                  <div className="card-image-container">
                    {cardImage ? (
                      <img 
                        src={cardImage} 
                        alt={names || invite.eventName || "Invitation preview"} 
                        className="card-preview-img"
                        loading="lazy"
                      />
                    ) : (
                      <div className="card-gradient-fallback">
                        <div className="fallback-inner-gold">BACIR</div>
                      </div>
                    )}
                    <div className="card-badge-type">
                      {getEventIcon(invite.eventType)}
                      <span>{eventTypeName}</span>
                    </div>
                  </div>

                  <div className="card-info-content">
                    <h3 className="card-event-title">
                      {names || invite.eventName || eventTypeName}
                    </h3>
                    
                    {formattedDate && (
                      <div className="card-date-info">
                        <FaCalendarAlt className="date-icon" />
                        <span>{formattedDate}</span>
                      </div>
                    )}

                    <button 
                      onClick={() => navigate(`/i/${invite.id}`)}
                      className="card-open-action-btn"
                    >
                      {t.openBtn}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
