import React from "react";
import Header from "../components/Header";

const AuthLayout = ({ children }) => {
  return (
    <div style={{ backgroundColor: "#F3F4F6", minHeight: "100vh" }}>
      
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

      {/* Contenido centrado */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "20px"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            marginTop: "40px"
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
