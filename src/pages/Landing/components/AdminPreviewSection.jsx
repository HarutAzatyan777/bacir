import React from "react";
import { FaCheckCircle } from "react-icons/fa";

export default function AdminPreviewSection({ t }) {
  return (
    <section className="admin-preview-section">
      <div className="admin-preview-content">
        <div className="admin-text-info">
          <h2>{t.adminPreviewTitle}</h2>
          <p>{t.adminPreviewDesc}</p>
          <ul className="admin-benefits-list">
            <li><FaCheckCircle className="check-icon" /> {t.adminFeature1}</li>
            <li><FaCheckCircle className="check-icon" /> {t.adminFeature2}</li>
            <li><FaCheckCircle className="check-icon" /> {t.adminFeature3}</li>
          </ul>
        </div>
        <div className="admin-mockup-wrapper">
          <div className="admin-mockup-window">
            <div className="mockup-header">
              <div className="mockup-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="mockup-title">Admin Dashboard</div>
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar">
                <div className="sidebar-item active">Dashboard</div>
                <div className="sidebar-item">Invitations</div>
                <div className="sidebar-item">Settings</div>
              </div>
              <div className="mockup-main">
                <div className="mockup-card-row">
                  <div className="mockup-stat-card">
                    <h5>Attending</h5>
                    <span className="stat-num">42</span>
                  </div>
                  <div className="mockup-stat-card">
                    <h5>Declined</h5>
                    <span className="stat-num">12</span>
                  </div>
                </div>
                <div className="mockup-table">
                  <div className="table-row header">
                    <span>Guest Name</span>
                    <span>RSVP</span>
                  </div>
                  <div className="table-row">
                    <span>Robert & Lusine</span>
                    <span className="rsvp-yes">Attending</span>
                  </div>
                  <div className="table-row">
                    <span>Gayane & Harut</span>
                    <span className="rsvp-yes">Attending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
