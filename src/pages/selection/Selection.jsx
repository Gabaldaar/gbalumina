import React, { useEffect, useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SectionHeader from "../../components/SectionHeader";
import Button from "../../components/ui/Button";

export default function Selection() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selections, setSelections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const q = query(collection(db, "selections"), orderBy("dateCreated", "desc"));
        const snap = await getDocs(q);
        const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSelections(list);
      } catch (error) {
        console.error("Error loading selections:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <AppLayout>
      <SectionHeader
        title={t("selection")}
        subtitle={t("manageSelections")}
        right={
          <Button variant="primary" onClick={() => navigate("/selection/new")}>
            {t("newSelection")}
          </Button>
        }
      />

      {loading ? (
        <p>{t("loading")}...</p>
      ) : selections.length === 0 ? (
        <div style={{ textAlign: "center", color: "#6B7280", marginTop: "40px", fontFamily: "Inter" }}>
          {t("noSelectionsYet")}
        </div>
      ) : (
        <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {selections.map((s) => (
            <div
              key={s.id}
              onClick={() => navigate(`/selection/${s.id}`)}
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                border: "1px solid transparent",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3B82F6")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h3 style={{ fontFamily: "Inter", margin: 0, fontSize: "18px", color: "#111827" }}>
                  {s.title}
                </h3>
                <span style={badge(s.status)}>{t(s.status || "draft")}</span>
              </div>
              <p style={{ margin: 0, color: "#6B7280", fontSize: "14px", fontFamily: "Inter" }}>
                {s.clientName}
              </p>
              
              <div style={{ marginTop: "8px", fontSize: "14px", color: "#9CA3AF", fontFamily: "Inter", display: "flex", justifyContent: "space-between" }}>
                <span>{s.photos?.length || 0} {t("photos")}</span>
                {s.selectedIds && <span>{s.selectedIds.length} {t("selected")}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}

const badge = (status) => ({
  padding: "4px 8px",
  borderRadius: "6px",
  fontSize: "12px",
  fontWeight: 500,
  fontFamily: "Inter",
  backgroundColor:
    status === "completed" ? "#DCFCE7" :
    status === "sent" ? "#DBEAFE" :
    "#F3F4F6",
  color:
    status === "completed" ? "#166534" :
    status === "sent" ? "#1E40AF" :
    "#374151"
});
