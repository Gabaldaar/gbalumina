import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [studioData, setStudioData] = useState(null);

  const user = auth.currentUser;
  const uid = user?.uid;

  // Cargar datos del estudio
  useEffect(() => {
    if (!uid) return;

    const fetchSettings = async () => {
      const ref = doc(db, "settings", uid);
      const snap = await getDoc(ref);
      if (snap.exists()) setStudioData(snap.data());
    };

    fetchSettings();
  }, [uid]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <header
      style={{
        width: "100%",
        backgroundColor: "white",
        borderBottom: "1px solid #E5E7EB",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Contenedor interno */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          height: "70px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* IZQUIERDA: Logo + Estudio */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {studioData?.logoUrl && (
            <img
              src={studioData.logoUrl}
              alt="Logo"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "6px",
                objectFit: "cover",
              }}
            />
          )}

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "16px", fontWeight: 600, color: "#111827" }}>
              {studioData?.studioName || "Mi Estudio"}
            </span>
            <span style={{ fontSize: "12px", color: "#6B7280" }}>
              {studioData?.photographerName || ""}
            </span>
          </div>
        </div>

        {/* BOTÓN HAMBURGUESA (solo mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "none",
            border: "none",
            fontSize: "26px",
            cursor: "pointer",
            display: "none",
          }}
          className="mobile-menu-btn"
        >
          ☰
        </button>

        {/* MENÚ DESKTOP */}
        <nav
          className="desktop-menu"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <button onClick={() => navigate("/")} style={navBtn}>
            Dashboard
          </button>
          <button onClick={() => navigate("/clients")} style={navBtn}>
            Clientes
          </button>
          <button onClick={() => navigate("/budgets")} style={navBtn}>
            Presupuestos
          </button>

          {/* CONFIGURACIÓN */}
          <button
            onClick={() => navigate("/settings")}
            style={{ ...navBtn, fontSize: "20px" }}
            title="Configuración"
          >
            ⚙️
          </button>

          <button onClick={handleLogout} style={logoutBtn}>
            Salir
          </button>
        </nav>
      </div>

      {/* MENÚ MOBILE */}
      {menuOpen && (
        <div
          style={{
            background: "white",
            borderTop: "1px solid #E5E7EB",
            padding: "15px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
          className="mobile-menu"
        >
          <button onClick={() => navigate("/")} style={navBtnMobile}>
            Dashboard
          </button>
          <button onClick={() => navigate("/clients")} style={navBtnMobile}>
            Clientes
          </button>
          <button onClick={() => navigate("/budgets")} style={navBtnMobile}>
            Presupuestos
          </button>

          {/* CONFIGURACIÓN MOBILE */}
          <button
            onClick={() => navigate("/settings")}
            style={navBtnMobile}
          >
            ⚙️ Configuración
          </button>

          <button onClick={handleLogout} style={logoutBtn}>
            Salir
          </button>
        </div>
      )}

      {/* ESTILOS RESPONSIVOS */}
      <style>
        {`
          @media (max-width: 768px) {
            .desktop-menu {
              display: none;
            }
            .mobile-menu-btn {
              display: block;
            }
          }
        `}
      </style>
    </header>
  );
};

/* ESTILOS */
const navBtn = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontFamily: "Inter",
  fontSize: "14px",
  color: "#374151",
};

const navBtnMobile = {
  ...navBtn,
  textAlign: "left",
  padding: "8px 0",
};

const logoutBtn = {
  padding: "8px 14px",
  backgroundColor: "#EF4444",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontFamily: "Inter",
};

export default Header;
