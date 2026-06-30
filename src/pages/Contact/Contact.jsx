import React from "react";
import ContactForm from "../../components/ContactForm/ContactForm";
import { useLanguage } from "../../context/LanguageContext"; // Ներմուծում ենք context-ը
import "./Contact.css";

const translations = {
  am: {
    title: "Հաստատեք Ձեր մասնակցությունը"
  },
  ru: {
    title: "Подтвердите ваше присутствие"
  }
};

export default function Contact() {
  const { currentLang } = useLanguage();
  const t = translations[currentLang];

  return (
    <div className="contact">
      {/* Օգտագործում ենք թարգմանված վերնագիրը */}
      <h2>{t.title}</h2>
      <ContactForm />
    </div>
  );
}