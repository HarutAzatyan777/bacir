import React from "react";
import { Input, Typography } from "antd";
import { 
  UserOutlined, 
  CrownOutlined, 
  MobileOutlined, 
  DesktopOutlined,
  PictureOutlined
} from "@ant-design/icons";
import ImageUpload from "../ImageUpload";

const { Title } = Typography;

export default function HeroTab({
  heroNamesAm,
  setHeroNamesAm,
  heroNamesRu,
  setHeroNamesRu,
  heroNamesEn,
  setHeroNamesEn,
  heroTitleAm,
  setHeroTitleAm,
  heroTitleRu,
  setHeroTitleRu,
  heroTitleEn,
  setHeroTitleEn,
  heroBgMobileFile,
  setHeroBgMobileFile,
  heroBgMobileUrl,
  setHeroBgMobileUrl,
  heroBgDesktopFile,
  setHeroBgDesktopFile,
  heroBgDesktopUrl,
  setHeroBgDesktopUrl
}) {
  return (
    <div className="tab-pane">
      {/* Card 1: Names */}
      <div className="form-section-card">
        <div className="form-section-title">
          <UserOutlined style={{ color: "#2c3e35", marginRight: 8 }} /> Անուններ / Guest Names
        </div>
        <div className="form-grid">
          <div className="form-field">
            <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "flex", alignItems: "center", gap: "6px" }}>
              <UserOutlined style={{ color: "#d4af37" }} /> Անուններ (Հայերեն)
            </label>
            <Input value={heroNamesAm} onChange={(e) => setHeroNamesAm(e.target.value)} required size="large" />
          </div>
          <div className="form-field">
            <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "flex", alignItems: "center", gap: "6px" }}>
              <UserOutlined style={{ color: "#d4af37" }} /> Անուններ (Ռուսերեն)
            </label>
            <Input value={heroNamesRu} onChange={(e) => setHeroNamesRu(e.target.value)} required size="large" />
          </div>
          <div className="form-field">
            <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "flex", alignItems: "center", gap: "6px" }}>
              <UserOutlined style={{ color: "#d4af37" }} /> Անուններ (Անգլերեն)
            </label>
            <Input value={heroNamesEn} onChange={(e) => setHeroNamesEn(e.target.value)} required size="large" />
          </div>
        </div>
      </div>

      {/* Card 2: Titles */}
      <div className="form-section-card">
        <div className="form-section-title">
          <CrownOutlined style={{ color: "#2c3e35", marginRight: 8 }} /> Վերնագրեր / Cover Titles
        </div>
        <div className="form-grid">
          <div className="form-field">
            <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "flex", alignItems: "center", gap: "6px" }}>
              <CrownOutlined style={{ color: "#d4af37" }} /> Վերնագիր (Հայերեն)
            </label>
            <Input value={heroTitleAm} onChange={(e) => setHeroTitleAm(e.target.value)} size="large" />
          </div>
          <div className="form-field">
            <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "flex", alignItems: "center", gap: "6px" }}>
              <CrownOutlined style={{ color: "#d4af37" }} /> Վերնագիր (Ռուսերեն)
            </label>
            <Input value={heroTitleRu} onChange={(e) => setHeroTitleRu(e.target.value)} size="large" />
          </div>
          <div className="form-field">
            <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "flex", alignItems: "center", gap: "6px" }}>
              <CrownOutlined style={{ color: "#d4af37" }} /> Վերնագիր (Անգլերեն)
            </label>
            <Input value={heroTitleEn} onChange={(e) => setHeroTitleEn(e.target.value)} size="large" />
          </div>
        </div>
      </div>

      {/* Card 3: Background Media */}
      <div className="form-section-card">
        <div className="form-section-title">
          <PictureOutlined style={{ color: "#2c3e35", marginRight: 8 }} /> Ֆոնային նկարներ / Cover Images
        </div>
        <div className="form-grid">
          <div className="form-field" style={{ marginTop: 10 }}>
            <ImageUpload
              label={<><MobileOutlined style={{ color: "#d4af37", marginRight: 6 }} /> Հեռախոսի ֆոնային նկար (Mobile BG)</>}
              file={heroBgMobileFile}
              setFile={setHeroBgMobileFile}
              url={heroBgMobileUrl}
              setUrl={setHeroBgMobileUrl}
              dimensionsInfo="Խորհուրդ է տրվում՝ 1080 x 1920px"
            />
          </div>

          <div className="form-field" style={{ marginTop: 10 }}>
            <ImageUpload
              label={<><DesktopOutlined style={{ color: "#d4af37", marginRight: 6 }} /> Համակարգչի ֆոնային նկար (Desktop BG)</>}
              file={heroBgDesktopFile}
              setFile={setHeroBgDesktopFile}
              url={heroBgDesktopUrl}
              setUrl={setHeroBgDesktopUrl}
              dimensionsInfo="Խորհուրդ է տրվում՝ 1920 x 1080px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
