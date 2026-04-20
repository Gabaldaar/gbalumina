import React from "react";

const BrandingMini = () => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {/* Mini logo */}
      <div
        style={{
          width: "28px",
          height: "28px",
          backgroundColor: "#3B82F6",
          borderRadius: "50%",
          position: "relative"
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            clipPath: "polygon(0 0, 100% 0, 50% 50%)",
            backgroundColor: "white",
            opacity: 0.9
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            clipPath: "polygon(100% 0, 100% 100%, 50% 50%)",
            backgroundColor: "white",
            opacity: 0.9
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            clipPath: "polygon(0 100%, 100% 100%, 50% 50%)",
            backgroundColor: "white",
            opacity: 0.9
          }}
        />
      </div>

      {/* Texto compacto */}
      <span
        style={{
          fontFamily: "Inter",
          fontSize: "18px",
          fontWeight: 600,
          color: "#1F2937"
        }}
      >
        GBALumina
      </span>
    </div>
  );
};

export default BrandingMini;
