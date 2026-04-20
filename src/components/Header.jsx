import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import BrandingMini from "./BrandingMini";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { CurrencyContext } from "../context/CurrencyContext";


const Header = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { currency, setCurrency } = useContext(CurrencyContext);

  const user = auth.currentUser;
  const userName = user?.displayName || user?.email || "";

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const changeLanguage = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <header
      style={{
        width: "100%",
        backgroundColor: "white",
        borderBottom: "1px solid #E5E7EB",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "70px",
        position: "sticky",
        top: 0,
        zIndex: 10
      }}
    >
      {/* Branding + Nav */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <BrandingMini />

        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginLeft: "20px" }}>
          <button onClick={() => navigate("/")} style={navBtn}>{t("dashboard")}</button>
          <button onClick={() => navigate("/clients")} style={navBtn}>{t("clients")}</button>
          <button onClick={() => navigate("/budgets")} style={navBtn}>{t("budgets")}</button>
        </div>
      </div>

      <button
        onClick={() => navigate("/settings")}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: "20px",
          marginRight: "10px"
        }}
        title="Configuración"
      >
        ⚙️
      </button>


      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        
        {/* Saludo */}
        <div style={{ fontFamily: "Inter", fontSize: "14px", color: "#374151" }}>
          {t("hello")}, {userName}
        </div>

        {/* Idioma */}
        <select onChange={changeLanguage} value={i18n.language} style={selectStyle}>
          <option value="es">ES</option>
          <option value="en">EN</option>
        </select>

        {/* Moneda */}
        <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={selectStyle}>
          <option value="ARS">ARS</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>

        {/* Logout */}
        <button onClick={handleLogout} style={logoutBtn}>
          {t("logout")}
        </button>
      </div>
    </header>
  );
};

const navBtn = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontFamily: "Inter",
  fontSize: "14px",
  color: "#374151"
};

const selectStyle = {
  padding: "6px",
  borderRadius: "6px",
  border: "1px solid #D1D5DB",
  fontFamily: "Inter"
};

const logoutBtn = {
  padding: "8px 14px",
  backgroundColor: "#3B82F6",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontFamily: "Inter"
};

export default Header;
