import React, { useState, useEffect } from "react";
import AppLayout from "../../layouts/AppLayout";
import useSettings from "../../hooks/useSettings";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import SectionHeader from "../../components/SectionHeader";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";

export default function Settings() {
  const { settings } = useSettings();
  const { t } = useTranslation();

  return (
    <AppLayout>
      <SectionHeader
        title={t("settingsTitle")}
        subtitle={t("settingsSubtitle")}
      />

      {!settings && (
        <p style={{ fontFamily: "Inter", color: "#6B7280" }}>
          {t("loadingSettings")}
        </p>
      )}

      {settings && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Datos del fotógrafo */}
          <Card
            title={t("photographerData")}
            description={t("photographerDataDesc")}
          >
            <PhotographerForm />
          </Card>

          {/* Datos del estudio */}
          <Card
            title={t("studioData")}
            description={t("studioDataDesc")}
          >
            <StudioForm />
          </Card>

          {/* Logo */}
          <Card
            title={t("studioLogo")}
            description={t("studioLogoDesc")}
          >
            <StudioLogoForm />

            <div style={{ marginTop: "12px", color: "#6B7280", fontFamily: "Inter", fontSize: "14px" }}>
              <strong>{t("recommendations")}:</strong><br />
              • {t("allowedFormats")}<br />
              • {t("recommendedFormat")}<br />
              • {t("suggestedSize")}<br />
              • {t("maxWeight")}<br />
              • {t("squareLogoTip")}
            </div>
          </Card>


          {/* Idioma */}
          <Card
            title={t("language")}
            description={t("languageDesc")}
          >
            <p style={{ color: "#6B7280" }}>{t("soonFeature")}</p>
          </Card>

          {/* Monedas favoritas */}
          <Card
            title={t("favoriteCurrencies")}
            description={t("favoriteCurrenciesDesc")}
          >
            <p style={{ color: "#6B7280" }}>{t("soonFeature")}</p>
          </Card>

        </div>
      )}
    </AppLayout>
  );
}

/* -------------------------------------------------------
   DATOS DEL FOTÓGRAFO
------------------------------------------------------- */
function PhotographerForm() {
  const { settings, updateSettings } = useSettings();
  const { t } = useTranslation();
  const [local, setLocal] = useState(null);

  useEffect(() => {
    if (settings) setLocal(settings);
  }, [settings]);

  if (!local) return null;

  const handleLocalChange = (field) => (e) =>
    setLocal({ ...local, [field]: e.target.value });

  const handleSave = (field) => () =>
    updateSettings({ [field]: local[field] });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
      <InputField
        label={t("photographerNameLabel")}
        value={local.photographerName}
        onChange={handleLocalChange("photographerName")}
        onBlur={handleSave("photographerName")}
      />

      <InputField
        label={t("email")}
        value={local.photographerEmail}
        onChange={handleLocalChange("photographerEmail")}
        onBlur={handleSave("photographerEmail")}
      />

      <InputField
        label={t("phone")}
        value={local.photographerPhone}
        onChange={handleLocalChange("photographerPhone")}
        onBlur={handleSave("photographerPhone")}
      />
    </div>
  );
}

/* -------------------------------------------------------
   DATOS DEL ESTUDIO
------------------------------------------------------- */
function StudioForm() {
  const { settings, updateSettings } = useSettings();
  const { t } = useTranslation();
  const [local, setLocal] = useState(null);

  useEffect(() => {
    if (settings) setLocal(settings);
  }, [settings]);

  if (!local) return null;

  const handleLocalChange = (field) => (e) =>
    setLocal({ ...local, [field]: e.target.value });

  const handleSave = (field) => () =>
    updateSettings({ [field]: local[field] });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
      <InputField
        label={t("studioNameLabel")}
        value={local.studioName}
        onChange={handleLocalChange("studioName")}
        onBlur={handleSave("studioName")}
      />

      <InputField
        label={t("address")}
        value={local.studioAddress}
        onChange={handleLocalChange("studioAddress")}
        onBlur={handleSave("studioAddress")}
      />

      <InputField
        label={t("website")}
        value={local.studioWebsite}
        onChange={handleLocalChange("studioWebsite")}
        onBlur={handleSave("studioWebsite")}
      />

      <InputField
        label={t("instagram")}
        value={local.studioInstagram}
        onChange={handleLocalChange("studioInstagram")}
        onBlur={handleSave("studioInstagram")}
      />
    </div>
  );
}

/* -------------------------------------------------------
   LOGO DEL ESTUDIO
------------------------------------------------------- */
function StudioLogoForm() {
  const { settings, updateSettings } = useSettings();
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (settings?.logoUrl) {
      setPreview(settings.logoUrl);
    }
  }, [settings]);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const storage = getStorage();
      const fileRef = ref(storage, `logos/${Date.now()}_${file.name}`);

      // Subir archivo
      await uploadBytes(fileRef, file);

      // Obtener URL
      const url = await getDownloadURL(fileRef);

      // Guardar en Firestore
      await updateSettings({ logoUrl: url });

      // Actualizar preview inmediatamente
      setPreview(url);

    } catch (err) {
      console.error("Error subiendo logo:", err);
      toast.error(t("errorUploadingLogo"));
    }

    setUploading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      
      {preview && (
        <img
          src={preview}
          alt={t("studioLogo")}
          style={{
            width: "140px",
            height: "140px",
            objectFit: "contain",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "8px",
            background: "white"
          }}
        />
      )}

      <input type="file" accept="image/*" onChange={handleFile} />

      {uploading && <p>{t("uploadingLogo")}</p>}
    </div>
  );
}


/* -------------------------------------------------------
   REUSABLE COMPONENTS
------------------------------------------------------- */

function InputField({ label, value, onChange, onBlur }) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: "Inter", marginBottom: "4px" }}>
        {label}
      </label>

      <input
        type="text"
        value={value || ""}
        onChange={onChange}
        onBlur={onBlur}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        style={{
          width: "100%",
          padding: "8px 10px",
          borderRadius: "8px",
          border: "1px solid #D1D5DB",
          fontFamily: "Inter"
        }}
      />
    </div>
  );
}

function Card({ title, description, children }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
      }}
    >
      <h3 style={{ fontFamily: "Inter", marginBottom: "6px" }}>{title}</h3>
      <p style={{ fontFamily: "Inter", color: "#6B7280", marginBottom: "16px" }}>
        {description}
      </p>
      {children}
    </div>
  );
}
