import React from "react";
import styles from "./LocationSection.module.css";
import { useLanguage } from "../../context/LanguageContext";

import ChurchIconOutline from "../../assets/icons/church.svg"; 
import RestaurantIconOutline from "../../assets/icons/restaurant.svg";
import BackgroundImage from "../../assets/images/watercolor.jpeg"; // Խորհուրդ. Փոխել .webp ֆորմատի

// Հղումների առանձնացում մաքուր կոդ ունենալու համար
const mapLinks = {
  church: "https://maps.app.goo.gl/qsWeW7gSqfhom3UJ6",
  party: "https://maps.app.goo.gl/Zrtg6zE89BrunNFk8"
};

const translations = {
  am: {
    mainTitle: "Տեղը և ժամանակացույցը",
    churchTitle: "ԵԿԵՂԵՑԻ",
    churchLoc: "Սուրբ Գրիգոր Լուսավորիչ մայր տաճար",
    churchMapAddr1: "Հայաստան, ք. Երևան",
    churchMapAddr2: "Երվանդ Քոչարի փողոց",
    partyTitle: "ՌԵՍՏՈՐԱՆ",
    partyLoc: "«Ռոդես» ռեստորան",
    partyAddr: "Նոր Դվին",
    partyMapAddr1: "Հայաստան, Արմավիրի մարզ, ք. Էջմիածին",
    partyMapAddr2: "Աշտարակի խճուղի, շենք 1",
    mapBtn: "Քարտեզ"
  },
  ru: {
    mainTitle: "Место и расписание",
    churchTitle: "ЦЕРКОВЬ",
    churchLoc: "Собор Святого Григория Просветителя",
    churchMapAddr1: "Армения, г. Ереван",
    churchMapAddr2: "ул. Ерванда Кочара",
    partyTitle: "РЕСТОРАН",
    partyLoc: "Ресторан «Родес»",
    partyAddr: "Нор Двин",
    partyMapAddr1: "Армения, Армавирская область, г. Эчмиадзин",
    partyMapAddr2: "Аштаракское шоссе, здание 1",
    mapBtn: "Карта"
  },
  en: {
    mainTitle: "Location & Schedule",
    churchTitle: "CHURCH",
    churchLoc: "St. Gregory the Illuminator Cathedral",
    churchMapAddr1: "Yerevan, Armenia",
    churchMapAddr2: "Yervand Kochar Street",
    partyTitle: "RESTAURANT",
    partyLoc: "«Rodes» Restaurant",
    partyAddr: "Nor Dvin",
    partyMapAddr1: "Echmiadzin, Armavir Province, Armenia",
    partyMapAddr2: "Ashtarak Highway, building 1",
    mapBtn: "Map"
  }
};

export default function LocationSection({ locationData }) {
  const { currentLang } = useLanguage();
  const t = translations[currentLang] || translations.am;

  const openMap = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Դինամիկ տվյալների սահմանում
  const displayMainTitle = locationData?.title?.[currentLang] || locationData?.title?.am || t.mainTitle;
  const bgImg = locationData?.bgUrl || BackgroundImage;

  const showChurch = locationData?.church?.show !== false;
  const showParty = locationData?.party?.show !== false;

  // Եկեղեցի
  const churchTitle = locationData?.church?.title?.[currentLang] || locationData?.church?.title?.am || t.churchTitle;
  const churchName = locationData?.church?.name?.[currentLang] || locationData?.church?.name?.am || t.churchLoc;
  const churchAddr1 = locationData?.church?.address1?.[currentLang] || locationData?.church?.address1?.am || t.churchMapAddr1;
  const churchAddr2 = locationData?.church?.address2?.[currentLang] || locationData?.church?.address2?.am || t.churchMapAddr2;
  const churchTime = locationData?.church?.time || "15:00";
  const churchMapLink = locationData?.church?.mapLink || mapLinks.church;
  const churchIcon = locationData?.church?.iconUrl || ChurchIconOutline;

  // Ռեստորան
  const partyTitle = locationData?.party?.title?.[currentLang] || locationData?.party?.title?.am || t.partyTitle;
  const partyName = locationData?.party?.name?.[currentLang] || locationData?.party?.name?.am || t.partyLoc;
  const partyAddrExtra = locationData?.party?.addressExtra?.[currentLang] || locationData?.party?.addressExtra?.am || t.partyAddr;
  const partyAddr1 = locationData?.party?.address1?.[currentLang] || locationData?.party?.address1?.am || t.partyMapAddr1;
  const partyAddr2 = locationData?.party?.address2?.[currentLang] || locationData?.party?.address2?.am || t.partyMapAddr2;
  const partyTime = locationData?.party?.time || "17:30";
  const partyMapLink = locationData?.party?.mapLink || mapLinks.party;
  const partyIcon = locationData?.party?.iconUrl || RestaurantIconOutline;

  const textColorStyle = locationData?.textColor ? { color: locationData.textColor } : {};

  return (
    <section className={styles.locationSection} style={textColorStyle}>
      <img 
        src={bgImg} 
        alt="Background" 
        className={styles.fullBackground}
        loading="lazy" 
      />
      <div className={styles.locationContentContainer}>
        <h2 className={styles.mainSectionTitle} style={textColorStyle}>{displayMainTitle}</h2>

        <div className={styles.timeline}>
          {/* Step 1: Church */}
          {showChurch && (
            <div className={styles.step}>
              <div className={styles.stepContentTop}>
                <h3 style={textColorStyle}>{churchTitle}</h3>
                <p className={styles.stepLocation} style={textColorStyle}>{churchName}</p>
                <span className={styles.stepTime} style={textColorStyle}>{churchTime}</span>
              </div>
              
              <div className={styles.stepIconCenter}>
                  <img 
                    src={churchIcon} 
                    alt="Church" 
                    className={styles.largeIcon} 
                    loading="lazy"
                  />
              </div>
              
              <p className={styles.stepAddress} style={{ marginBottom: '15px', ...textColorStyle }}>
                {churchAddr1} <br />
                {churchAddr2}
              </p>

              <button
                className={styles.mapButtonOutline}
                onClick={() => openMap(churchMapLink)}
              >
                {t.mapBtn}
              </button>
            </div>
          )}

          {/* Step 2: Restaurant */}
          {showParty && (
            <div className={styles.step}>
                <div className={styles.stepContentTop}>
                  <h3 style={textColorStyle}>{partyTitle}</h3>
                  <p className={styles.stepLocation} style={textColorStyle}>{partyName}</p>
                  {partyAddrExtra && <p className={styles.stepAddress} style={textColorStyle}>{partyAddrExtra}</p>}
                  <span className={styles.stepTime} style={textColorStyle}>{partyTime}</span>
                </div>

                <div className={styles.stepIconCenter}>
                    <img 
                      src={partyIcon} 
                      alt="Restaurant" 
                      className={styles.largeIcon} 
                      loading="lazy"
                    />
                </div>

                <p className={styles.stepAddress} style={{ marginBottom: '15px', ...textColorStyle }}>
                  {partyAddr1} <br />
                  {partyAddr2}
                </p>

                <button
                  className={styles.mapButtonOutline}
                  onClick={() => openMap(partyMapLink)}
                >
                  {t.mapBtn}
                </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}