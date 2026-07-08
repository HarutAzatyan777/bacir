import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext"; // Ներմուծում ենք hook-ը
import { FaMusic, FaVolumeMute } from "react-icons/fa";
import { Dropdown, Button } from "antd";
import { GlobalOutlined, DownOutlined } from "@ant-design/icons";

import HeroSection from "../../components/HeroSection/HeroSection";
import InvitationText from "../../components/InvitationText/InvitationText";
import CalendarSection from "../../components/CalendarSection/CalendarSection";
import LocationSection from "../../components/LocationSection/LocationSection";
import DressCodeSection from "../../components/DressCodeSection/DressCodeSection";
import Galery from "../../components/Galery/Galery";

import "./Home.css";

export default function Home({ invitationData }) {
  // Ստանում ենք լեզուն և փոխելու ֆունկցիան Context-ից
  const { currentLang, changeLanguage } = useLanguage();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const audioRef = useRef(null);

  // Փորձում ենք ավտոմատ միացնել երաժշտությունը (autoplay) հենց էջը բացվում է
  useEffect(() => {
    let interactionHandler;
    const currentAudio = audioRef.current; // Պահպանում ենք հղումը մաքրման ֆունկցիայի համար

    // Ֆունկցիա՝ երաժշտությունը աստիճանաբար միացնելու համար (Fade-in)
    const fadeInAudio = async () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.volume = 0; // Սկզբնական ձայնը դնում ենք 0
        await audioRef.current.play();
        setIsPlaying(true);

        // Աստիճանաբար բարձրացնում ենք ձայնը
        let vol = 0;
        const fadeInterval = setInterval(() => {
          vol += 0.05; // Ավելացնում ենք 5% ամեն քայլին
          if (vol >= 1) {
            clearInterval(fadeInterval);
            vol = 1;
          }
          if (audioRef.current) {
            audioRef.current.volume = vol;
          }
        }, 150); // 150ms մեկ փոխվում է (ամբողջ պրոցեսը կտևի 3 վայրկյան)
      }
    };

    const playAudio = async () => {
      try {
        await fadeInAudio();
      } catch (err) {
        console.log("Autoplay blocked. Waiting for user interaction.", err);
        // Եթե բրաուզերը արգելում է առանց քլիքի միացումը, սպասում ենք առաջին քլիքին
        interactionHandler = () => {
          fadeInAudio().catch((e) => console.log("Audio play failed:", e));
          document.removeEventListener("click", interactionHandler);
        };
        document.addEventListener("click", interactionHandler);
      }
    };

    playAudio();

    // Մաքրման ֆունկցիա՝ էջը փակելիս երաժշտությունը կանգնեցնելու համար
    return () => {
      if (interactionHandler) {
        document.removeEventListener("click", interactionHandler);
      }
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, []);

  // Հետևել էջի ոլորմանը (scroll)
  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      // Եթե 200 միլիվայրկյան դադարում է ոլորելը, նորից դարձնում ենք տեսանելի
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const themeStyles = {
    "--primary-color": invitationData?.theme?.primaryColor || "#2c3e35",
    "--accent-color": invitationData?.theme?.accentColor || "#d4af37",
    "--bg-color": invitationData?.theme?.bgColor || "#fdfbf7",
    "--text-color": invitationData?.theme?.textColor || "#333333",
    "--section-padding": invitationData?.theme?.sectionPadding || "80px 20px",
    "--container-width": invitationData?.theme?.containerWidth || "1200px",
    "--font-main": invitationData?.theme?.fontMain || "'Montserrat', sans-serif"
  };

  return (
    <motion.div 
      className="home"
      style={themeStyles}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      {/* Աուդիո ֆայլը և կառավարման կոճակը */}
      <audio ref={audioRef} key={invitationData?.musicUrl || "/wedding-audio.mp3"} loop autoPlay>
        <source src={invitationData?.musicUrl || "/wedding-audio.mp3"} type="audio/mpeg" />
        {/* Որպեսզի լինտերը սխալ չտա track-ի բացակայության համար */}
        <track kind="captions" />
      </audio>
      <button 
        className={`audio-toggle-btn ${isPlaying ? "playing" : ""} ${isScrolling ? "scrolling" : ""}`} 
        onClick={toggleAudio}
      >
        {isPlaying ? <FaMusic size={20} color="#2c3e35" /> : <FaVolumeMute size={22} color="#555" />}
      </button>

      {/* Լեզվի փոխարկիչը թողնում ենք այստեղ կամ տեղափոխում Navbar */}
      <div className="language-switcher">
        <Dropdown 
          menu={{ 
            items: [
              { key: "am", label: "AM (Հայերեն)" },
              { key: "ru", label: "RU (Русский)" },
              { key: "en", label: "EN (English)" }
            ], 
            onClick: ({ key }) => changeLanguage(key),
            selectable: true,
            selectedKeys: [currentLang]
          }} 
          trigger={["click"]} 
          placement="bottomRight"
        >
          <Button className="language-switcher-btn" icon={<GlobalOutlined />}>
            <span style={{ marginRight: 6 }}>{currentLang.toUpperCase()}</span> <DownOutlined style={{ fontSize: "10px" }} />
          </Button>
        </Dropdown>
      </div>

      {/* Dynamic Sections */}
      {(invitationData?.sections || [
        { id: "hero", type: "hero", enabled: true },
        { id: "calendar", type: "calendar", enabled: true },
        { id: "location", type: "location", enabled: true },
        { id: "gallery", type: "gallery", enabled: true },
        { id: "dressCode", type: "dressCode", enabled: invitationData?.dressCode?.show !== false },
        { id: "rsvp", type: "rsvp", enabled: true }
      ]).map((section) => {
        if (!section.enabled) return null;

        switch (section.type) {
          case "hero":
            return (
              <HeroSection 
                key={section.id} 
                heroData={invitationData?.hero} 
                eventDate={invitationData?.calendar?.eventDate} 
              />
            );
          case "calendar":
            return (
              <CalendarSection 
                key={section.id} 
                calendarData={invitationData?.calendar} 
              />
            );
          case "location":
            return (
              <LocationSection 
                key={section.id} 
                locationData={invitationData?.location} 
              />
            );
          case "gallery":
            return (
              <Galery 
                key={section.id} 
                galleryData={invitationData?.gallery} 
                eventDate={invitationData?.calendar?.eventDate} 
              />
            );
          case "dressCode":
            return (
              <DressCodeSection 
                key={section.id} 
                dressCodeData={invitationData?.dressCode} 
              />
            );
          case "rsvp":
            return (
              <InvitationText 
                key={section.id} 
                rsvpData={invitationData?.rsvp} 
                invitationId={invitationData?.id} 
              />
            );
          case "customText":
            return (
              <motion.div
                key={section.id}
                className="custom-section"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <div className="custom-section-content">
                  {section.title?.[currentLang] && (
                    <h2 className="custom-section-title">{section.title[currentLang]}</h2>
                  )}
                  {section.content?.[currentLang] && (
                    <div className="custom-section-text">
                      {section.content[currentLang].split("\n").map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          default:
            return null;
        }
      })}
    </motion.div>
  );
}