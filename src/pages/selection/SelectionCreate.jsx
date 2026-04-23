import React, { useEffect, useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import { db } from "../../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SectionHeader from "../../components/SectionHeader";
import Button from "../../components/ui/Button";

export default function SelectionCreate() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    title: "",
    clientId: "",
    maxSelections: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadClients = async () => {
      const snap = await getDocs(collection(db, "clients"));
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setClients(list);
    };
    loadClients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.clientId) {
      setError(t("errorClientRequired"));
      return;
    }
    if (!form.title) {
      setError(t("errorTitleRequired"));
      return;
    }

    const client = clients.find((c) => c.id === form.clientId);

    const payload = {
      title: form.title,
      clientId: client.id,
      clientName: client.name,
      maxSelections: form.maxSelections ? parseInt(form.maxSelections) : null,
      photos: [],
      selectedIds: [],
      status: "draft",
      dateCreated: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "selections"), payload);
    navigate(`/selection/${docRef.id}`);
  };

  return (
    <AppLayout>
      <SectionHeader
        title={t("newSelection")}
        subtitle={t("createSelectionSubtitle")}
      />

      <Button
        variant="secondary"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "20px" }}
      >
        ← {t("back")}
      </Button>

      {error && (
        <div style={{ backgroundColor: "#FEE2E2", color: "#B91C1C", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontFamily: "Inter" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", maxWidth: "600px" }}>
        
        <label style={{ display: "block", marginBottom: "4px", fontFamily: "Inter", fontWeight: 500 }}>{t("title")}</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder={t("selectionTitlePlaceholder")}
          style={{ width: "100%", padding: "8px", marginBottom: "16px", borderRadius: "8px", border: "1px solid #D1D5DB", fontFamily: "Inter" }}
        />

        <label style={{ display: "block", marginBottom: "4px", fontFamily: "Inter", fontWeight: 500 }}>{t("client")}</label>
        <select
          value={form.clientId}
          onChange={(e) => setForm({ ...form, clientId: e.target.value })}
          style={{ width: "100%", padding: "8px", marginBottom: "16px", borderRadius: "8px", border: "1px solid #D1D5DB", fontFamily: "Inter" }}
        >
          <option value="">{t("selectClient")}</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <label style={{ display: "block", marginBottom: "4px", fontFamily: "Inter", fontWeight: 500 }}>{t("maxSelections")} ({t("optional")})</label>
        <input
          type="number"
          value={form.maxSelections}
          onChange={(e) => setForm({ ...form, maxSelections: e.target.value })}
          placeholder={t("noLimit")}
          style={{ width: "100%", padding: "8px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #D1D5DB", fontFamily: "Inter" }}
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <Button variant="primary" type="submit">
            {t("createSelection")}
          </Button>
          <Button variant="secondary" onClick={() => navigate("/selection")} type="button">
            {t("cancel")}
          </Button>
        </div>
      </form>
    </AppLayout>
  );
}
