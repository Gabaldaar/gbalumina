import React from "react";
import Header from "../components/Header";

const AppLayout = ({ children }) => {
  return (
    <div style={{ backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
      
      {/* Header full width */}
      <Header />

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
