import React from "react";
import { Input, Select } from "antd";
import ImageUpload from "../ImageUpload";

const { Option } = Select;

export default function GeneralTab({
  mode,
  slug,
  setSlug,
  eventName,
  setEventName,
  eventType,
  handleEventTypeChange,
  sealInitials,
  setSealInitials,
  sealColor,
  setSealColor,
  sealShape,
  setSealShape,
  musicUrl,
  setMusicUrl,
  envelopeBgFile,
  setEnvelopeBgFile,
  envelopeBgUrl,
  setEnvelopeBgUrl,
  envelopeBgColor,
  setEnvelopeBgColor,
  envelopeTextColor,
  setEnvelopeTextColor,
  envelopeTextFont,
  setEnvelopeTextFont,
  loadingBgColor,
  setLoadingBgColor
}) {
  return (
    <div className="tab-pane">
      <div className="form-grid">
        <div className="form-field full-width">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Հասցեի Slug (օր.՝ robert-lusine) *</label>
          <Input
            placeholder="robert-lusine"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            disabled={mode === "edit"}
            size="large"
          />
          <small style={{ display: "block", marginTop: 4, color: "#64748b" }}>
            Այս Slug-ը կօգտագործվի URL-ում (օրինակ՝ /i/robert-lusine): Միայն փոքրատառեր, թվեր և գծիկներ:
          </small>
        </div>

        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Միջոցառման անուն (ներքին օգտագործման)</label>
          <Input
            placeholder="Ռոբերտի և Լուսինեի հարսանիքը"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            size="large"
          />
        </div>

        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Միջոցառման տեսակ (Occasion / Event Type)</label>
          <Select
            value={eventType}
            onChange={handleEventTypeChange}
            size="large"
            style={{ width: "100%" }}
          >
            <Option value="wedding">Հարսանիք / Свадьба / Wedding</Option>
            <Option value="birthday">Ծննդյան օր / День рождения / Birthday</Option>
            <Option value="baptism">Կնունք / Крещение / Baptism</Option>
            <Option value="other">Այլ միջոցառում / Другое / Other</Option>
          </Select>
        </div>

        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Կնիքի տառերը (Seal Initials)</label>
          <Input
            placeholder="օր.՝ RL"
            value={sealInitials}
            onChange={(e) => setSealInitials(e.target.value)}
            maxLength={3}
            size="large"
          />
        </div>

        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Կնիքի գույնը (Seal Color)</label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="color"
              value={sealColor || "#e7dcc8"}
              onChange={(e) => setSealColor(e.target.value)}
              style={{ width: "60px", height: "40px", padding: "2px", border: "1px solid #cbd5e1", background: "transparent", cursor: "pointer", borderRadius: "6px" }}
            />
            <Input
              value={sealColor || "#e7dcc8"}
              onChange={(e) => setSealColor(e.target.value)}
              size="large"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Կնիքի ձևը (Seal Shape)</label>
          <Select
            value={sealShape || "organic"}
            onChange={setSealShape}
            size="large"
            style={{ width: "100%" }}
          >
            <Option value="organic">Օրգանական (Բնական)</Option>
            <Option value="circle">Կլոր (Perfect Circle)</Option>
            <Option value="square">Կլորացված քառակուսի</Option>
            <Option value="oval">Ձվաձև</Option>
          </Select>
        </div>

        <div className="form-field full-width">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Երաժշտության URL (Music file link or path)</label>
          <Input
            value={musicUrl}
            onChange={(e) => setMusicUrl(e.target.value)}
            size="large"
          />
          <small style={{ display: "block", marginTop: 4, color: "#64748b" }}>
            Կարող եք թողնել լռելյայն `/wedding-audio.mp3` կամ տեղադրել այլ հղում:
          </small>
        </div>

        <div className="form-field full-width" style={{ marginTop: 10 }}>
          <ImageUpload
            label="Ծրարի/նամակի ֆոնային նկար (Envelope/Letter BG Image)"
            file={envelopeBgFile}
            setFile={setEnvelopeBgFile}
            url={envelopeBgUrl}
            setUrl={setEnvelopeBgUrl}
            aspectRatio={3/2}
            dimensionsInfo="Խորհուրդ է տրվում՝ 1200 x 800px (3:2)"
          />
        </div>

        <div className="form-field full-width" style={{ marginTop: 15 }}>
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>
            Ծրարի բացման էջի ֆոնի գույն (Envelope Intro Page BG Color)
          </label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="color"
              value={envelopeBgColor || "#2c3a1c"}
              onChange={(e) => setEnvelopeBgColor(e.target.value)}
              style={{ width: "60px", height: "40px", padding: "2px", border: "1px solid #cbd5e1", background: "transparent", cursor: "pointer", borderRadius: "6px" }}
            />
            <Input
              value={envelopeBgColor || "#2c3a1c"}
              onChange={(e) => setEnvelopeBgColor(e.target.value)}
              size="large"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div className="form-field" style={{ marginTop: 15 }}>
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>
            Հրահանգի տեքստի գույն (Instruction Text Color)
          </label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="color"
              value={envelopeTextColor || "#b3c0a4"}
              onChange={(e) => setEnvelopeTextColor(e.target.value)}
              style={{ width: "60px", height: "40px", padding: "2px", border: "1px solid #cbd5e1", background: "transparent", cursor: "pointer", borderRadius: "6px" }}
            />
            <Input
              value={envelopeTextColor || "#b3c0a4"}
              onChange={(e) => setEnvelopeTextColor(e.target.value)}
              size="large"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div className="form-field" style={{ marginTop: 15 }}>
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>
            Հրահանգի տեքստի տառատեսակ (Instruction Text Font)
          </label>
          <Select
            value={envelopeTextFont || "inherit"}
            onChange={setEnvelopeTextFont}
            size="large"
            style={{ width: "100%" }}
          >
            <Option value="inherit">Լռելյայն (Default)</Option>
            <Option value="'Montserrat', sans-serif">Montserrat (Modern Sans-Serif)</Option>
            <Option value="'Playfair Display', serif">Playfair Display (Elegant Serif)</Option>
            <Option value="'Inter', sans-serif">Inter (Clean Neutral)</Option>
            <Option value="'Cormorant Garamond', serif">Cormorant Garamond (Classic Wedding Serif)</Option>
            <Option value="'Great Vibes', cursive">Great Vibes (Romantic Script)</Option>
          </Select>
        </div>

        <div className="form-field full-width" style={{ marginTop: 15 }}>
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>
            Բեռնման էկրանի ֆոնի գույն (Loading Page BG Color)
          </label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="color"
              value={loadingBgColor || "#2c3a1c"}
              onChange={(e) => setLoadingBgColor(e.target.value)}
              style={{ width: "60px", height: "40px", padding: "2px", border: "1px solid #cbd5e1", background: "transparent", cursor: "pointer", borderRadius: "6px" }}
            />
            <Input
              value={loadingBgColor || "#2c3a1c"}
              onChange={(e) => setLoadingBgColor(e.target.value)}
              size="large"
              style={{ flex: 1 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
