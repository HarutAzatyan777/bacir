import { useState, useEffect } from "react";
import "./SplashIntro.css";
import { useLanguage } from "../../context/LanguageContext";
import { FaSpinner } from "react-icons/fa";

const translations = {
  am: {
    loading: "Բեռնվում է",
    openBtn: "ԲԱՑԵԼ ՀՐԱՎԵՐՔԸ"
  },
  ru: {
    loading: "Загрузка",
    openBtn: "ОТКРЫТЬ ПРИГЛАШЕНИЕ"
  },
  en: {
    loading: "Loading",
    openBtn: "OPEN INVITATION"
  }
};

export default function SplashIntro({
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

  const handleOpen = () => {
    if (isOpened) return;
    setOpened(true);
    if (onStartOpen) onStartOpen();

    setTimeout(() => {
      setFadingOut(true);
    }, 1000);

    setTimeout(() => {
      if (onOpen) onOpen();
    }, 1600);
  };

  const textStyle = envelopeTextColor ? { color: envelopeTextColor } : {};
  const fontClass = envelopeTextFont ? `font-${envelopeTextFont}` : "font-default";

  return (
    <div
      className={`splash-stage ${isOpened ? "open" : ""} ${isFadingOut ? "fade-out" : ""}`}
      style={{
        backgroundColor: envelopeBgColor || "#2c3a1c",
        "--loading-bg": loadingBgColor || envelopeBgColor || "#2c3a1c"
      }}
    >
      {/* Background Image if uploaded */}
      {envelopeBgUrl && (
        <div 
          className="splash-bg-image" 
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
        <div className={`splash-loading-overlay ${isHidingLoading ? "hide" : ""}`}>
          <div className="splash-loading-content">
            <FaSpinner className="splash-loading-spinner" />
            <p className="splash-loading-text">
              {t.loading}
              {dots}
            </p>
          </div>
        </div>
      )}

      {/* Splash Content Panel */}
      {!isLoading && (
        <div className="splash-card" onClick={handleOpen}>
          <div className="splash-card-inner">
            {sealInitials && (
              <div className={`splash-monogram ${fontClass}`} style={textStyle}>
                {sealInitials}
              </div>
            )}
            <div className="splash-divider" />
            
            <button className="splash-open-btn" onClick={handleOpen}>
              {t.openBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
