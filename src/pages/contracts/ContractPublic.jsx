import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import SignaturePad from "react-signature-canvas";
import Button from "../../components/ui/Button";

export default function ContractPublic() {
  const { id } = useParams();
  const { t } = useTranslation();

  const [contract, setContract] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sigPad, setSigPad] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "contracts", id));
        if (snap.exists()) {
          setContract(snap.data());
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

  const handleSign = async () => {
    if (!sigPad || sigPad.isEmpty()) {
      toast.error(t("signatureRequired"));
      return;
    }

    if (!window.confirm(t("confirmSignContract"))) return;
    
    setSaving(true);
    try {
      const signature = sigPad.getTrimmedCanvas().toDataURL("image/png");

      await updateDoc(doc(db, "contracts", id), {
        signature,
        signatureDate: new Date().toISOString(),
        status: "signed",
        dateUpdated: new Date().toISOString()
      });
      
      setContract({ ...contract, status: "signed", signature, signatureDate: new Date().toISOString() });
      toast.success(t("contractSignedSuccessfully"));
    } catch (err) {
      console.error("Error saving signature:", err);
      alert(t("errorSavingSignature"));
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    if (sigPad) {
      sigPad.clear();
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter", backgroundColor: "#F9FAFB" }}>
        {t("loading")}...
      </div>
    );
  }

  if (!contract) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter", backgroundColor: "#F9FAFB" }}>
        {t("contractNotFound")}
      </div>
    );
  }

  const isSigned = contract.status === "signed";

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
            {contract.title || t("contract")}
          </h1>
          <p style={{ fontFamily: "Inter", margin: 0, color: "#6B7280", fontSize: "16px" }}>
            {t("client")}: {contract.clientName}
          </p>
        </div>
      </header>

      <div style={{ maxWidth: "800px", margin: "40px auto 0", backgroundColor: "white", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", overflow: "hidden" }}>

        <div style={{ padding: "40px" }}>
          
          {/* Contract Content */}
          <div style={{ 
            fontFamily: "serif", 
            fontSize: "16px", 
            lineHeight: "1.8", 
            color: "#374151", 
            whiteSpace: "pre-wrap",
            marginBottom: "40px",
            padding: "20px",
            backgroundColor: "#F9FAFB",
            border: "1px solid #E5E7EB",
            borderRadius: "8px"
          }}>
            {contract.content}
          </div>

          {/* Signature Area */}
          {!isSigned ? (
            <div style={{ borderTop: "2px solid #E5E7EB", paddingTop: "40px" }}>
              <h3 style={{ fontFamily: "Inter", margin: "0 0 16px 0", color: "#111827", textAlign: "center" }}>{t("signHere")}</h3>
              
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ border: "2px dashed #D1D5DB", borderRadius: "12px", backgroundColor: "#F9FAFB", overflow: "hidden", marginBottom: "16px" }}>
                  <SignaturePad
                    ref={(ref) => setSigPad(ref)}
                    canvasProps={{
                      width: Math.min(600, window.innerWidth - 80),
                      height: 250,
                      className: "sigCanvas"
                    }}
                  />
                </div>
                
                <div style={{ display: "flex", gap: "16px" }}>
                  <Button 
                    variant="primary" 
                    onClick={handleSign}
                    disabled={saving}
                    style={{ backgroundColor: "#10B981", borderColor: "#10B981", fontSize: "16px", padding: "12px 32px" }}
                  >
                    {saving ? t("saving") : t("confirmSignature")}
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={handleClear}
                    disabled={saving}
                    style={{ fontSize: "16px", padding: "12px 24px" }}
                  >
                    {t("clear")}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ borderTop: "2px solid #E5E7EB", paddingTop: "40px", textAlign: "center" }}>
              <span style={{ 
                display: "inline-block", 
                padding: "8px 16px", 
                borderRadius: "20px", 
                fontFamily: "Inter",
                fontWeight: 600,
                backgroundColor: "#DCFCE7",
                color: "#166534",
                marginBottom: "20px"
              }}>
                {t("contractSigned")}
              </span>
              
              {contract.signature && (
                <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <p style={{ fontFamily: "Inter", color: "#6B7280", marginBottom: "8px" }}>{t("digitalSignature")}:</p>
                  <img 
                    src={contract.signature} 
                    alt="Firma del cliente" 
                    style={{ borderBottom: "2px solid #111827", paddingBottom: "8px", maxWidth: "400px", width: "100%" }} 
                  />
                  <p style={{ fontFamily: "Inter", color: "#6B7280", marginTop: "8px", fontSize: "14px" }}>
                    {new Date(contract.signatureDate).toLocaleString()}
                  </p>
                </div>
              )}
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
