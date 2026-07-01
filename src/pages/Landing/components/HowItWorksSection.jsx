import React from "react";

export default function HowItWorksSection({ t }) {
  return (
    <section className="how-it-works-section">
      <div className="section-header">
        <h2>{t.howItWorksTitle}</h2>
      </div>

      <div className="timeline-container">
        <div className="timeline-step">
          <div className="step-number">1</div>
          <h4>{t.step1Title}</h4>
          <p>{t.step1Desc}</p>
        </div>
        <div className="timeline-step">
          <div className="step-number">2</div>
          <h4>{t.step2Title}</h4>
          <p>{t.step2Desc}</p>
        </div>
        <div className="timeline-step">
          <div className="step-number">3</div>
          <h4>{t.step3Title}</h4>
          <p>{t.step3Desc}</p>
        </div>
        <div className="timeline-step">
          <div className="step-number">4</div>
          <h4>{t.step4Title}</h4>
          <p>{t.step4Desc}</p>
        </div>
      </div>
    </section>
  );
}
