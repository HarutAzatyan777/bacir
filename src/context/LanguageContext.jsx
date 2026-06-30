import React, { createContext, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./LanguageContext.css"

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLang = searchParams.get("lang") || "am";

  const changeLanguage = (lang) => {
    setSearchParams({ lang });
  };

  // Կամընտիր: Փոխել էջի տիտղոսը կամ լեզվի ատրիբուտը HTML-ում
  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  return (
    <LanguageContext.Provider value={{ currentLang, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook՝ Context-ից օգտվելը հեշտացնելու համար
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};