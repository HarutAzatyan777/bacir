import React from "react";
import { useNavigate } from "react-router-dom";
import "./PrivacyPolicy.css";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="legal-container">
      <div className="legal-card">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Назад / Back
        </button>

        <h1>Գաղտնիության Քաղաքականություն / Privacy Policy</h1>
        <p className="last-updated">Last Updated: July 7, 2026</p>

        <section className="legal-section">
          <h2>1. Ինչ տվյալներ ենք մենք հավաքագրում (Armenian)</h2>
          <p>
            Մենք հավաքագրում ենք Ձեր տրամադրած տվյալները (էլ. հասցե, անուն) և հյուրերի կողմից լրացված RSVP տվյալները (անուն, մասնակցության կարգավիճակ): 
            Google Sign-In-ից օգտվելիս մենք հավաքագրում ենք Ձեր հանրային պրոֆիլի տվյալները (էլ. հասցե, անուն, նկար):
          </p>
          <h2>1. Information We Collect (English)</h2>
          <p>
            We collect information you provide directly to us (email, name) and guest RSVP responses. 
            When using Google Sign-In, we receive basic profile info (email, name, profile picture) under Google's scopes.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Ինչպես ենք օգտագործում տվյալները</h2>
          <p>
            Տվյալներն օգտագործվում են Ձեզ ծառայություններ մատուցելու, հրավերները ցուցադրելու և RSVP պատասխանները Ձեր Telegram-ին կամ կառավարման վահանակին ուղարկելու համար:
          </p>
          <h2>2. How We Use Information</h2>
          <p>
            We process your information to deliver our services, render digital invitations, and route RSVP statistics 
            to your Telegram bot or administration dashboard.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Տվյալների Փոխանցումը Երրորդ Կողմերին</h2>
          <p>
            Մենք չենք վաճառում կամ փոխանցում Ձեր անձնական տվյալները երրորդ կողմերին, բացառությամբ անհրաժեշտ ենթակառուցվածքների (օրինակ՝ Firebase / Google Cloud):
          </p>
          <h2>3. Data Sharing</h2>
          <p>
            We do not sell or lease your personal data. Data is only processed on secure cloud infrastructure 
            (such as Google Firebase) required to serve our product.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Ձեր Իրավունքները (GDPR-ի համապատասխանություն)</h2>
          <p>
            Դուք իրավունք ունեք ցանկացած պահի ջնջել Ձեր հաշիվը և բոլոր տվյալները մեր համակարգից՝ կառավարման վահանակի միջոցով կամ կապ հաստատելով մեզ հետ:
          </p>
          <h2>4. Your Rights (GDPR & Data Erasure)</h2>
          <p>
            You have the right to request deletion of your account and personal data from our servers at any time 
            by contacting us directly.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Կապ մեզ հետ / Contact Us</h2>
          <p>
            Գաղտնիության հարցերի դեպքում կարող եք գրել մեզ՝ privacy@bacir.online էլ. հասցեով:
          </p>
          <p>
            For privacy inquiries, contact us at privacy@bacir.online.
          </p>
        </section>
      </div>
    </div>
  );
}
