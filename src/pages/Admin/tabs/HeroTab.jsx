import React from "react";
import ImageUpload from "../ImageUpload";

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
      <h3>Գլխավոր Էջ / Hero Section</h3>
      <div className="form-grid">
        <div className="form-field">
          <label>Անուններ (Հայերեն)</label>
          <input type="text" value={heroNamesAm} onChange={(e) => setHeroNamesAm(e.target.value)} required />
        </div>
        <div className="form-field">
          <label>Անուններ (Ռուսերեն)</label>
          <input type="text" value={heroNamesRu} onChange={(e) => setHeroNamesRu(e.target.value)} required />
        </div>
        <div className="form-field">
          <label>Անուններ (Անգլերեն)</label>
          <input type="text" value={heroNamesEn} onChange={(e) => setHeroNamesEn(e.target.value)} required />
        </div>

        <div className="form-field">
          <label>Վերնագիր (Հայերեն)</label>
          <input type="text" value={heroTitleAm} onChange={(e) => setHeroTitleAm(e.target.value)} />
        </div>
        <div className="form-field">
          <label>Վերնագիր (Ռուսերեն)</label>
          <input type="text" value={heroTitleRu} onChange={(e) => setHeroTitleRu(e.target.value)} />
        </div>
        <div className="form-field">
          <label>Վերնագիր (Անգլերեն)</label>
          <input type="text" value={heroTitleEn} onChange={(e) => setHeroTitleEn(e.target.value)} />
        </div>

        <div className="form-field">
          <ImageUpload
            label="Հեռախոսի ֆոնային նկար (Mobile BG)"
            file={heroBgMobileFile}
            setFile={setHeroBgMobileFile}
            url={heroBgMobileUrl}
            setUrl={setHeroBgMobileUrl}
            dimensionsInfo="Խորհուրդ է տրվում՝ 1080 x 1920px"
          />
        </div>

        <div className="form-field">
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
