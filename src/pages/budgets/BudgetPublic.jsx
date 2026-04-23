import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import Button from "../../components/ui/Button";

export default function BudgetPublic() {
  const { id } = useParams();
  const { t } = useTranslation();

  const [budget, setBudget] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "budgets", id));
        if (snap.exists()) {
          setBudget(snap.data());
        }

        const { getDocs, collection } = await import("firebase/firestore");
        const settingsQuery = await getDocs(collection(db, "settings"));
        if (!settingsQuery.empty) {
          setSettings(settingsQuery.docs[0].data());
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAction = async (newStatus) => {
    if (!window.confirm(newStatus === "accepted" ? t("confirmAcceptBudget") : t("confirmRejectBudget"))) return;
    
    setSaving(true);
    try {
      await updateDoc(doc(db, "budgets", id), {
        status: newStatus,
        dateUpdated: new Date().toISOString()
      });
      setBudget({ ...budget, status: newStatus });
      toast.success(t(newStatus === "accepted" ? "budgetAcceptedSuccessfully" : "budgetRejectedSuccessfully"));
    } catch (err) {
      console.error("Error saving budget status:", err);
      alert(t("errorSavingBudgetStatus"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter", backgroundColor: "#F9FAFB" }}>
        {t("loading")}...
      </div>
    );
  }

  if (!budget) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter", backgroundColor: "#F9FAFB" }}>
        {t("budgetNotFound")}
      </div>
    );
  }

  const isPending = budget.status === "draft" || budget.status === "sent";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB", padding: "40px 20px" }}>
      {/* Header */}
      <header style={{ backgroundColor: "white", padding: "50px 20px", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          
          {settings?.logoUrl && (
            <img src={settings.logoUrl} alt="Logo" style={{ height: "70px", marginBottom: "20px", objectFit: "contain" }} />
          )}

          {(settings?.studioName || settings?.photographerName) && (
            <div style={{ marginBottom: "20px", color: "#6B7280", fontFamily: "Inter", fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase" }}>
              {settings?.studioName && (
                <span style={{ fontWeight: 600 }}>
                  {settings.studioName}
                </span>
              )}
              {settings?.studioName && settings?.photographerName && (
                <span style={{ margin: "0 8px" }}>•</span>
              )}
              {settings?.photographerName && (
                <span>{settings.photographerName}</span>
              )}
            </div>
          )}

          <h1 style={{ fontFamily: "Inter", margin: "0 0 8px 0", fontSize: "36px", color: "#111827", fontWeight: 800, letterSpacing: "-0.5px" }}>
            {t("budget")}
          </h1>
          <p style={{ fontFamily: "Inter", margin: 0, color: "#6B7280", fontSize: "16px" }}>
            {t("date")}: {new Date(budget.date).toLocaleDateString()}
          </p>
        </div>
      </header>

      <div style={{ maxWidth: "800px", margin: "40px auto 0", backgroundColor: "white", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", overflow: "hidden" }}>

        <div style={{ padding: "40px" }}>
          
          {/* Client Info */}
          <div style={{ marginBottom: "40px" }}>
            <h3 style={{ fontFamily: "Inter", margin: "0 0 8px 0", color: "#374151" }}>{t("client")}</h3>
            <p style={{ fontFamily: "Inter", margin: 0, color: "#111827", fontSize: "18px", fontWeight: 500 }}>{budget.clientName}</p>
          </div>

          {/* Items Table */}
          <div style={{ marginBottom: "40px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Inter" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #E5E7EB", textAlign: "left" }}>
                  <th style={{ padding: "12px 0", color: "#6B7280" }}>{t("service")}</th>
                  <th style={{ padding: "12px 0", color: "#6B7280", textAlign: "center" }}>{t("quantity")}</th>
                  <th style={{ padding: "12px 0", color: "#6B7280", textAlign: "right" }}>{t("unitPrice")}</th>
                  <th style={{ padding: "12px 0", color: "#6B7280", textAlign: "right" }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {(budget.items || []).map((item, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #E5E7EB" }}>
                    <td style={{ padding: "16px 0", color: "#111827" }}>{item.service}</td>
                    <td style={{ padding: "16px 0", color: "#111827", textAlign: "center" }}>{item.quantity}</td>
                    <td style={{ padding: "16px 0", color: "#111827", textAlign: "right" }}>${item.price}</td>
                    <td style={{ padding: "16px 0", color: "#111827", textAlign: "right", fontWeight: 500 }}>
                      ${(item.quantity * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "40px" }}>
            <div style={{ textAlign: "right", backgroundColor: "#F3F4F6", padding: "20px", borderRadius: "8px", minWidth: "250px" }}>
              <p style={{ fontFamily: "Inter", margin: "0 0 8px 0", color: "#6B7280", textTransform: "uppercase", fontSize: "14px", fontWeight: 600 }}>{t("total")}</p>
              <h2 style={{ fontFamily: "Inter", margin: 0, color: "#111827", fontSize: "32px" }}>
                ${budget.total?.toFixed(2) || "0.00"}
              </h2>
            </div>
          </div>

          {/* Notes */}
          {budget.notes && (
            <div style={{ marginBottom: "40px", padding: "20px", borderLeft: "4px solid #3B82F6", backgroundColor: "#EFF6FF" }}>
              <h4 style={{ fontFamily: "Inter", margin: "0 0 8px 0", color: "#1E3A8A" }}>{t("notes")}</h4>
              <p style={{ fontFamily: "Inter", margin: 0, color: "#1E3A8A", whiteSpace: "pre-wrap" }}>{budget.notes}</p>
            </div>
          )}

          {/* Actions */}
          {isPending ? (
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "40px" }}>
              <Button 
                variant="primary" 
                onClick={() => handleAction("accepted")}
                disabled={saving}
                style={{ backgroundColor: "#10B981", borderColor: "#10B981", fontSize: "16px", padding: "14px 28px" }}
              >
                {saving ? t("saving") : t("acceptBudget")}
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => handleAction("rejected")}
                disabled={saving}
                style={{ color: "#DC2626", borderColor: "#DC2626", fontSize: "16px", padding: "14px 28px" }}
              >
                {t("rejectBudget")}
              </Button>
            </div>
          ) : (
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <span style={{ 
                display: "inline-block", 
                padding: "8px 16px", 
                borderRadius: "20px", 
                fontFamily: "Inter",
                fontWeight: 600,
                backgroundColor: budget.status === "accepted" ? "#DCFCE7" : "#FEE2E2",
                color: budget.status === "accepted" ? "#166534" : "#991B1B"
              }}>
                {t(budget.status === "accepted" ? "budgetAcceptedStatus" : "budgetRejectedStatus")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <div style={{ textAlign: "center", padding: "40px 20px", marginTop: "auto", color: "#9CA3AF", fontFamily: "Inter", fontSize: "13px" }}>
        {t("poweredBy")} <a href="#" style={{ color: "#6B7280", textDecoration: "none", fontWeight: 600 }}>GBALumina</a>
      </div>
    </div>
  );
}
