"use client";

import { useTranslation } from "../hooks/useTranslation";

export function LanguageSelector() {
  const { language, setLanguage } = useTranslation();

  const handleLanguageChange = (newLanguage: "en" | "es") => {
    console.log(`LanguageSelector: Changing language to ${newLanguage}`);
    setLanguage(newLanguage);

    // Add visual feedback
    const selector = document.querySelector(
      "select[data-language-selector]"
    ) as HTMLSelectElement;
    if (selector) {
      selector.style.backgroundColor = "#e3f2fd";
      setTimeout(() => {
        selector.style.backgroundColor = "white";
      }, 200);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ fontSize: "14px", color: "#6c757d" }}>🌐</span>
      <select
        data-language-selector
        value={language}
        onChange={(e) => handleLanguageChange(e.target.value as "en" | "es")}
        style={{
          padding: "6px 12px",
          border: "1px solid #e9ecef",
          borderRadius: "4px",
          fontSize: "14px",
          backgroundColor: "white",
          cursor: "pointer",
          minWidth: "100px",
          transition: "background-color 0.2s ease",
        }}
      >
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
      <span style={{ fontSize: "12px", color: "#28a745", opacity: 0.8 }}>
        {language === "en" ? "EN" : "ES"}
      </span>
    </div>
  );
}
