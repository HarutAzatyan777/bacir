import React from "react";

export default function ThemeTab({
  primaryColor,
  setPrimaryColor,
  accentColor,
  setAccentColor,
  bgColor,
  setBgColor,
  textColor,
  setTextColor,
  sectionPadding,
  setSectionPadding,
  containerWidth,
  setContainerWidth,
  fontMain,
  setFontMain
}) {
  return (
    <div className="tab-pane">
      <h3>Դիզայնի կարգավորումներ / Настройка дизайна (Styler)</h3>
      <p className="tab-desc" style={{ color: "#a3b899", fontSize: "0.85rem", marginBottom: "20px" }}>
        Անհատականացրեք ձեր հրավիրատոմսի գույները, տառատեսակները և դասավորությունը:
      </p>

      <div className="form-grid">
        <div className="form-field">
          <label>Հիմնական գույն (Primary Color)</label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              style={{ width: "60px", height: "40px", padding: "2px", border: "1px solid rgba(255,255,255,0.2)", background: "transparent", cursor: "pointer", borderRadius: "6px" }}
            />
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div className="form-field">
          <label>Ակցենտային գույն (Accent/Gold Color)</label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              style={{ width: "60px", height: "40px", padding: "2px", border: "1px solid rgba(255,255,255,0.2)", background: "transparent", cursor: "pointer", borderRadius: "6px" }}
            />
            <input
              type="text"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div className="form-field">
          <label>Ֆոնի գույն (Background Color)</label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              style={{ width: "60px", height: "40px", padding: "2px", border: "1px solid rgba(255,255,255,0.2)", background: "transparent", cursor: "pointer", borderRadius: "6px" }}
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div className="form-field">
          <label>Տեքստի գույն (Text Color)</label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              style={{ width: "60px", height: "40px", padding: "2px", border: "1px solid rgba(255,255,255,0.2)", background: "transparent", cursor: "pointer", borderRadius: "6px" }}
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div className="form-field">
          <label>Բաժնի հեռավորություն (Section Padding)</label>
          <input
            type="text"
            placeholder="80px 20px"
            value={sectionPadding}
            onChange={(e) => setSectionPadding(e.target.value)}
          />
          <small>Օրինակ՝ `80px 20px` (վերև/ներքև և աջ/ձախ):</small>
        </div>

        <div className="form-field">
          <label>Առավելագույն լայնություն (Container Width)</label>
          <input
            type="text"
            placeholder="1200px"
            value={containerWidth}
            onChange={(e) => setContainerWidth(e.target.value)}
          />
          <small>Օրինակ՝ `1200px` կամ `100%`:</small>
        </div>

        <div className="form-field full-width">
          <label>Տառատեսակ (Main Font)</label>
          <select
            value={fontMain}
            onChange={(e) => setFontMain(e.target.value)}
            style={{
              padding: "12px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "6px",
              color: "#fff",
              fontSize: "0.95rem",
              outline: "none",
              cursor: "pointer"
            }}
          >
            <option style={{ background: "#1c2e24", color: "#fff" }} value="'Montserrat', sans-serif">Montserrat (Modern Sans-Serif)</option>
            <option style={{ background: "#1c2e24", color: "#fff" }} value="'Playfair Display', serif">Playfair Display (Elegant Serif)</option>
            <option style={{ background: "#1c2e24", color: "#fff" }} value="'Inter', sans-serif">Inter (Clean Neutral)</option>
            <option style={{ background: "#1c2e24", color: "#fff" }} value="'Cormorant Garamond', serif">Cormorant Garamond (Classic Wedding Serif)</option>
            <option style={{ background: "#1c2e24", color: "#fff" }} value="'Great Vibes', cursive">Great Vibes (Romantic Script)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
