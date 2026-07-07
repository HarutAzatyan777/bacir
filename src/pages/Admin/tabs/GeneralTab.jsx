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
  musicUrl,
  setMusicUrl,
  envelopeBgFile,
  setEnvelopeBgFile,
  envelopeBgUrl,
  setEnvelopeBgUrl
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
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Կնիքի տառերը (Initials, օր.՝ RL)</label>
          <Input
            maxLength={4}
            value={sealInitials}
            onChange={(e) => setSealInitials(e.target.value)}
            size="large"
          />
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
      </div>
    </div>
  );
}
