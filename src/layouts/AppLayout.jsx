import React from "react";
import Header from "../components/Header";

const AppLayout = ({ children }) => {
  return (
    <div style={{ backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
      
      {/* Header full width */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px"
          }}
        >
          <Header />
        </div>
      </div>

      {/* Contenido */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px"
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
