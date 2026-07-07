import React from "react";
import { Switch, Input, Button, Tag, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { TextArea } = Input;

export default function DressCodeTab({
  showDressCode,
  setShowDressCode,
  sections,
  setSections,
  dressDescAm,
  setDressDescAm,
  dressDescRu,
  setDressDescRu,
  dressDescEn,
  setDressDescEn,
  newColor,
  setNewColor,
  handleAddColor,
  dressColors,
  handleRemoveColor
}) {
  return (
    <div className="tab-pane">
      <div className="dresscode-toggle" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <Switch
          checked={showDressCode}
          onChange={(checked) => {
            setShowDressCode(checked);
            setSections(sections.map(s => s.type === "dressCode" ? { ...s, enabled: checked } : s));
          }}
          checkedChildren="Ցուցադրել"
          unCheckedChildren="Թաքցնել"
        />
        <span style={{ fontWeight: 600, color: "#2c3e35" }}>
          Ցուցադրել Dress Code-ը / Показать дресс-код / Show Dress Code
        </span>
      </div>

      {showDressCode && (
        <div className="dresscode-settings form-grid">
          <div className="form-field">
            <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Նկարագրություն AM</label>
            <TextArea rows={3} value={dressDescAm} onChange={(e) => setDressDescAm(e.target.value)} />
          </div>
          <div className="form-field">
            <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Նկարագրություն RU</label>
            <TextArea rows={3} value={dressDescRu} onChange={(e) => setDressDescRu(e.target.value)} />
          </div>
          <div className="form-field">
            <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Նկարագրություն EN</label>
            <TextArea rows={3} value={dressDescEn} onChange={(e) => setDressDescEn(e.target.value)} />
          </div>

          <div className="form-field full-width" style={{ marginTop: 10 }}>
            <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Գունային Գամմա / Цветовая гамма / Color Gamut</label>
            <div className="color-picker-row" style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "16px" }}>
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                style={{ width: "60px", height: "40px", padding: "2px", border: "1px solid #cbd5e1", background: "transparent", cursor: "pointer", borderRadius: "6px" }}
              />
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddColor} style={{ backgroundColor: "#2c3e35" }} size="large">
                Ավելացնել գույն
              </Button>
            </div>

            <Space wrap className="colors-preview-list" style={{ padding: "8px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #cbd5e1", width: "100%", minHeight: "50px" }}>
              {dressColors.map((c, idx) => (
                <Tag 
                  key={idx} 
                  closable 
                  onClose={() => handleRemoveColor(c)}
                  color={c.startsWith("#") ? c : "default"}
                  style={{ 
                    padding: "6px 12px", 
                    fontSize: "0.85rem", 
                    fontWeight: 600,
                    textShadow: "0 1px 2px rgba(0,0,0,0.15)",
                    color: "#fff",
                    borderColor: "rgba(0,0,0,0.1)"
                  }}
                >
                  {c.toUpperCase()}
                </Tag>
              ))}
            </Space>
          </div>
        </div>
      )}
    </div>
  );
}
