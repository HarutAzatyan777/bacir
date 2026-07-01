import React from "react";
import "./DressCodeSection.css";
import { useLanguage } from "../../context/LanguageContext";

const COLORS = [
  "#eaeaea", "#d9c8b4", "#c5a880", "#8b6f47",
  "#fff0e5", "#f3d2c1", "#d0b8ac", "#a68a7b",
  "#f2e6d9", "#bfa89e", "#d9ccc3", "#ede6e3"
];

export default function DressCodeSection({ dressCodeData }) {
  const { currentLang } = useLanguage();
  const colors = dressCodeData?.colors || COLORS;
  const count = colors.length;

  const displayTitle = currentLang === "ru" ? "Дресс-код" : "Dress Code";
  const displayDescription = dressCodeData?.description?.[currentLang] || dressCodeData?.description?.am || (currentLang === "ru" ? "Пожалуйста, выбирайте пастельные тона." : currentLang === "en" ? "Please choose pastel colors." : "Ընտրեք նուրբ գույներ։");

  return (
    <div className="dresscode-section">
      <h2>{displayTitle}</h2>
      <p>{displayDescription}</p>

      <div
        className="colors-palette"
        role="list"
        aria-label="Dress code color palette"
      >
        {colors.map((c, i) => {
          const angle = (360 / count) * i;
          return (
            <span
              key={i}
              className="color-icon"
              role="listitem"
              title={`Գույն ${i + 1}`}
              aria-label={`Գույն ${i + 1}`}
              style={{
                backgroundColor: c,
                "--angle": `${angle}deg`,
                "--neg-angle": `${-angle}deg`
              }}
              tabIndex="0"
            />
          );
        })}
      </div>
    </div>
  );
}

