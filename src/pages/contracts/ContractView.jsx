import React, { useEffect, useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SignaturePad from "react-signature-canvas";

export default function ContractView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [contract, setContract] = useState(null);
  const [content, setContent] = useState("");
  const [sigPad, setSigPad] = useState(null);
  const [showSignature, setShowSignature] = useState(false);

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, "contracts", id));
      if (snap.exists()) {
        const data = snap.data();
        setContract(data);
        setContent(data.content);
      }
    };
    load();
  }, [id]);

  const saveChanges = async () => {
    await updateDoc(doc(db, "contracts", id), {
      content,
      dateUpdated: new Date().toISOString()
    });
    alert("Cambios guardados");
  };

  const deleteContract = async () => {
    const confirmDelete = window.confirm("¿Seguro que querés eliminar este contrato?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "contracts", id));
    navigate("/contracts");
  };

  const saveSignature = async () => {
    const signature = sigPad.getTrimmedCanvas().toDataURL("image/png");

    await updateDoc(doc(db, "contracts", id), {
      signature,
      signatureDate: new Date().toISOString(),
      status: "signed"
    });

    setShowSignature(false);
    alert("Contrato firmado");
  };

  if (!contract) return null;

  return (
    <AppLayout>
      {/* Volver */}
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "20px",
          padding: "8px 14px",
          backgroundColor: "#E5E7EB",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontFamily: "Inter"
        }}
      >
        ← {t("back")}
      </button>

      {/* Título */}
      <h2 style={{ fontFamily: "Inter", fontSize: "24px", marginBottom: "20px" }}>
        {contract.title}
      </h2>

      {/* Editor */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          width: "100%",
          height: "400px",
          padding: "12px",
          fontFamily: "Inter",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #D1D5DB"
        }}
      />

      {/* Botones */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={saveChanges}
          style={{
            padding: "10px 16px",
            backgroundColor: "#3B82F6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "Inter"
          }}
        >
          {t("saveChanges")}
        </button>

        <button
          onClick={() => setShowSignature(true)}
          style={{
            padding: "10px 16px",
            backgroundColor: "#10B981",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "Inter"
          }}
        >
          {t("signContract")}
        </button>

        <button
          onClick={() => alert("Enviar por email (Cloud Function pendiente)")}
          style={{
            padding: "10px 16px",
            backgroundColor: "#6366F1",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "Inter"
          }}
        >
          {t("sendEmail")}
        </button>

        <button
          onClick={deleteContract}
          style={{
            padding: "10px 16px",
            backgroundColor: "#DC2626",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "Inter"
          }}
        >
          {t("delete")}
        </button>
      </div>

      {/* Modal de firma */}
      {showSignature && (
        <div
          style={{
            marginTop: "20px",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>{t("signHere")}</h3>

          <SignaturePad
            ref={(ref) => setSigPad(ref)}
            canvasProps={{
              width: 500,
              height: 200,
              style: {
                border: "1px solid #ccc",
                borderRadius: "8px",
                marginBottom: "20px"
              }
            }}
          />

          <button
            onClick={saveSignature}
            style={{
              padding: "10px 16px",
              backgroundColor: "#10B981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontFamily: "Inter"
            }}
          >
            {t("confirmSignature")}
          </button>
        </div>
      )}
    </AppLayout>
  );
}
