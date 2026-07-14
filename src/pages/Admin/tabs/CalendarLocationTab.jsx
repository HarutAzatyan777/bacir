import React from "react";
import { Input, Checkbox, Typography, Divider } from "antd";
import ImageUpload from "../ImageUpload";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function CalendarLocationTab({
  eventDate,
  setEventDate,
  calBgFile,
  setCalBgFile,
  calBgUrl,
  setCalBgUrl,
  calTitleAm,
  setCalTitleAm,
  calTitleRu,
  setCalTitleRu,
  calTitleEn,
  setCalTitleEn,
  calIntroAm,
  setCalIntroAm,
  calIntroRu,
  setCalIntroRu,
  calIntroEn,
  setCalIntroEn,
  calInviteAm,
  setCalInviteAm,
  calInviteRu,
  setCalInviteRu,
  calInviteEn,
  setCalInviteEn,
  showChurch,
  setShowChurch,
  showParty,
  setShowParty,
  churchTitleAm,
  setChurchTitleAm,
  churchTitleRu,
  setChurchTitleRu,
  churchTitleEn,
  setChurchTitleEn,
  churchNameAm,
  setChurchNameAm,
  churchNameRu,
  setChurchNameRu,
  churchNameEn,
  setChurchNameEn,
  churchAddr1Am,
  setChurchAddr1Am,
  churchAddr1Ru,
  setChurchAddr1Ru,
  churchAddr1En,
  setChurchAddr1En,
  churchAddr2Am,
  setChurchAddr2Am,
  churchAddr2Ru,
  setChurchAddr2Ru,
  churchAddr2En,
  setChurchAddr2En,
  churchTime,
  setChurchTime,
  churchMapLink,
  setChurchMapLink,
  partyTitleAm,
  setPartyTitleAm,
  partyTitleRu,
  setPartyTitleRu,
  partyTitleEn,
  setPartyTitleEn,
  partyNameAm,
  setPartyNameAm,
  partyNameRu,
  setPartyNameRu,
  partyNameEn,
  setPartyNameEn,
  partyAddrExtraAm,
  setPartyAddrExtraAm,
  partyAddrExtraRu,
  setPartyAddrExtraRu,
  partyAddrExtraEn,
  setPartyAddrExtraEn,
  partyAddr1Am,
  setPartyAddr1Am,
  partyAddr1Ru,
  setPartyAddr1Ru,
  partyAddr1En,
  setPartyAddr1En,
  partyAddr2Am,
  setPartyAddr2Am,
  partyAddr2Ru,
  setPartyAddr2Ru,
  partyAddr2En,
  setPartyAddr2En,
  partyTime,
  setPartyTime,
  partyMapLink,
  setPartyMapLink,
  locBgFile,
  setLocBgFile,
  locBgUrl,
  setLocBgUrl,
  calTextColor,
  setCalTextColor,
  locTextColor,
  setLocTextColor,
  churchIconFile,
  setChurchIconFile,
  churchIconUrl,
  setChurchIconUrl,
  partyIconFile,
  setPartyIconFile,
  partyIconUrl,
  setPartyIconUrl,
  ringStyle,
  setRingStyle,
}) {
  return (
    <div className="tab-pane">
      <Title level={4} style={{ color: "#2c3e35", marginBottom: 20 }}>Օրացույց / Calendar</Title>
      <div className="form-grid">
        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Ամսաթիվ և Ժամ (Event Date & Time)</label>
          <Input 
            type="datetime-local" 
            value={eventDate} 
            onChange={(e) => setEventDate(e.target.value)} 
            required 
            size="large" 
          />
        </div>
        <div className="form-field" style={{ marginTop: 10 }}>
          <ImageUpload
            label="Օրացույցի ֆոնային նկար"
            file={calBgFile}
            setFile={setCalBgFile}
            url={calBgUrl}
            setUrl={setCalBgUrl}
            dimensionsInfo="Խորհուրդ է տրվում՝ 1200 x 800px"
          />
        </div>
        <div className="form-field" style={{ marginTop: 16 }}>
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 10, display: "block" }}>
            Մատանու ոճ (Ring Style)
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
            {[
              { key: "classic",  label: "Ոսկի",        emoji: "💍", color: "#ceab6f",  bg: "#fdf8ee", border: "2px solid #ceab6f" },
              { key: "double",   label: "Կրկնակի",     emoji: "✨", color: "#d4af37",  bg: "#fffbea", border: "2px solid #d4af37" },
              { key: "rose",     label: "Վարդի",       emoji: "🌹", color: "#c9746b",  bg: "#fff5f4", border: "2px solid #c9746b" },
              { key: "emerald",  label: "Զմրուխտ",    emoji: "💚", color: "#3d9970",  bg: "#f0fff7", border: "2px solid #3d9970" },
              { key: "platinum", label: "Պլատին",      emoji: "⭐", color: "#b0b8c1",  bg: "#f5f7f9", border: "2px solid #b0b8c1" },
              { key: "infinity", label: "Անսահման",   emoji: "♾️", color: "#a855f7",  bg: "#faf5ff", border: "2px solid #a855f7" },
            ].map(opt => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setRingStyle(opt.key)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "10px 6px",
                  background: ringStyle === opt.key ? opt.bg : "#f9f9f9",
                  border: ringStyle === opt.key ? opt.border : "2px solid #e2e8f0",
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: ringStyle === opt.key ? `0 0 0 1px ${opt.color}40` : "none",
                }}
              >
                <span style={{ fontSize: "1.4rem" }}>{opt.emoji}</span>
                <span style={{ fontSize: "0.72rem", fontWeight: 600, color: opt.color }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="form-field" style={{ marginTop: 10 }}>
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>
            Օրացույցի տեքստի գույն (Calendar Text Color)
          </label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="color"
              value={calTextColor || "#ffffff"}
              onChange={(e) => setCalTextColor(e.target.value)}
              style={{ width: "60px", height: "40px", padding: "2px", border: "1px solid #cbd5e1", background: "transparent", cursor: "pointer", borderRadius: "6px" }}
            />
            <Input
              value={calTextColor || "#ffffff"}
              onChange={(e) => setCalTextColor(e.target.value)}
              size="large"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Վերնագիր AM</label>
          <Input value={calTitleAm} onChange={(e) => setCalTitleAm(e.target.value)} size="large" />
        </div>
        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Վերնագիր RU</label>
          <Input value={calTitleRu} onChange={(e) => setCalTitleRu(e.target.value)} size="large" />
        </div>
        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Վերնագիր EN</label>
          <Input value={calTitleEn} onChange={(e) => setCalTitleEn(e.target.value)} size="large" />
        </div>

        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Ներածություն AM</label>
          <TextArea rows={3} value={calIntroAm} onChange={(e) => setCalIntroAm(e.target.value)} />
        </div>
        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Ներածություն RU</label>
          <TextArea rows={3} value={calIntroRu} onChange={(e) => setCalIntroRu(e.target.value)} />
        </div>
        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Ներածություն EN</label>
          <TextArea rows={3} value={calIntroEn} onChange={(e) => setCalIntroEn(e.target.value)} />
        </div>

        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Հրավեր տեքստ AM</label>
          <TextArea rows={3} value={calInviteAm} onChange={(e) => setCalInviteAm(e.target.value)} />
        </div>
        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Հրավեր տեքստ RU</label>
          <TextArea rows={3} value={calInviteRu} onChange={(e) => setCalInviteRu(e.target.value)} />
        </div>
        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Հրավեր տեքստ EN</label>
          <TextArea rows={3} value={calInviteEn} onChange={(e) => setCalInviteEn(e.target.value)} />
        </div>
      </div>

      <Divider style={{ margin: "32px 0" }} />

      <div className="form-grid" style={{ marginBottom: "25px", gridTemplateColumns: "1fr 1fr" }}>
        <div className="form-field" style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
          <Checkbox
            id="showChurchCheckbox"
            checked={showChurch}
            onChange={(e) => setShowChurch(e.target.checked)}
          >
            <Text strong style={{ color: "#2c3e35" }}>
              Ցուցադրել Եկեղեցու բաժինը / Показать раздел Церкви / Show Church
            </Text>
          </Checkbox>
        </div>
        <div className="form-field" style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
          <Checkbox
            id="showPartyCheckbox"
            checked={showParty}
            onChange={(e) => setShowParty(e.target.checked)}
          >
            <Text strong style={{ color: "#2c3e35" }}>
              Ցուցադրել Ռեստորանի բաժինը / Показать раздел Ресторана / Show Reception
            </Text>
          </Checkbox>
        </div>
      </div>

      <Divider style={{ margin: "32px 0" }} />

      {showChurch && (
        <>
          <Title level={4} style={{ color: "#2c3e35", marginBottom: 20 }}>Եկեղեցու Արարողություն / Church</Title>
          <div className="form-grid">
            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Վերնագիր (օր.՝ ԵԿԵՂԵՑԻ)</label>
              <Input value={churchTitleAm} onChange={(e) => setChurchTitleAm(e.target.value)} size="large" />
            </div>
            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Վերնագիր RU</label>
              <Input value={churchTitleRu} onChange={(e) => setChurchTitleRu(e.target.value)} size="large" />
            </div>
            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Վերնագիր EN</label>
              <Input value={churchTitleEn} onChange={(e) => setChurchTitleEn(e.target.value)} size="large" />
            </div>

            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Եկեղեցու անուն AM</label>
              <Input value={churchNameAm} onChange={(e) => setChurchNameAm(e.target.value)} size="large" />
            </div>
            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Եկեղեցու անուն RU</label>
              <Input value={churchNameRu} onChange={(e) => setChurchNameRu(e.target.value)} size="large" />
            </div>
            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Եկեղեցու անուն EN</label>
              <Input value={churchNameEn} onChange={(e) => setChurchNameEn(e.target.value)} size="large" />
            </div>

            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Հասցե տող 1 AM</label>
              <Input value={churchAddr1Am} onChange={(e) => setChurchAddr1Am(e.target.value)} size="large" />
            </div>
            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Հասցե տող 1 RU</label>
              <Input value={churchAddr1Ru} onChange={(e) => setChurchAddr1Ru(e.target.value)} size="large" />
            </div>
            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Հասցե տող 1 EN</label>
              <Input value={churchAddr1En} onChange={(e) => setChurchAddr1En(e.target.value)} size="large" />
            </div>

            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Հասցե տող 2 AM</label>
              <Input value={churchAddr2Am} onChange={(e) => setChurchAddr2Am(e.target.value)} size="large" />
            </div>
            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Հասցե տող 2 RU</label>
              <Input value={churchAddr2Ru} onChange={(e) => setChurchAddr2Ru(e.target.value)} size="large" />
            </div>
            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Հասցե տող 2 EN</label>
              <Input value={churchAddr2En} onChange={(e) => setChurchAddr2En(e.target.value)} size="large" />
            </div>

            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Ժամ (օր.՝ 15:00)</label>
              <Input value={churchTime} onChange={(e) => setChurchTime(e.target.value)} size="large" />
            </div>
            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Քարտեզի հղում (Google Maps Link)</label>
              <Input value={churchMapLink} onChange={(e) => setChurchMapLink(e.target.value)} size="large" />
            </div>
            <div className="form-field" style={{ marginTop: 10 }}>
              <ImageUpload
                label="Եկեղեցու պատկերակ (Church Icon)"
                file={churchIconFile}
                setFile={setChurchIconFile}
                url={churchIconUrl}
                setUrl={setChurchIconUrl}
                dimensionsInfo="Խորհուրդ է տրվում՝ 64 x 64px կամ SVG"
              />
            </div>
          </div>
          <Divider style={{ margin: "32px 0" }} />
        </>
      )}

      {showParty && (
        <>
          <Title level={4} style={{ color: "#2c3e35", marginBottom: 20 }}>Ռեստորան / Party</Title>
          <div className="form-grid">
            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Վերնագիր (օր.՝ ՌԵՍՏՈՐԱՆ)</label>
              <Input value={partyTitleAm} onChange={(e) => setPartyTitleAm(e.target.value)} size="large" />
            </div>
            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Վերնագիր RU</label>
              <Input value={partyTitleRu} onChange={(e) => setPartyTitleRu(e.target.value)} size="large" />
            </div>
            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Վերնագիր EN</label>
              <Input value={partyTitleEn} onChange={(e) => setPartyTitleEn(e.target.value)} size="large" />
            </div>

            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Ռեստորանի անուն AM</label>
              <Input value={partyNameAm} onChange={(e) => setPartyNameAm(e.target.value)} size="large" />
            </div>
            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Ռեստորանի անուն RU</label>
              <Input value={partyNameRu} onChange={(e) => setPartyNameRu(e.target.value)} size="large" />
            </div>
            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Ռեստորանի անուն EN</label>
              <Input value={partyNameEn} onChange={(e) => setPartyNameEn(e.target.value)} size="large" />
            </div>

            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Լրացուցիչ տեղեկություն (օր.՝ Նոր Դվին) AM</label>
              <Input value={partyAddrExtraAm} onChange={(e) => setPartyAddrExtraAm(e.target.value)} size="large" />
            </div>
            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Լրացուցիչ տեղեկություն RU</label>
              <Input value={partyAddrExtraRu} onChange={(e) => setPartyAddrExtraRu(e.target.value)} size="large" />
            </div>
            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Լրացուցիչ տեղեկություն EN</label>
              <Input value={partyAddrExtraEn} onChange={(e) => setPartyAddrExtraEn(e.target.value)} size="large" />
            </div>

            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Հասցե տող 1 AM</label>
              <Input value={partyAddr1Am} onChange={(e) => setPartyAddr1Am(e.target.value)} size="large" />
            </div>
            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Հասցե տող 1 RU</label>
              <Input value={partyAddr1Ru} onChange={(e) => setPartyAddr1Ru(e.target.value)} size="large" />
            </div>
            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Հասցե տող 1 EN</label>
              <Input value={partyAddr1En} onChange={(e) => setPartyAddr1En(e.target.value)} size="large" />
            </div>

            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Հասցե տող 2 AM</label>
              <Input value={partyAddr2Am} onChange={(e) => setPartyAddr2Am(e.target.value)} size="large" />
            </div>
            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Հասցե տող 2 RU</label>
              <Input value={partyAddr2Ru} onChange={(e) => setPartyAddr2Ru(e.target.value)} size="large" />
            </div>
            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Հասցե տող 2 EN</label>
              <Input value={partyAddr2En} onChange={(e) => setPartyAddr2En(e.target.value)} size="large" />
            </div>

            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Ժամ (օր.՝ 17:30)</label>
              <Input value={partyTime} onChange={(e) => setPartyTime(e.target.value)} size="large" />
            </div>
            <div className="form-field">
              <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Քարտեզի հղում (Google Maps Link)</label>
              <Input value={partyMapLink} onChange={(e) => setPartyMapLink(e.target.value)} size="large" />
            </div>
            <div className="form-field" style={{ marginTop: 10 }}>
              <ImageUpload
                label="Ռեստորանի պատկերակ (Restaurant Icon)"
                file={partyIconFile}
                setFile={setPartyIconFile}
                url={partyIconUrl}
                setUrl={setPartyIconUrl}
                dimensionsInfo="Խորհուրդ է տրվում՝ 64 x 64px կամ SVG"
              />
            </div>
          </div>
          <Divider style={{ margin: "32px 0" }} />
        </>
      )}

      <div className="form-grid" style={{ marginTop: "20px", gridTemplateColumns: "1fr 1fr" }}>
        <div className="form-field">
          <ImageUpload
            label="Տեղանքի բաժնի ֆոնային նկար"
            file={locBgFile}
            setFile={setLocBgFile}
            url={locBgUrl}
            setUrl={setLocBgUrl}
            dimensionsInfo="Խորհուրդ է տրվում՝ 1200 x 800px"
          />
        </div>
        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>
            Տեղանքի տեքստի գույն (Location Text Color)
          </label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="color"
              value={locTextColor || "#2c3e35"}
              onChange={(e) => setLocTextColor(e.target.value)}
              style={{ width: "60px", height: "40px", padding: "2px", border: "1px solid #cbd5e1", background: "transparent", cursor: "pointer", borderRadius: "6px" }}
            />
            <Input
              value={locTextColor || "#2c3e35"}
              onChange={(e) => setLocTextColor(e.target.value)}
              size="large"
              style={{ flex: 1 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
