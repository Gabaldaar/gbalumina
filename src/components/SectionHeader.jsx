import React from "react";

const SectionHeader = ({ title, subtitle, right }) => {
  return (
    <div
      style={{
        width: "100%",
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      {/* Títulos */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 600,
            margin: 0,
            color: "#111827",
            fontFamily: "Inter",
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <span
            style={{
              fontSize: "14px",
              color: "#6B7280",
              marginTop: "4px",
              fontFamily: "Inter",
            }}
          >
            {subtitle}
          </span>
        )}
      </div>

      {/* Acciones a la derecha */}
      {right && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {right}
        </div>
      )}
    </div>
  );
};

export default SectionHeader;
