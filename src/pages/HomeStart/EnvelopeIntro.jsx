import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
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

export default function EnvelopeIntro({ onOpen, sealInitials, heroBgMobile, heroBgDesktop, envelopeBgUrl, envelopeBgColor, loadingBgColor }){

const navigate = useNavigate()
const { currentLang } = useLanguage()
const t = translations[currentLang]

const [isOpened,setOpened] = useState(false)
const [isFadingOut, setFadingOut] = useState(false)
const [isLoading, setIsLoading] = useState(true)
const [dots, setDots] = useState("")
const [isHidingLoading, setIsHidingLoading] = useState(false)

const imageUrl = envelopeBgUrl || "/texture.webp";

useEffect(() => {
const imagesToLoad = [
  envelopeBgUrl || "texture.webp",
  heroBgDesktop || "images/wedding-hero.webp",
  heroBgMobile || "images/wedding-hero-mobile.webp"
];

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
    backgroundColor: envelopeBgColor || undefined
  }}
>

<div className="envelope" onClick={openEnvelope}>

<div className="pouch">

<div className="fold-left"/>
<div className="fold-right"/>
<div className="fold-bottom"/>

</div>

<div className="bottom-text">
{t.openText1}<br/>
{t.openText2}
</div>

<div className="flap-wrapper">

<div className="flap"/>

<div className="seal">
<span>{sealInitials || "RL"}</span>
</div>

</div>

</div>

</div>
  </>
  )
}