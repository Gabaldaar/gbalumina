import React, { useEffect, useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Contracts() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [contracts, setContracts] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "contracts"));
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setContracts(list);
    };
    load();
  }, []);

  const filtered = contracts.filter((c) => {
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    const matchSearch = c.title?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <AppLayout>
      {/* Título */}
      <h2 style={{ fontFamily: "Inter", fontSize: "24px", marginBottom: "20px" }}>
        {t("contracts")}
      </h2>

      {/* Botón superior */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => navigate("/contracts/new")}
          style={{
            padding: "10px 16px",
            backgroundColor: "#3B82F6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "Inter",
            fontSize: "14px"
          }}
        >
          {t("newContract")}
        </button>
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="all">{t("all")}</option>
          <option value="draft">{t("draft")}</option>
          <option value="sent">{t("sent")}</option>
          <option value="signed">{t("signed")}</option>
        </select>

        <input
          type="text"
          placeholder={t("search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: "8px" }}
        />
      </div>

      {/* Listado */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filtered.map((c) => (
          <div
            key={c.id}
            onClick={() => navigate(`/contracts/${c.id}`)}
            style={{
              backgroundColor: "white",
              padding: "16px",
              borderRadius: "10px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <h3 style={{ fontFamily: "Inter", marginBottom: "4px" }}>
                {c.title}
              </h3>

              <span style={badge(c.status)}>{t(c.status)}</span>
            </div>

            <span style={{ fontFamily: "Inter", fontSize: "14px", color: "#6B7280" }}>
              {c.templateName}
            </span>
          </div>
        ))}
      </div>

      {/* Botón flotante */}
      <button
        onClick={() => navigate("/contracts/new")}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#3B82F6",
          color: "white",
          border: "none",
          fontSize: "32px",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter"
        }}
      >
        +
      </button>
    </AppLayout>
  );
}

const badge = (status) => ({
  padding: "4px 8px",
  borderRadius: "6px",
  fontSize: "12px",
  backgroundColor:
    status === "signed" ? "#DCFCE7" :
    status === "sent" ? "#DBEAFE" :
    "#F3F4F6",
  color:
    status === "signed" ? "#166534" :
    status === "sent" ? "#1E40AF" :
    "#374151"
});
