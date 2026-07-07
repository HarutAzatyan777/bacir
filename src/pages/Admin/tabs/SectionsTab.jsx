import React from "react";
import { Card, Button, Switch, Input, Tag, Space, Typography } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

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
      <Title level={4} style={{ color: "#2c3e35", marginBottom: 6 }}>Բաժինների դասավորություն / Sections Layout</Title>
      <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
        Դասավորեք բաժինները ըստ ցանկության և միացրեք կամ անջատեք դրանք (ինչպես WordPress-ում):
      </Text>

      <div className="sections-list" style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
        {sections.map((section, index) => {
          const isFirst = index === 0;
          const isLast = index === sections.length - 1;
          const label = section.type === "customText"
            ? `Հատուկ բաժին / Свой раздел (${section.title?.am || "Նոր"})`
            : sectionNames[section.type] || section.type;

          return (
            <Card 
              key={section.id} 
              size="small" 
              bordered
              style={{ border: "1px solid #cbd5e1" }}
              title={
                <Space>
                  <Tag color="default" style={{ fontWeight: 600 }}>{section.type.toUpperCase()}</Tag>
                  <Text strong>{label}</Text>
                </Space>
              }
              extra={
                <Space>
                  <Button
                    type="text"
                    icon={<ArrowUpOutlined />}
                    onClick={() => moveSectionUp(index)}
                    disabled={isFirst}
                    title="Տեղափոխել վերև"
                  />
                  <Button
                    type="text"
                    icon={<ArrowDownOutlined />}
                    onClick={() => moveSectionDown(index)}
                    disabled={isLast}
                    title="Տեղափոխել ներքև"
                  />
                  <Switch
                    checked={section.enabled}
                    onChange={() => toggleSectionEnabled(index)}
                    checkedChildren="Միացված"
                    unCheckedChildren="Անջատված"
                  />
                  {section.type === "customText" && (
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeCustomSection(section.id)}
                    >
                      Ջնջել
                    </Button>
                  )}
                </Space>
              }
            >
              {section.type === "customText" && (
                <div className="custom-section-edit-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", padding: "8px 0" }}>
                  <div className="form-field" style={{ gridColumn: "1" }}>
                    <label style={{ fontWeight: 600, fontSize: "0.8rem", color: "#2c3e35", marginBottom: 6, display: "block" }}>Վերնագիր AM</label>
                    <Input
                      value={section.title?.am || ""}
                      onChange={(e) => updateCustomSection(section.id, "title", "am", e.target.value)}
                    />
                  </div>
                  <div className="form-field" style={{ gridColumn: "2" }}>
                    <label style={{ fontWeight: 600, fontSize: "0.8rem", color: "#2c3e35", marginBottom: 6, display: "block" }}>Վերնագիր RU</label>
                    <Input
                      value={section.title?.ru || ""}
                      onChange={(e) => updateCustomSection(section.id, "title", "ru", e.target.value)}
                    />
                  </div>
                  <div className="form-field" style={{ gridColumn: "3" }}>
                    <label style={{ fontWeight: 600, fontSize: "0.8rem", color: "#2c3e35", marginBottom: 6, display: "block" }}>Վերնագիր EN</label>
                    <Input
                      value={section.title?.en || ""}
                      onChange={(e) => updateCustomSection(section.id, "title", "en", e.target.value)}
                    />
                  </div>
                  <div className="form-field" style={{ gridColumn: "1" }}>
                    <label style={{ fontWeight: 600, fontSize: "0.8rem", color: "#2c3e35", marginBottom: 6, display: "block" }}>Տեքստ AM</label>
                    <TextArea
                      rows={3}
                      value={section.content?.am || ""}
                      onChange={(e) => updateCustomSection(section.id, "content", "am", e.target.value)}
                    />
                  </div>
                  <div className="form-field" style={{ gridColumn: "2" }}>
                    <label style={{ fontWeight: 600, fontSize: "0.8rem", color: "#2c3e35", marginBottom: 6, display: "block" }}>Տեքստ RU</label>
                    <TextArea
                      rows={3}
                      value={section.content?.ru || ""}
                      onChange={(e) => updateCustomSection(section.id, "content", "ru", e.target.value)}
                    />
                  </div>
                  <div className="form-field" style={{ gridColumn: "3" }}>
                    <label style={{ fontWeight: 600, fontSize: "0.8rem", color: "#2c3e35", marginBottom: 6, display: "block" }}>Տեքստ EN</label>
                    <TextArea
                      rows={3}
                      value={section.content?.en || ""}
                      onChange={(e) => updateCustomSection(section.id, "content", "en", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Button 
        type="dashed" 
        icon={<PlusOutlined />} 
        onClick={addCustomSection}
        size="large"
        block
        style={{ borderColor: "#2c3e35", color: "#2c3e35" }}
      >
        Ավելացնել հատուկ բաժին / Add Custom Section
      </Button>
    </div>
  );
}
