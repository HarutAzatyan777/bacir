import { useState, useEffect } from "react";
import "./ScrollIntro.css";
import { useLanguage } from "../../context/LanguageContext";
import { FaSpinner } from "react-icons/fa";

const translations = {
  am: {
    loading: "Բեռնվում է",
    openText1: "Հրավերը բացելու համար",
    openText2: "սեղմեք կնիքին"
  },
  ru: {
    loading: "Загрузка",
    openText1: "Чтобы открыть приглашение",
    openText2: "нажмите на печать"
  },
  en: {
    loading: "Loading",
    openText1: "To open the invitation",
    openText2: "click on the seal"
  }
};

export default function ScrollIntro({
  onOpen,
  onStartOpen,
  sealInitials,
  heroBgMobile,
  heroBgDesktop,
  envelopeBgUrl,
  envelopeBgColor,
  loadingBgColor,
  sealColor,
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

  const openScroll = () => {
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
      className={`scroll-stage ${isOpened ? "open" : ""} ${isFadingOut ? "fade-out" : ""}`}
      style={{
        backgroundColor: envelopeBgColor || "#2c3a1c",
        "--loading-bg": loadingBgColor || envelopeBgColor || "#2c3a1c"
      }}
    >
      {/* Background Image if uploaded */}
      {envelopeBgUrl && (
        <div 
          className="scroll-bg-image" 
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
        <div className={`scroll-loading-overlay ${isHidingLoading ? "hide" : ""}`}>
          <div className="scroll-loading-content">
            <FaSpinner className="scroll-loading-spinner" />
            <p className="scroll-loading-text">
              {t.loading}
              {dots}
            </p>
          </div>
        </div>
      )}

      {/* Seal instruction */}
      {!isOpened && !isLoading && (
        <div className="scroll-instruction" onClick={openScroll}>
          <p>{t.openText1}</p>
          <span className="accent-hint">{t.openText2}</span>
        </div>
      )}

      {/* Scroll Wrapper */}
      {!isLoading && (
        <div className="scroll-wrapper" onClick={openScroll}>
          <div className="scroll-roller scroll-left">
            <div className="roller-handle top"></div>
            <div className="roller-body"></div>
            <div className="roller-handle bottom"></div>
          </div>

          <div className="scroll-content-paper">
            <div className="scroll-paper-inner">
              {sealInitials && (
                <div className={`scroll-monogram ${fontClass}`} style={textStyle}>
                  {sealInitials}
                </div>
              )}
              <div className="scroll-divider" />
              <span className="scroll-invite-text">INVITATION</span>
            </div>
          </div>

          <div className="scroll-roller scroll-right">
            <div className="roller-handle top"></div>
            <div className="roller-body"></div>
            <div className="roller-handle bottom"></div>
          </div>

          {/* Wax Seal holding it together in center */}
          {!isOpened && (
            <div 
              className="scroll-wax-seal"
              style={{ backgroundColor: sealColor || "#d4af37" }}
            >
              <div className="wax-seal-inner">
                {sealInitials?.substring(0, 2)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
