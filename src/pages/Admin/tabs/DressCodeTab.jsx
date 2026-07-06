import React from "react";

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
      <div className="dresscode-toggle">
        <label className="switch-label">
          <input
            type="checkbox"
            checked={showDressCode}
            onChange={(e) => {
              const val = e.target.checked;
              setShowDressCode(val);
              setSections(sections.map(s => s.type === "dressCode" ? { ...s, enabled: val } : s));
            }}
          />
          Ցուցադրել Dress Code-ը / Показать дресс-код
        </label>
      </div>

      {showDressCode && (
        <div className="dresscode-settings form-grid">
          <div className="form-field">
            <label>Նկարագրություն AM</label>
            <textarea value={dressDescAm} onChange={(e) => setDressDescAm(e.target.value)} />
          </div>
          <div className="form-field">
            <label>Նկարագրություն RU</label>
            <textarea value={dressDescRu} onChange={(e) => setDressDescRu(e.target.value)} />
          </div>
          <div className="form-field">
            <label>Նկարագրություն EN</label>
            <textarea value={dressDescEn} onChange={(e) => setDressDescEn(e.target.value)} />
          </div>

          <div className="form-field full-width">
            <label>Գունային Գամմա / Цветовая гамма</label>
            <div className="color-picker-row">
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
              />
              <button type="button" className="add-color-btn" onClick={handleAddColor}>
                + Ավելացնել գույն
              </button>
            </div>

            <div className="colors-preview-list">
              {dressColors.map((c, idx) => (
                <div key={idx} className="color-badge" style={{ backgroundColor: c }}>
                  <span className="color-hex">{c}</span>
                  <button
                    type="button"
                    className="remove-color-badge"
                    onClick={() => handleRemoveColor(c)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
