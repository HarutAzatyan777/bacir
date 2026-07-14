/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarSection.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useLanguage } from "../../context/LanguageContext"; // Ներմուծում ենք context-ը

const translations = {
  am: {
    title: "Հիշարժան Մեր Օրը",
    intro: "Մենք շատ ուրախ ենք Ձեզ հետ կիսելու մեր կյանքի ամենասպասված ու անմոռանալի պահը։ Ձեր ներկայությունը մեզ համար անգին է։",
    invite: "Սիրով հրավիրում ենք Ձեզ լինել մեր կողքին և միասին տոնել այս գեղեցիկ օրը։ Եկեք միասին ստեղծենք անմոռանալի հիշողություններ։",
    remains: "Մնացել է",
    days: "օր",
    hours: "ժամ",
    minutes: "րոպե",
    seconds: "վայրկյան",
    calendarLocale: "hy-AM"
  },
  ru: {
    title: "Наш Особенный День",
    intro: "Мы очень рады разделить с вами самый долгожданный и незабываемый момент нашей жизни. Ваше присутствие бесценно для нас.",
    invite: "Мы с любовью приглашаем вас быть рядом с нами и вместе отпраздновать этот прекрасный день. Давайте вместе создавать незабываемые воспоминания.",
    remains: "Осталось",
    days: "дней",
    hours: "часов",
    minutes: "минут",
    seconds: "секунд",
    calendarLocale: "ru-RU"
  },
  en: {
    title: "Our Memorable Day",
    intro: "We are very happy to share with you the most anticipated and unforgettable moment of our lives. Your presence is invaluable to us.",
    invite: "We lovingly invite you to be by our side and celebrate this beautiful day together. Let's create unforgettable memories together.",
    remains: "Remaining",
    days: "days",
    hours: "hours",
    minutes: "minutes",
    seconds: "seconds",
    calendarLocale: "en-US"
  }
};

export default function CalendarSection({ calendarData }) {
  const { currentLang } = useLanguage();
  const t = translations[currentLang];

  // Map ringStyle value to CSS class
  const ringClassMap = {
    classic:   "ring-highlight",
    double:    "ring-highlight-double",
    rose:      "ring-highlight-rose",
    emerald:   "ring-highlight-emerald",
    platinum:  "ring-highlight-platinum",
    infinity:  "ring-highlight-infinity",
  };
  const ringClass = ringClassMap[calendarData?.ringStyle] || "ring-highlight";

  // Դինամիկ կամ լռելյայն ամսաթիվ
  const eventDate = useMemo(() => {
    if (calendarData?.eventDate) {
      return new Date(calendarData.eventDate);
    }
    // Հունիսի 6, 2026
    return new Date(2026, 5, 6, 14, 30, 0);
  }, [calendarData?.eventDate]);

  const [date, setDate] = useState(eventDate);

  // Թարմացնում ենք օրացույցի ընտրված օրը, երբ eventDate-ը փոխվում է
  useEffect(() => {
    setDate(eventDate);
  }, [eventDate]);

  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  const formatShortWeekday = (locale, date) => {
    const daysAm = ['ԿԻՐ', 'ԵՐԿ', 'ԵՐՔ', 'ՉՈՐ', 'ՀՆԳ', 'ՈՒՐԲ', 'ՇԲԹ'];
    const daysRu = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
    const daysEn = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    if (currentLang === 'ru') return daysRu[date.getDay()];
    if (currentLang === 'en') return daysEn[date.getDay()];
    return daysAm[date.getDay()];
  };

  const displayTitle = calendarData?.title?.[currentLang] || calendarData?.title?.am || t.title;
  const displayIntro = calendarData?.intro?.[currentLang] || calendarData?.intro?.am || t.intro;
  const displayInvite = calendarData?.invite?.[currentLang] || calendarData?.invite?.am || t.invite;
  const bgImg = calendarData?.bgUrl || "/location-bg.jpg";

  const textColorStyle = calendarData?.textColor ? { color: calendarData.textColor, textShadow: "none" } : {};

  return (
    <div
      className="calendar-section"
      data-aos="fade-up"
    >
      <div
        className="calendar-bg-overlay"
        style={{ backgroundImage: `url(${bgImg})` }}
      />
      
      <div className="calendar-content">
        <h2 data-aos="fade-down" className="section-title" style={textColorStyle}>
          {displayTitle}
        </h2>

        <p data-aos="fade-right" className="intro-text" style={textColorStyle}>
          {displayIntro}
        </p>

        <p data-aos="fade-left" className="invite-text" style={textColorStyle}>
          {displayInvite}
        </p>

        <div data-aos="flip-up" className="calendar-wrapper">
          <Calendar
            onChange={setDate}
            value={date}
            locale={t.calendarLocale}
            calendarType="iso8601" // Շաբաթը սկսում է երկուշաբթիից
            formatShortWeekday={formatShortWeekday}
            nextLabel={null} // Թաքցնում ենք սլաքները, որ լինի նկարի պես մինիմալիստական
            next2Label={null}
            prevLabel={null}
            prev2Label={null}
            tileClassName={({ date, view }) => {
              if (
                view === "month" &&
                date.getDate() === eventDate.getDate() &&
                date.getMonth() === eventDate.getMonth() &&
                date.getFullYear() === eventDate.getFullYear()
              ) {
                return "event-day";
              }
              return null;
            }}
            tileContent={({ date, view }) => {
              if (
                view === "month" &&
                date.getDate() === eventDate.getDate() &&
                date.getMonth() === eventDate.getMonth() &&
                date.getFullYear() === eventDate.getFullYear()
              ) {
                return <div className={ringClass}></div>; // Մատանիի էֆեկտը
              }
              return null;
            }}
          />
        </div>
      </div>
    </div>
  );
}