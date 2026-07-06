import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "./translations";
import LandingHeader from "./components/LandingHeader";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import AdminPreviewSection from "./components/AdminPreviewSection";
import PricingSection from "./components/PricingSection";
import OrderPromoSection from "./components/OrderPromoSection";
import LandingFooter from "./components/LandingFooter";
import GallerySection from "./components/GallerySection";
import ImageDivider from "./components/ImageDivider";
import "./LandingPage.css";

export default function LandingPage() {
  const { currentLang } = useLanguage();
  const t = translations[currentLang];
  const [selectedPlan, setSelectedPlan] = useState("");

  return (
    <div className="landing-layout">
      {/* Background Glows */}
      <div className="glow-1"></div>
      <div className="glow-2"></div>

      {/* Landing Header/Navbar */}
      <LandingHeader t={t} />

      {/* Hero Section */}
      <HeroSection t={t} />

      {/* Features Section */}
      <FeaturesSection t={t} />

      {/* Section Divider 1 */}
      <ImageDivider 
        bgImage="images/1749120139-hero1.avif" 
        text1={t.dividerText1} 
        text2={t.dividerText2} 
      />

      {/* How It Works Section */}
      <HowItWorksSection t={t} />

      {/* Gallery Section */}
      <GallerySection t={t} />

      {/* Admin Preview Section */}
      <AdminPreviewSection t={t} />

      {/* Pricing Tiers & Promotions Section */}
      <PricingSection t={t} onSelectPlan={setSelectedPlan} />

      {/* Order Promotion / Advertisement Section */}
      <OrderPromoSection t={t} selectedPlan={selectedPlan} />

      {/* Footer */}
      <LandingFooter t={t} />
    </div>
  );
}

