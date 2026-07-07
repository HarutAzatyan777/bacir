import React from "react";
import { Link } from "react-router-dom";

export default function LandingFooter({ t }) {
  return (
    <footer className="landing-footer">
      <div className="footer-links">
        <Link to="/terms">{t.termsOfService}</Link>
        <span className="footer-separator">|</span>
        <Link to="/privacy">{t.privacyPolicy}</Link>
      </div>
      <p>{t.footerText}</p>
    </footer>
  );
}
