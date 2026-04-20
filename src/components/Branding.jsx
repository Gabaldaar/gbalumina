import React from "react";
import { useTranslation } from "react-i18next";

const Branding = () => {
  const { t } = useTranslation();

  return (
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      {/* Logo temporal */}
      <div
        style={{
          width: "60px",
          height: "60px",
          margin: "0 auto 10px",
          backgroundColor: "#3B82F6",
          borderRadius: "50%",
          position: "relative",
        }}
      >
        {/* Segmentos */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            clipPath: "polygon(0 0, 100% 0, 50% 50%)",
            backgroundColor: "white",
            opacity: 0.9,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            clipPath: "polygon(100% 0, 100% 100%, 50% 50%)",
            backgroundColor: "white",
            opacity: 0.9,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            clipPath: "polygon(0 100%, 100% 100%, 50% 50%)",
            backgroundColor: "white",
            opacity: 0.9,
          }}
        />
      </div>

      <h1 style={{ fontFamily: "Inter", fontSize: "24px", margin: "0" }}>
        {t("appName")}
      </h1>

      <p
        style={{
          fontFamily: "Inter",
          fontSize: "14px",
          color: "#374151",
          marginTop: "4px",
        }}
      >
        {t("subtitle")}
      </p>
    </div>
  );
};

export default Branding;
