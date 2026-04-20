import React, { useEffect, useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../utils/formatCurrency";

export default function Budgets() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [budgets, setBudgets] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "budgets"));
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBudgets(list);
    };
    load();
  }, []);

  const filtered = budgets.filter((b) => {
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    const matchSearch = b.title?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <AppLayout>
      <h2 style={{ fontFamily: "Inter", fontSize: "24px", marginBottom: "20px" }}>
        {t("budgets")}
      </h2>

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
          <option value="accepted">{t("accepted")}</option>
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
        {filtered.map((b) => (
          <div
            key={b.id}
            onClick={() => navigate(`/budgets/${b.id}`)}
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
                {b.title}
              </h3>

              <span style={badge(b.status)}>{t(b.status)}</span>
            </div>

            <strong style={{ fontFamily: "Inter", fontSize: "16px" }}>
              {formatCurrency(b.total, b.currency)}
            </strong>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}

const badge = (status) => ({
  padding: "4px 8px",
  borderRadius: "6px",
  fontSize: "12px",
  backgroundColor:
    status === "accepted" ? "#DCFCE7" :
    status === "sent" ? "#DBEAFE" :
    "#F3F4F6",
  color:
    status === "accepted" ? "#166534" :
    status === "sent" ? "#1E40AF" :
    "#374151"
});
