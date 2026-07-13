import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import "./Envelope.css"
import { useLanguage } from "../../context/LanguageContext";
import { FaSpinner } from "react-icons/fa";

const translations = {
  am: {
    loading: "Բեռնվում է",
    openText1: "Հրավերը բացելու համար",
    openText2: "սեղմեք կնիքի վրա"
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

function isDarkColor(hex) {
  if (!hex) return false;
  const c = hex.replace("#", "");
  if (c.length === 3) {
    const r = parseInt(c.substr(0, 1) + c.substr(0, 1), 16);
    const g = parseInt(c.substr(1, 1) + c.substr(1, 1), 16);
    const b = parseInt(c.substr(2, 1) + c.substr(2, 1), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  }
  if (c.length === 6) {
    const r = parseInt(c.substr(0, 2), 16);
    const g = parseInt(c.substr(2, 2), 16);
    const b = parseInt(c.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  }
  return false;
}

function hexToRgba(hex, alpha = 0.45) {
  if (!hex) return `rgba(44, 58, 28, ${alpha})`;
  const cleanHex = hex.replace("#", "");
  let r, g, b;
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex.charAt(0) + cleanHex.charAt(0), 16);
    g = parseInt(cleanHex.charAt(1) + cleanHex.charAt(1), 16);
    b = parseInt(cleanHex.charAt(2) + cleanHex.charAt(2), 16);
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  } else {
    return `rgba(44, 58, 28, ${alpha})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function EnvelopeIntro({ onOpen, onStartOpen, sealInitials, heroBgMobile, heroBgDesktop, envelopeBgUrl, envelopeBgColor, loadingBgColor, sealColor, sealShape, envelopeTextColor, envelopeTextFont }){

const navigate = useNavigate()
const { currentLang } = useLanguage()
const t = translations[currentLang]

const sealShapeClass = sealShape ? `seal-shape-${sealShape}` : "seal-shape-organic";

const sealStyle = sealColor ? {
  backgroundColor: sealColor,
  backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%)`
} : {};

const isDark = isDarkColor(sealColor || "#e7dcc8");
const sealSpanStyle = sealColor ? {
  color: isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.6)",
  textShadow: isDark 
    ? "1px 1px 1px rgba(0,0,0,0.5), -1px -1px 1px rgba(255,255,255,0.2)"
    : "1px 1px 1px rgba(255,255,255,0.7), -1px -1px 1px rgba(0,0,0,0.3)"
} : {};

const [isOpened,setOpened] = useState(false)
const [isFadingOut, setFadingOut] = useState(false)
const [isLoading, setIsLoading] = useState(true)
const [dots, setDots] = useState("")
const [isHidingLoading, setIsHidingLoading] = useState(false)

const imageUrl = envelopeBgUrl || "/texture.webp";

useEffect(() => {
  const imagesToLoad = [
    envelopeBgUrl || "/texture.webp"
  ];
  if (heroBgDesktop) imagesToLoad.push(heroBgDesktop);
  if (heroBgMobile) imagesToLoad.push(heroBgMobile);

  const imagePromises = imagesToLoad.map((src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = resolve;
      img.onerror = resolve; // Նույնիսկ եթե մի նկար չգտնվի, շարունակում ենք
    });
  });

  Promise.all(imagePromises).then(() => {
    setIsHidingLoading(true);
    // 0.5 վայրկյան սպասում ենք մարելու անիմացիայի ավարտին, որից հետո անջատում ենք loading-ը
    setTimeout(() => {
      setIsLoading(false);
    }, 500); 
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

useEffect(() => {
  // Եթե արդեն բեռնվել է, դադարեցնում ենք տայմերը
  if (!isLoading) return;
  let dotCount = 0;
  const interval = setInterval(() => {
    dotCount = (dotCount + 1) % 4; // Պտտվում է 0, 1, 2, 3 արժեքներով
    setDots(".".repeat(dotCount));
  }, 500); // Փոխվում է ամեն կես վայրկյանը մեկ
  return () => clearInterval(interval); // Մաքրում ենք տայմերը հիշողությունից
}, [isLoading]);

const openEnvelope = ()=>{

if(isOpened) return

setOpened(true)
if (onStartOpen) {
  onStartOpen();
}

// 1.5 վայրկյան սպասում ենք, որ ծրարի վերին մասը բացվի, ապա սկսում ենք մարել (fade-out) էկրանը
setTimeout(() => {
  setFadingOut(true)
}, 1500)

// Եվս 1 վայրկյան սպասում ենք մարելու անիմացիայի ավարտին, որից հետո փոխում ենք էջը
setTimeout(() => {
  if (onOpen) {
    onOpen();
  } else {
    navigate(`/home?lang=${currentLang}`)
  }
}, 3000)

}

return (
  <>
    {/* Բեռնման էկրան (եթե դեռ ամբողջովին չի անհետացել) */}
    {isLoading && (
      <div 
        className={`loading-screen ${isHidingLoading ? "fade-out" : ""}`}
        style={{ backgroundColor: loadingBgColor || undefined }}
      >
      <div className="spinner-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <FaSpinner className="spinner-icon" size={48} />
      </div>
      <p className="loading-text">{t.loading}{dots}</p>
    </div>
    )}
    
    {/* Հիմնական ծրարի էկրանը */}
    <div 
      className={`envelope-stage ${isOpened ? "open" : ""} ${isFadingOut ? "fade-out" : ""}`}
      style={{ 
        '--envelope-texture': `url(${imageUrl})`,
        backgroundColor: hexToRgba(envelopeBgColor, 0.45),
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "contain",
        backgroundRepeat: "repeat",
        backgroundBlendMode: "multiply"
      }}
    >
      <div className="envelope" onClick={openEnvelope}>

<div className="pouch">

<div className="fold-left"/>
<div className="fold-right"/>
<div className="fold-bottom"/>

</div>

<div 
  className="bottom-text"
  style={{
    color: envelopeTextColor || undefined,
    fontFamily: envelopeTextFont && envelopeTextFont !== "inherit" ? envelopeTextFont : undefined
  }}
>
{t.openText1}<br/>
{t.openText2}
</div>

<div className="flap-wrapper">

<div className="flap"/>

<div 
  className={`seal ${sealShapeClass}`}
  style={sealStyle}
>
<span style={sealSpanStyle}>{sealInitials || "RL"}</span>
</div>

</div>

</div>

</div>
  </>
  )
}