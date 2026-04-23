import React, { useEffect, useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import { db, auth } from "../../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { contractTemplates } from "../../data/contractTemplates";
import SectionHeader from "../../components/SectionHeader";
import Button from "../../components/ui/Button";

export default function ContractCreate() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [clients, setClients] = useState([]);
  const [template, setTemplate] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  // Cargar clientes
  useEffect(() => {
    const loadClients = async () => {
      const snap = await getDocs(collection(db, "clients"));
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setClients(list);
    };
    loadClients();
  }, []);

  const handleFieldChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  // Reemplazar variables en la plantilla
  const generateContent = (template, form, client) => {
    const photographerName = auth.currentUser?.displayName || "Fotógrafo";

    let content = template.content;

    const replacements = {
      clientName: client.name,
      photographerName,
      ...form
    };

    Object.keys(replacements).forEach((key) => {
      content = content.replaceAll(`{{${key}}}`, replacements[key]);
    });

    return content;
  };

  const handleSubmit = async () => {
    if (!template) {
      setError(t("errorSelectTemplate"));
      return;
    }

    if (!form.clientId) {
      setError(t("errorClientRequired"));
      return;
    }

    const client = clients.find((c) => c.id === form.clientId);

    const finalContent = generateContent(template, form, client);

    const payload = {
      title: `${template.name} - ${client.name}`,
      clientId: client.id,
      clientName: client.name,
      templateId: template.id,
      templateName: template.name,
      fields: form,
      content: finalContent,
      status: "draft",
      signature: null,
      signatureDate: null,
      dateCreated: new Date().toISOString(),
      dateUpdated: new Date().toISOString()
    };

    await addDoc(collection(db, "contracts"), payload);
    navigate("/contracts");
  };

  return (
    <AppLayout>

      {/* SectionHeader */}
      <SectionHeader
        title={t("newContract")}
        subtitle={t("createContractSubtitle")}
      />

      {/* Error */}
      {error && (
        <div
          style={{
            backgroundColor: "#FEE2E2",
            color: "#B91C1C",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px"
          }}
        >
          {error}
        </div>
      )}

      {/* Si NO hay plantilla seleccionada → mostrar selector */}
      {!template && (
        <>
          <p style={{ marginBottom: "10px", fontFamily: "Inter" }}>
            {t("selectContractType")}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {contractTemplates.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => setTemplate(tpl)}
                style={{
                  backgroundColor: "white",
                  padding: "16px",
                  borderRadius: "10px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  cursor: "pointer",
                  fontFamily: "Inter"
                }}
              >
                <strong>{tpl.name}</strong>
              </div>
            ))}
          </div>

          {/* Botón salir */}
          <Button
            variant="secondary"
            onClick={() => navigate("/contracts")}
            style={{ marginTop: "20px" }}
          >
            {t("cancel")}
          </Button>
        </>
      )}

      {/* Si hay plantilla seleccionada → mostrar formulario */}
      {template && (
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            marginTop: "20px"
          }}
        >
          {/* Cliente */}
          <label style={{ fontFamily: "Inter" }}>{t("client")}</label>
          <select
            value={form.clientId || ""}
            onChange={(e) => handleFieldChange("clientId", e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB"
            }}
          >
            <option value="">{t("selectClient")}</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.email}
              </option>
            ))}
          </select>

          {/* Campos dinámicos */}
          {template.fields.map((f) => (
            <div key={f.key} style={{ marginBottom: "12px" }}>
              <label style={{ fontFamily: "Inter" }}>{f.label}</label>
              <input
                type={f.type}
                value={form[f.key] || ""}
                onChange={(e) => handleFieldChange(f.key, e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB"
                }}
              />
            </div>
          ))}

          {/* Botones */}
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <Button variant="primary" onClick={handleSubmit}>
              {t("createContract")}
            </Button>

            <Button variant="secondary" onClick={() => navigate("/contracts")}>
              {t("cancel")}
            </Button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
