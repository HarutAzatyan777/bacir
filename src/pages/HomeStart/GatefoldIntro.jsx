import { useState, useEffect } from "react";
import "./GatefoldIntro.css";
import { useLanguage } from "../../context/LanguageContext";
import { FaSpinner } from "react-icons/fa";

const translations = {
  am: {
    loading: "Բեռնվում է",
    openText1: "Հրավերը բացելու համար",
    openText2: "բացեք դռները"
  },
  ru: {
    loading: "Загрузка",
    openText1: "Чтобы открыть приглашение",
    openText2: "откройте створки"
  },
  en: {
    loading: "Loading",
    openText1: "To open the invitation",
    openText2: "open the doors"
  }
};

export default function GatefoldIntro({
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

  const openGates = () => {
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
      className={`gatefold-stage ${isOpened ? "open" : ""} ${isFadingOut ? "fade-out" : ""}`}
      style={{
        backgroundColor: "#1c1c1c",
        "--loading-bg": loadingBgColor || envelopeBgColor || "#1c1c1c"
      }}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className={`gatefold-loading-overlay ${isHidingLoading ? "hide" : ""}`}>
          <div className="gatefold-loading-content">
            <FaSpinner className="gatefold-loading-spinner" />
            <p className="gatefold-loading-text">
              {t.loading}
              {dots}
            </p>
          </div>
        </div>
      )}

      {/* Instruction */}
      {!isOpened && !isLoading && (
        <div className="gatefold-instruction" onClick={openGates}>
          <p>{t.openText1}</p>
          <span className="accent-hint">{t.openText2}</span>
        </div>
      )}

      {/* Gatefold 3D Doors */}
      {!isLoading && (
        <div className="gatefold-wrapper" onClick={openGates}>
          {/* Background Image behind doors */}
          {envelopeBgUrl && (
            <div 
              className="gatefold-bg-image" 
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

          <div className="gatefold-door door-left" style={{ backgroundColor: envelopeBgColor || "#2c3e35" }}>
            <div className="door-panel-inner">
              <div className="door-pattern"></div>
            </div>
          </div>

          <div className="gatefold-lock">
            <div className="lock-plate">
              {sealInitials && (
                <div className={`lock-monogram ${fontClass}`} style={textStyle}>
                  {sealInitials?.substring(0, 2)}
                </div>
              )}
            </div>
          </div>

          <div className="gatefold-door door-right" style={{ backgroundColor: envelopeBgColor || "#2c3e35" }}>
            <div className="door-panel-inner">
              <div className="door-pattern"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
