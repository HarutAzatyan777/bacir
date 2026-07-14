import { useState, useEffect } from "react";
import "./CurtainIntro.css";
import { useLanguage } from "../../context/LanguageContext";
import { FaSpinner } from "react-icons/fa";

const translations = {
  am: {
    loading: "Բեռնվում է",
    openText1: "Հրավերը բացելու համար",
    openText2: "բացեք վարագույրները"
  },
  ru: {
    loading: "Загрузка",
    openText1: "Чтобы открыть приглашение",
    openText2: "откройте занавес"
  },
  en: {
    loading: "Loading",
    openText1: "To open the invitation",
    openText2: "open the curtains"
  }
};

export default function CurtainIntro({
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

  const openCurtains = () => {
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
      className={`curtain-stage ${isOpened ? "open" : ""} ${isFadingOut ? "fade-out" : ""}`}
      style={{
        backgroundColor: "#161616",
        "--loading-bg": loadingBgColor || envelopeBgColor || "#161616"
      }}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className={`curtain-loading-overlay ${isHidingLoading ? "hide" : ""}`}>
          <div className="curtain-loading-content">
            <FaSpinner className="curtain-loading-spinner" />
            <p className="curtain-loading-text">
              {t.loading}
              {dots}
            </p>
          </div>
        </div>
      )}

      {/* Instruction */}
      {!isOpened && !isLoading && (
        <div className="curtain-instruction" onClick={openCurtains}>
          <p>{t.openText1}</p>
          <span className="accent-hint">{t.openText2}</span>
        </div>
      )}

      {/* Velvet Left and Right Curtains */}
      {!isLoading && (
        <div className="curtain-wrapper" onClick={openCurtains}>
          {/* Background Image behind curtains */}
          {envelopeBgUrl && (
            <div 
              className="curtain-bg-image" 
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: `url(${envelopeBgUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.65,
                zIndex: 1
              }}
            />
          )}

          <div className="curtain curtain-left" style={{ backgroundColor: envelopeBgColor || "#4a121a" }}>
            <div className="curtain-folds"></div>
          </div>

          <div className="curtain-tassel" onClick={openCurtains}>
            <div className="tassel-ring">
              <span className={`tassel-ring-text ${fontClass}`} style={textStyle}>
                {sealInitials?.substring(0, 2)}
              </span>
            </div>
            <div className="tassel-rope"></div>
          </div>

          <div className="curtain curtain-right" style={{ backgroundColor: envelopeBgColor || "#4a121a" }}>
            <div className="curtain-folds"></div>
          </div>
        </div>
      )}
    </div>
  );
}
