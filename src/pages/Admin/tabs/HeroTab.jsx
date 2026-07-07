import React from "react";
import { Input, Typography } from "antd";
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
      <Title level={4} style={{ color: "#2c3e35", marginBottom: 20 }}>Գլխավոր Էջ / Hero Section</Title>
      <div className="form-grid">
        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Անուններ (Հայերեն)</label>
          <Input value={heroNamesAm} onChange={(e) => setHeroNamesAm(e.target.value)} required size="large" />
        </div>
        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Անուններ (Ռուսերեն)</label>
          <Input value={heroNamesRu} onChange={(e) => setHeroNamesRu(e.target.value)} required size="large" />
        </div>
        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Անուններ (Անգլերեն)</label>
          <Input value={heroNamesEn} onChange={(e) => setHeroNamesEn(e.target.value)} required size="large" />
        </div>

        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Վերնագիր (Հայերեն)</label>
          <Input value={heroTitleAm} onChange={(e) => setHeroTitleAm(e.target.value)} size="large" />
        </div>
        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Վերնագիր (Ռուսերեն)</label>
          <Input value={heroTitleRu} onChange={(e) => setHeroTitleRu(e.target.value)} size="large" />
        </div>
        <div className="form-field">
          <label style={{ fontWeight: 600, color: "#2c3e35", marginBottom: 8, display: "block" }}>Վերնագիր (Անգլերեն)</label>
          <Input value={heroTitleEn} onChange={(e) => setHeroTitleEn(e.target.value)} size="large" />
        </div>

        <div className="form-field" style={{ marginTop: 10 }}>
          <ImageUpload
            label="Հեռախոսի ֆոնային նկար (Mobile BG)"
            file={heroBgMobileFile}
            setFile={setHeroBgMobileFile}
            url={heroBgMobileUrl}
            setUrl={setHeroBgMobileUrl}
            dimensionsInfo="Խորհուրդ է տրվում՝ 1080 x 1920px"
          />
        </div>

        <div className="form-field" style={{ marginTop: 10 }}>
          <ImageUpload
            label="Համակարգչի ֆոնային նկար (Desktop BG)"
            file={heroBgDesktopFile}
            setFile={setHeroBgDesktopFile}
            url={heroBgDesktopUrl}
            setUrl={setHeroBgDesktopUrl}
            dimensionsInfo="Խորհուրդ է տրվում՝ 1920 x 1080px"
          />
        </div>
      </div>
    </div>
  );
}
