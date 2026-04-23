import React, { useEffect, useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import SignaturePad from "react-signature-canvas";
import SectionHeader from "../../components/SectionHeader";
import Button from "../../components/ui/Button";

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
    alert(t("changesSaved"));
  };

  const deleteContract = async () => {
    const confirmDelete = window.confirm(t("confirmDelete"));
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
    alert(t("contractSigned"));
  };

  if (!contract) return null;

  return (
    <AppLayout>

      {/* SectionHeader */}
      <SectionHeader
        title={contract.title}
        subtitle={t("editContractSubtitle")}
      />

      {/* Volver */}
      <Button
        variant="secondary"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "20px" }}
      >
        ← {t("back")}
      </Button>

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
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <Button variant="primary" onClick={saveChanges}>
          {t("saveChanges")}
        </Button>

        <Button 
          variant="primary" 
          onClick={() => {
            const publicLink = `${window.location.origin}/c/${id}`;
            navigator.clipboard.writeText(publicLink);
            toast.success(t("linkCopied"));
          }}
          style={{ backgroundColor: "#F59E0B", borderColor: "#F59E0B" }}
        >
          {t("copyLink")}
        </Button>

        <Button
          variant="primary"
          onClick={() => setShowSignature(true)}
          style={{ backgroundColor: "#10B981", borderColor: "#10B981" }}
        >
          {t("signContract")}
        </Button>

        <Button
          variant="primary"
          onClick={() => alert("Enviar por email (Cloud Function pendiente)")}
          style={{ backgroundColor: "#6366F1", borderColor: "#6366F1" }}
        >
          {t("sendEmail")}
        </Button>

        <Button
          variant="primary"
          onClick={deleteContract}
          style={{ backgroundColor: "#DC2626", borderColor: "#DC2626" }}
        >
          {t("delete")}
        </Button>
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

          <Button
            variant="primary"
            onClick={saveSignature}
            style={{ backgroundColor: "#10B981", borderColor: "#10B981" }}
          >
            {t("confirmSignature")}
          </Button>
        </div>
      )}
    </AppLayout>
  );
}
