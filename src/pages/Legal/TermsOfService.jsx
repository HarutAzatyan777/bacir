import React from "react";
import { useNavigate } from "react-router-dom";
import "./TermsOfService.css";

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="legal-container">
      <div className="legal-card">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Назад / Back
        </button>

        <h1>Օգտագործման Պայմաններ / Terms of Service</h1>
        <p className="last-updated">Last Updated: July 7, 2026</p>

        <section className="legal-section">
          <h2>1. Ընդհանուր դրույթներ (Armenian)</h2>
          <p>
            Բարի գալուստ bacir.online: Մեր հարթակից օգտվելով՝ Դուք համաձայնում եք սույն օգտագործման պայմաններին:
            Հարթակը նախատեսված է թվային հրավերներ ստեղծելու և կառավարելու համար:
          </p>
          <h2>1. Terms & Conditions (English)</h2>
          <p>
            By accessing or using bacir.online, you agree to be bound by these Terms of Service. 
            Our platform allows users to design, manage, and share digital event invitations.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Հաշվի Գրանցում և Կանոններ</h2>
          <p>
            Օգտատերը պարտավոր է տրամադրել ճշգրիտ տվյալներ գրանցման ժամանակ:
            Դուք պատասխանատու եք Ձեր գաղտնաբառի գաղտնիության և Ձեր հաշվի միջոցով կատարված բոլոր գործողությունների համար:
          </p>
          <h2>2. Account Registration</h2>
          <p>
            Users must provide accurate information during signup. You are solely responsible for maintaining 
            the confidentiality of your account credentials and password.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Վճարումներ և Coin-բոնուսներ</h2>
          <p>
            Հարթակն օգտագործում է մետաղադրամների (coins) համակարգ հրավերների հրապարակման համար: 
            Կատարված բոլոր վճարումները վերջնական են և ենթակա չեն վերադարձման, բացառությամբ ՀՀ օրենսդրությամբ սահմանված դեպքերի:
          </p>
          <h2>3. Payments & Coins</h2>
          <p>
            The platform utilizes a virtual coin-based system for publishing invitations. All purchases are final 
            and non-refundable, except as required by local consumer protection laws.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Պատասխանատվության Սահմանափակում</h2>
          <p>
            bacir.online-ը պատասխանատվություն չի կրում հյուրերի կողմից ուղարկված RSVP պատասխանների ճշգրտության կամ 
            ծառայության ժամանակավոր տեխնիկական ընդհատումների համար:
          </p>
          <h2>4. Limitation of Liability</h2>
          <p>
            We are not liable for guest-submitted RSVP content or temporary server downtime. The service is provided 
            on an "as is" and "as available" basis.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Կապ մեզ հետ / Contact Us</h2>
          <p>
            Հարցերի դեպքում կարող եք կապնվել մեզ հետ՝ support@bacir.online էլ. հասցեով:
          </p>
          <p>
            For any inquiries, please contact us at support@bacir.online.
          </p>
        </section>
      </div>
    </div>
  );
}
