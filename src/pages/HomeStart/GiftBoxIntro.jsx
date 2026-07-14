import { useState, useEffect } from "react";
import "./GiftBox.css";
import { useLanguage } from "../../context/LanguageContext";
import { FaSpinner } from "react-icons/fa";

const translations = {
  am: {
    loading: "Բեռնվում է",
    openText1: "Հրավերը բացելու համար",
    openText2: "սեղմեք ժապավենին"
  },
  ru: {
    loading: "Загрузка",
    openText1: "Чтобы открыть приглашение",
    openText2: "нажмите на ленту"
  },
  en: {
    loading: "Loading",
    openText1: "To open the invitation",
    openText2: "click on the ribbon"
  }
};

export default function GiftBoxIntro({
  onOpen,
  onStartOpen,
  sealInitials,
  heroBgMobile,
  heroBgDesktop,
  envelopeBgUrl,
  envelopeBgColor,
  loadingBgColor,
  envelopeTextColor,
  envelopeTextFont
}) {
  const { currentLang } = useLanguage();
  const t = translations[currentLang];

  const [isOpened, setOpened] = useState(false);
  const [isFadingOut, setFadingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dots, setDots] = useState("");
  const [isHidingLoading, setIsHidingLoading] = useState(false);

  useEffect(() => {
    const imagesToLoad = [];
    if (heroBgDesktop) imagesToLoad.push(heroBgDesktop);
    if (heroBgMobile) imagesToLoad.push(heroBgMobile);
    if (envelopeBgUrl) imagesToLoad.push(envelopeBgUrl);

    const imagePromises = imagesToLoad.map((src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
      });
    });

    const minDelay = new Promise((resolve) => setTimeout(resolve, 1500));

    Promise.all([...imagePromises, minDelay]).then(() => {
      setIsHidingLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    });
  }, [heroBgDesktop, heroBgMobile, envelopeBgUrl]);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, [isLoading]);

  const openBox = () => {
    if (isOpened) return;
    setOpened(true);
    if (onStartOpen) onStartOpen();

    setTimeout(() => {
      setFadingOut(true);
    }, 1500);

    setTimeout(() => {
      if (onOpen) onOpen();
    }, 2100);
  };

  const textStyle = envelopeTextColor ? { color: envelopeTextColor } : {};
  const fontClass = envelopeTextFont ? `font-${envelopeTextFont}` : "font-default";

  return (
    <div
      className={`gift-box-stage ${isOpened ? "open" : ""} ${isFadingOut ? "fade-out" : ""}`}
      style={{
        backgroundColor: envelopeBgColor || "#2c3a1c",
        "--loading-bg": loadingBgColor || envelopeBgColor || "#2c3a1c"
      }}
    >
      {/* Background Image if uploaded */}
      {envelopeBgUrl && (
        <div 
          className="gift-box-bg-image" 
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${envelopeBgUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.45,
            zIndex: 1
          }}
        />
      )}
      {/* Loading Overlay */}
      {isLoading && (
        <div className={`gift-box-loading-overlay ${isHidingLoading ? "hide" : ""}`}>
          <div className="gift-box-loading-content">
            <FaSpinner className="gift-box-loading-spinner" />
            <p className="gift-box-loading-text">
              {t.loading}
              {dots}
            </p>
          </div>
        </div>
      )}

      {/* Ribbon instruction */}
      {!isOpened && !isLoading && (
        <div className="gift-box-instruction" onClick={openBox}>
          <p>{t.openText1}</p>
          <span className="accent-hint">{t.openText2}</span>
        </div>
      )}

      {/* Gift Box Container */}
      {!isLoading && (
        <div className="gift-box-wrapper" onClick={openBox}>
          <div className="gift-box">
            {/* Ribbon Bow on top */}
            <div className="gift-box-bow">
              <div className="bow-left"></div>
              <div className="bow-right"></div>
              <div className="bow-center"></div>
            </div>

            {/* Lid */}
            <div className="gift-box-lid">
              <div className="lid-ribbon"></div>
            </div>

            {/* Box Body */}
            <div className="gift-box-body">
              <div className="body-ribbon-v"></div>
              <div className="body-ribbon-h"></div>
            </div>

            {/* Hidden Card inside box (slides up on click) */}
            <div className="gift-box-card">
              <div className="card-inner">
                {sealInitials && (
                  <div className={`card-monogram ${fontClass}`} style={textStyle}>
                    {sealInitials}
                  </div>
                )}
                <div className="card-divider" />
                <span className="card-invite-text">INVITATION</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
