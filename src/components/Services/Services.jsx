import React from "react";
import "./Services.css";

export default function Services() {
  const services = [
    { title: "Wedding Invitations", description: "Elegant designs for your special day." },
    { title: "Corporate Events", description: "Professional invitations for business gatherings." },
    { title: "Birthday Parties", description: "Creative and fun invitations for all ages." },
    { title: "Custom Design", description: "Tailored to your unique style and occasion." },
  ];

  return (
    <section className="services">
      <div className="services-container">
        <h2 className="services-title">Our Services</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
