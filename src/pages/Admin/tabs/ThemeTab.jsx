import React from "react";
import { Input, Select, Typography } from "antd";

const { Title, Text } = Typography;
const { Option } = Select;

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
      <Title level={4} style={{ color: "#2c3e35", marginBottom: 6 }}>Դիզայնի կարգավորումներ / Theme Settings</Title>
      <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
        Անհատականացրեք ձեր հրավիրատոմսի գույները, տառատեսակները և դասավորությունը:
      </Text>

      <div className="form-grid">
        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Հիմնական գույն (Primary Color)</label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              style={{ width: "60px", height: "40px", padding: "2px", border: "1px solid #cbd5e1", background: "transparent", cursor: "pointer", borderRadius: "6px" }}
            />
            <Input
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              size="large"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Ակցենտային գույն (Accent/Gold Color)</label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              style={{ width: "60px", height: "40px", padding: "2px", border: "1px solid #cbd5e1", background: "transparent", cursor: "pointer", borderRadius: "6px" }}
            />
            <Input
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              size="large"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Ֆոնի գույն (Background Color)</label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              style={{ width: "60px", height: "40px", padding: "2px", border: "1px solid #cbd5e1", background: "transparent", cursor: "pointer", borderRadius: "6px" }}
            />
            <Input
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              size="large"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Տեքստի գույն (Text Color)</label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              style={{ width: "60px", height: "40px", padding: "2px", border: "1px solid #cbd5e1", background: "transparent", cursor: "pointer", borderRadius: "6px" }}
            />
            <Input
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              size="large"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Բաժնի հեռավորություն (Section Padding)</label>
          <Input
            placeholder="80px 20px"
            value={sectionPadding}
            onChange={(e) => setSectionPadding(e.target.value)}
            size="large"
          />
          <small style={{ display: "block", marginTop: 4, color: "#64748b" }}>Օրինակ՝ `80px 20px` (վերև/ներքև և աջ/ձախ):</small>
        </div>

        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Առավելագույն լայնություն (Container Width)</label>
          <Input
            placeholder="1200px"
            value={containerWidth}
            onChange={(e) => setContainerWidth(e.target.value)}
            size="large"
          />
          <small style={{ display: "block", marginTop: 4, color: "#64748b" }}>Օրինակ՝ `1200px` կամ `100%`:</small>
        </div>

        <div className="form-field full-width">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Տառատեսակ (Main Font)</label>
          <Select
            value={fontMain}
            onChange={setFontMain}
            size="large"
            style={{ width: "100%" }}
          >
            <Option value="'Montserrat', sans-serif">Montserrat (Modern Sans-Serif)</Option>
            <Option value="'Playfair Display', serif">Playfair Display (Elegant Serif)</Option>
            <Option value="'Inter', sans-serif">Inter (Clean Neutral)</Option>
            <Option value="'Cormorant Garamond', serif">Cormorant Garamond (Classic Wedding Serif)</Option>
            <Option value="'Great Vibes', cursive">Great Vibes (Romantic Script)</Option>
          </Select>
        </div>
      </div>
    </div>
  );
}
