import React from "react";
import ImageUpload from "../ImageUpload";

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
          <label>Հասցեի Slug (օր.՝ robert-lusine) *</label>
          <input
            type="text"
            placeholder="robert-lusine"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            disabled={mode === "edit"}
            required
          />
          <small>Այս Slug-ը կօգտագործվի URL-ում (օրինակ՝ /i/robert-lusine): Միայն փոքրատառեր, թվեր և գծիկներ:</small>
        </div>

        <div className="form-field">
          <label>Միջոցառման անուն (ներքին օգտագործման)</label>
          <input
            type="text"
            placeholder="Ռոբերտի և Լուսինեի հարսանիքը"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label>Միջոցառման տեսակ (Occasion / Event Type)</label>
          <select
            value={eventType}
            onChange={(e) => handleEventTypeChange(e.target.value)}
            style={{
              padding: "12px",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              color: "#1e293b",
              fontSize: "0.95rem",
              outline: "none",
              cursor: "pointer"
            }}
          >
            <option value="wedding">Հարսանիք / Свадьба / Wedding</option>
            <option value="birthday">Ծննդյան օր / День рождения / Birthday</option>
            <option value="baptism">Կնունք / Крещение / Baptism</option>
            <option value="other">Այլ միջոցառում / Другое / Other</option>
          </select>
        </div>

        <div className="form-field">
          <label>Կնիքի տառերը (Initials, օր.՝ RL)</label>
          <input
            type="text"
            maxLength={4}
            value={sealInitials}
            onChange={(e) => setSealInitials(e.target.value)}
          />
        </div>

        <div className="form-field full-width">
          <label>Երաժշտության URL (Music file link or path)</label>
          <input
            type="text"
            value={musicUrl}
            onChange={(e) => setMusicUrl(e.target.value)}
          />
          <small>Կարող եք թողնել լռելյայն `/wedding-audio.mp3` կամ տեղադրել այլ հղում:</small>
        </div>

        <div className="form-field full-width">
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
