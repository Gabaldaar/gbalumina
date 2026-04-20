import React, { useState, useEffect } from "react";
import AppLayout from "../../layouts/AppLayout";
import useSettings from "../../hooks/useSettings";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Settings() {
  const { settings } = useSettings();

  return (
    <AppLayout>
      <h2 style={{ fontFamily: "Inter", fontSize: "24px", marginBottom: "20px" }}>
        Configuración
      </h2>

      {!settings && (
        <p style={{ fontFamily: "Inter", color: "#6B7280" }}>
          Cargando configuración...
        </p>
      )}

      {settings && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Datos del fotógrafo */}
          <Card
            title="Datos del fotógrafo"
            description="Información personal que se usará en contratos, presupuestos y PDFs."
          >
            <PhotographerForm />
          </Card>

          {/* Datos del estudio */}
          <Card
            title="Datos del estudio"
            description="Nombre comercial, contacto y datos que aparecerán en documentos."
          >
            <StudioForm />
          </Card>

          {/* Logo */}
          <Card
            title="Logo del estudio"
            description="Subí tu logo para usarlo en contratos, presupuestos y PDFs."
          >
            <StudioLogoForm />

            <div style={{ marginTop: "12px", color: "#6B7280", fontFamily: "Inter", fontSize: "14px" }}>
              <strong>Recomendaciones:</strong><br />
              • Formatos permitidos: PNG, JPG, SVG, WEBP<br />
              • Recomendado: PNG con fondo transparente<br />
              • Tamaño sugerido: 512×512 px o mayor<br />
              • Peso máximo recomendado: 500 KB<br />
              • Consejo: Usá un logo cuadrado para mejores resultados en PDFs
            </div>
          </Card>


          {/* Idioma */}
          <Card
            title="Idioma"
            description="Seleccioná el idioma de la aplicación."
          >
            <p style={{ color: "#6B7280" }}>Pronto agregaremos el selector aquí.</p>
          </Card>

          {/* Monedas favoritas */}
          <Card
            title="Monedas favoritas"
            description="Elegí las monedas que querés ver primero al crear un presupuesto."
          >
            <p style={{ color: "#6B7280" }}>Pronto agregaremos el selector aquí.</p>
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
        label="Nombre del fotógrafo"
        value={local.photographerName}
        onChange={handleLocalChange("photographerName")}
        onBlur={handleSave("photographerName")}
      />

      <InputField
        label="Email"
        value={local.photographerEmail}
        onChange={handleLocalChange("photographerEmail")}
        onBlur={handleSave("photographerEmail")}
      />

      <InputField
        label="Teléfono"
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
        label="Nombre del estudio"
        value={local.studioName}
        onChange={handleLocalChange("studioName")}
        onBlur={handleSave("studioName")}
      />

      <InputField
        label="Dirección"
        value={local.studioAddress}
        onChange={handleLocalChange("studioAddress")}
        onBlur={handleSave("studioAddress")}
      />

      <InputField
        label="Sitio web"
        value={local.studioWebsite}
        onChange={handleLocalChange("studioWebsite")}
        onBlur={handleSave("studioWebsite")}
      />

      <InputField
        label="Instagram"
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
      alert("Error subiendo el logo. Revisá la consola.");
    }

    setUploading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      
      {preview && (
        <img
          src={preview}
          alt="Logo del estudio"
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

      {uploading && <p>Subiendo logo...</p>}
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
        value={value}
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
