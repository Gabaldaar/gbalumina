import React from "react";
import AppLayout from "../../layouts/AppLayout";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  PhotoIcon
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <AppLayout>
      <h2 style={{ fontFamily: "Inter", fontSize: "24px", marginBottom: "20px" }}>
        {t("dashboard")}
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px"
      }}>
        
        {/* Presupuestos */}
        <div style={card} onClick={() => navigate("/budgets")}>
          <DocumentTextIcon style={icon} />
          <h3 style={title}>{t("budgets")}</h3>
          <p style={desc}>{t("budgetsDescription")}</p>
        </div>

        {/* Contratos */}
        <div style={card} onClick={() => navigate("/contracts")}>
          <ClipboardDocumentCheckIcon style={icon} />
          <h3 style={title}>{t("contracts")}</h3>
          <p style={desc}>{t("contractsDescription")}</p>
        </div>

        {/* Selección de fotos */}
        <div style={card} onClick={() => navigate("/selection")}>
          <PhotoIcon style={icon} />
          <h3 style={title}>{t("selection")}</h3>
          <p style={desc}>{t("selectionDescription")}</p>
        </div>

      </div>
    </AppLayout>
  );
}

const card = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  gap: "10px"
};

const icon = {
  width: "32px",
  height: "32px",
  color: "#3B82F6"
};

const title = {
  fontFamily: "Inter",
  fontSize: "18px"
};

const desc = {
  fontFamily: "Inter",
  color: "#6B7280",
  fontSize: "14px"
};
