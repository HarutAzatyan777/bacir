import React from "react";

export default function SectionsTab({
  sections,
  moveSectionUp,
  moveSectionDown,
  toggleSectionEnabled,
  addCustomSection,
  removeCustomSection,
  updateCustomSection
}) {
  const sectionNames = {
    hero: "Գլխավոր / Главная",
    calendar: "Օրացույց / Календарь",
    location: "Տեղանք / Локация",
    gallery: "Պատկերասրահ / Галерея",
    dressCode: "Դրեսս Կոդ / Дресс-код",
    rsvp: "Հաստատում (RSVP) / Подтверждение",
    customText: "Հատուկ բաժին / Свой раздел"
  };

  return (
    <div className="tab-pane">
      <h3>Բաժինների դասավորություն / Настройка разделов</h3>
      <p className="tab-desc" style={{ color: "#a3b899", fontSize: "0.85rem", marginBottom: "20px" }}>
        Դասավորեք բաժինները ըստ ցանկության և միացրեք կամ անջատեք դրանք (ինչպես WordPress-ում):
      </p>

      <div className="sections-list">
        {sections.map((section, index) => {
          const isFirst = index === 0;
          const isLast = index === sections.length - 1;
          const label = section.type === "customText"
            ? `Հատուկ բաժին / Свой раздел (${section.title?.am || "Նոր"})`
            : sectionNames[section.type] || section.type;

          return (
            <div key={section.id} className="section-item-card">
              <div className="section-item-header">
                <div className="section-item-info">
                  <span className="section-badge">{section.type}</span>
                  <span className="section-title-label">{label}</span>
                </div>
                
                <div className="section-item-actions">
                  <button
                    type="button"
                    className="reorder-btn"
                    onClick={() => moveSectionUp(index)}
                    disabled={isFirst}
                    title="Տեղափոխել վերև"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    className="reorder-btn"
                    onClick={() => moveSectionDown(index)}
                    disabled={isLast}
                    title="Տեղափոխել ներքև"
                  >
                    ▼
                  </button>
                  
                  <button
                    type="button"
                    className={`toggle-section-btn ${section.enabled ? "enabled" : "disabled"}`}
                    onClick={() => toggleSectionEnabled(index)}
                  >
                    {section.enabled ? "Միացված / Вкл" : "Անջատված / Выкл"}
                  </button>

                  {section.type === "customText" && (
                    <button
                      type="button"
                      className="delete-section-btn"
                      onClick={() => removeCustomSection(section.id)}
                    >
                      Ջնջել / Удалить
                    </button>
                  )}
                </div>
              </div>

              {section.type === "customText" && (
                <div className="custom-section-edit-grid">
                  <div className="form-field">
                    <label>Վերնագիր AM</label>
                    <input
                      type="text"
                      value={section.title?.am || ""}
                      onChange={(e) => updateCustomSection(section.id, "title", "am", e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label>Վերնագիր RU</label>
                    <input
                      type="text"
                      value={section.title?.ru || ""}
                      onChange={(e) => updateCustomSection(section.id, "title", "ru", e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label>Վերնագիր EN</label>
                    <input
                      type="text"
                      value={section.title?.en || ""}
                      onChange={(e) => updateCustomSection(section.id, "title", "en", e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label>Տեքստ AM</label>
                    <textarea
                      value={section.content?.am || ""}
                      onChange={(e) => updateCustomSection(section.id, "content", "am", e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label>Տեքստ RU</label>
                    <textarea
                      value={section.content?.ru || ""}
                      onChange={(e) => updateCustomSection(section.id, "content", "ru", e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label>Տեքստ EN</label>
                    <textarea
                      value={section.content?.en || ""}
                      onChange={(e) => updateCustomSection(section.id, "content", "en", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button type="button" className="add-section-btn" onClick={addCustomSection}>
        + Ավելացնել հատուկ բաժին / Добавить свой раздел
      </button>
    </div>
  );
}
