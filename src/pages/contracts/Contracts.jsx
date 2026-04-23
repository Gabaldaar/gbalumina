import React, { useEffect, useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SectionHeader from "../../components/SectionHeader";
import Button from "../../components/ui/Button";

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

      {/* SectionHeader SIEMPRE va acá */}
      <SectionHeader
        title={t("contracts")}
        subtitle={t("manageContracts")}
        right={
          <Button variant="primary" onClick={() => navigate("/contracts/new")}>
            {t("newContract")}
          </Button>
        }
      />

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

            <span
              style={{
                fontFamily: "Inter",
                fontSize: "14px",
                color: "#6B7280"
              }}
            >
              {c.templateName}
            </span>
          </div>
        ))}
      </div>

      {/* Botón flotante */}
      <Button
        variant="primary"
        onClick={() => navigate("/contracts/new")}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          fontSize: "32px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          padding: 0
        }}
      >
        +
      </Button>
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
