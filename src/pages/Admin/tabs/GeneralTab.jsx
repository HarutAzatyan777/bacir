import React from "react";
import { Input, Select } from "antd";
import { 
  LinkOutlined, 
  TagOutlined, 
  CrownOutlined, 
  FontSizeOutlined, 
  BgColorsOutlined, 
  BorderOutlined, 
  AudioOutlined, 
  PictureOutlined, 
  EditOutlined, 
  FontColorsOutlined,
  SyncOutlined,
  SettingOutlined
} from "@ant-design/icons";
import ImageUpload from "../ImageUpload";

const { Option } = Select;

const envelopePresets = [
  { value: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800", name: "Սպիտակ / White Linen", emoji: "📄" },
  { value: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=800", name: "Ոսկեզօծ / Gold Wave", emoji: "👑" },
  { value: "https://images.unsplash.com/photo-1590073844006-33379778ae09?q=80&w=800", name: "Կրեմագույն / Cream Cotton", emoji: "🍦" },
  { value: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800", name: "Զմրուխտե / Emerald Velvet", emoji: "💚" },
  { value: "https://images.unsplash.com/photo-1586075010923-2dd45e9b2d4f?q=80&w=800", name: "Կրաֆտ / Kraft Paper", emoji: "📦" },
  { value: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800", name: "Վարդագույն / Blush Pink", emoji: "🌸" },
  { value: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800", name: "Մարմար / White Marble", emoji: "🏛️" },
  { value: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=800", name: "Բորդո / Burgundy Wine", emoji: "🍷" },
  { value: "https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=800", name: "Մուգ Կապույտ / Navy Linen", emoji: "💙" },
  { value: "https://images.unsplash.com/photo-1525498128493-380d1990a112?q=80&w=800", name: "Ալպիական / Sage Green", emoji: "🌿" },
  { value: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800", name: "Արծաթագույն / Silver Silk", emoji: "💎" },
  { value: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=800", name: "Հնեցված / Vintage Paper", emoji: "📜" },
  { value: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=800", name: "Ոսկե Փայլեր / Gold Glitter", emoji: "⭐" },
  { value: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800", name: "Նախշավոր / Luxury Damask", emoji: "⚜️" },
  { value: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800", name: "Սև Թելքավոր / Charcoal Black", emoji: "🖤" }
];


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
  setLoadingBgColor,
  introType,
  setIntroType
}) {
  return (
    <div className="tab-pane">
      {/* Card 1: Basic Info */}
      <div className="form-section-card">
        <div className="form-section-title">
          <SettingOutlined style={{ color: "#2c3e35", marginRight: 8 }} /> Հիմնական տվյալներ / Basic Info
        </div>
        <div className="form-grid">
          <div className="form-field full-width">
            <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "flex", alignItems: "center", gap: "6px" }}>
              <LinkOutlined style={{ color: "#d4af37" }} /> Հասցեի Slug (օր.՝ albert-karine) *
            </label>
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
            <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "flex", alignItems: "center", gap: "6px" }}>
              <TagOutlined style={{ color: "#d4af37" }} /> Միջոցառման անուն (ներքին օգտագործման)
            </label>
            <Input
              placeholder="Ռոբերտի և Լուսինեի հարսանիքը"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              size="large"
            />
          </div>

          <div className="form-field">
            <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "flex", alignItems: "center", gap: "6px" }}>
              <CrownOutlined style={{ color: "#d4af37" }} /> Միջոցառման տեսակ (Occasion / Event Type)
            </label>
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
        </div>
      </div>

      {/* Card 2: Wax Seal Design */}
      <div className="form-section-card">
        <div className="form-section-title">
          <BgColorsOutlined style={{ color: "#2c3e35", marginRight: 8 }} /> Կնիքի ձևավորում / Wax Seal Design
        </div>
        <div className="form-grid">
          <div className="form-field">
            <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "flex", alignItems: "center", gap: "6px" }}>
              <FontSizeOutlined style={{ color: "#d4af37" }} /> Կնիքի տառերը (Seal Initials)
            </label>
            <Input
              placeholder="օր.՝ RL"
              value={sealInitials}
              onChange={(e) => setSealInitials(e.target.value)}
              maxLength={3}
              size="large"
            />
          </div>

          <div className="form-field">
            <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "flex", alignItems: "center", gap: "6px" }}>
              <BgColorsOutlined style={{ color: "#d4af37" }} /> Կնիքի գույնը (Seal Color)
            </label>
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
            <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "flex", alignItems: "center", gap: "6px" }}>
              <BorderOutlined style={{ color: "#d4af37" }} /> Կնիքի ձևը (Seal Shape)
            </label>
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
        </div>
      </div>

      {/* Card 3: Envelope & Music */}
      <div className="form-section-card">
        <div className="form-section-title">
          <AudioOutlined style={{ color: "#2c3e35", marginRight: 8 }} /> Ծրար և Երաժշտություն / Envelope & Music
        </div>
        <div className="form-grid">
          <div className="form-field full-width">
            <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "flex", alignItems: "center", gap: "6px" }}>
              <SyncOutlined style={{ color: "#d4af37" }} /> Բացման էֆեկտ / Opening Intro Effect
            </label>
            <Select
              value={introType || "envelope"}
              onChange={setIntroType}
              size="large"
              style={{ width: "100%" }}
            >
              <Option value="envelope">Նամակ / Ծրար (Envelope Reveal)</Option>
              <Option value="gift_box">Նվեր Տուփ (Gift Box Reveal)</Option>
              <Option value="scroll">Մագաղաթ (Wax Seal Scroll)</Option>
              <Option value="curtain">Վարագույր (Velvet Curtain Reveal)</Option>
              <Option value="splash">Մինիմալիստական (Typography Splash)</Option>
              <Option value="gatefold">Երկփեղկ Դռներ (3D Gatefold Doors)</Option>
            </Select>
          </div>

          <div className="form-field full-width">
            <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "flex", alignItems: "center", gap: "6px" }}>
              <AudioOutlined style={{ color: "#d4af37" }} /> Երաժշտության URL (Music file link or path)
            </label>
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
              label={<><PictureOutlined style={{ color: "#d4af37", marginRight: 6 }} /> Ծրարի/նամակի ֆոնային նկար (Envelope/Letter BG Image)</>}
              file={envelopeBgFile}
              setFile={setEnvelopeBgFile}
              url={envelopeBgUrl}
              setUrl={setEnvelopeBgUrl}
              aspectRatio={3/2}
              dimensionsInfo="Խորհուրդ է տրվում՝ 1200 x 800px (3:2)"
            />
          </div>

          <div className="form-field full-width" style={{ marginTop: 15 }}>
            <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 10, display: "flex", alignItems: "center", gap: "6px" }}>
              <PictureOutlined style={{ color: "#d4af37" }} /> Պատրաստի դինամիկ ֆոնային էֆեկտներ / Animated BG Presets
            </label>
            <div className="presets-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
              gap: "10px",
              marginTop: "8px"
            }}>
              {envelopePresets.map(p => (
                <div 
                  key={p.value} 
                  onClick={() => setEnvelopeBgUrl(p.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: envelopeBgUrl === p.value ? "2px solid #2c3e35" : "1px solid rgba(44, 62, 53, 0.12)",
                    background: envelopeBgUrl === p.value ? "rgba(44, 62, 53, 0.05)" : "#ffffff",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>{p.emoji}</span>
                  <span style={{ fontSize: "0.72rem", fontWeight: 500, color: "#2c3e35" }}>{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-field full-width" style={{ marginTop: 15 }}>
            <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "flex", alignItems: "center", gap: "6px" }}>
              <BgColorsOutlined style={{ color: "#d4af37" }} /> Ծրարի բացման էջի ֆոնի գույն (Envelope Intro Page BG Color)
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
            <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "flex", alignItems: "center", gap: "6px" }}>
              <EditOutlined style={{ color: "#d4af37" }} /> Հրահանգի տեքստի գույն (Instruction Text Color)
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
            <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "flex", alignItems: "center", gap: "6px" }}>
              <FontColorsOutlined style={{ color: "#d4af37" }} /> Հրահանգի տեքստի տառատեսակ (Instruction Text Font)
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
            <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "flex", alignItems: "center", gap: "6px" }}>
              <SyncOutlined spin style={{ color: "#d4af37" }} /> Բեռնման էկրանի ֆոնի գույն (Loading Page BG Color)
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
    </div>
  );
}
