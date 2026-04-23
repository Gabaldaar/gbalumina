import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../components/ui/Button";

export default function SelectionPublic() {
  const { id } = useParams();
  const { t } = useTranslation();

  const [selection, setSelection] = useState(null);
  const [settings, setSettings] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [clientNote, setClientNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "selections", id));
        if (snap.exists()) {
          const data = snap.data();
          setSelection(data);
          setSelectedIds(data.selectedIds || []);
          setClientNote(data.clientNote || "");
        }

        try {
          const { getDocs, collection } = await import("firebase/firestore");
          const settingsQuery = await getDocs(collection(db, "settings"));
          if (!settingsQuery.empty) {
            setSettings(settingsQuery.docs[0].data());
          }
        } catch (settingsErr) {
          console.warn("No se pudieron cargar los datos del estudio:", settingsErr);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const toggleSelection = async (photoId) => {
    if (selection.status === "completed") return;

    let newSelectedIds = [];
    if (selectedIds.includes(photoId)) {
      newSelectedIds = selectedIds.filter(id => id !== photoId);
    } else {
      if (selection.maxSelections && selectedIds.length >= selection.maxSelections) {
        alert(t("maxSelectionsReached"));
        return;
      }
      newSelectedIds = [...selectedIds, photoId];
    }

    // Optimistic UI update
    setSelectedIds(newSelectedIds);

    // Auto-save
    try {
      await updateDoc(doc(db, "selections", id), {
        selectedIds: newSelectedIds,
        dateUpdated: new Date().toISOString()
      });
    } catch (err) {
      console.error("Error auto-saving selection:", err);
    }
  };

  const handleNoteBlur = async () => {
    if (selection.status === "completed") return;
    try {
      await updateDoc(doc(db, "selections", id), {
        clientNote,
        dateUpdated: new Date().toISOString()
      });
    } catch (err) {
      console.error("Error auto-saving note:", err);
    }
  };

  const handleFinish = async () => {
    if (!window.confirm(t("confirmFinishSelection"))) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "selections", id), {
        status: "completed",
        clientNote,
        dateUpdated: new Date().toISOString()
      });
      setSelection({ ...selection, status: "completed", clientNote });
      alert(t("selectionFinishedSuccessfully"));
    } catch (err) {
      console.error("Error saving selection:", err);
      alert(t("errorSavingSelection"));
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

  if (!selection) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter", backgroundColor: "#F9FAFB" }}>
        {t("galleryNotFound")}
      </div>
    );
  }

  const isCompleted = selection.status === "completed";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB", paddingBottom: "100px" }}>
      
      <style>
        {`
          .photo-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .photo-card:hover {
            transform: scale(1.02);
            box-shadow: 0 10px 20px rgba(0,0,0,0.15);
            z-index: 5;
          }
        `}
      </style>

      {/* Header */}
      <header style={{ backgroundColor: "white", padding: "50px 20px", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          
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

          <h1 style={{ fontFamily: "Inter", margin: "0 0 24px 0", fontSize: "36px", color: "#111827", fontWeight: 800, letterSpacing: "-0.5px" }}>
            {selection.title}
          </h1>

          <div style={{ maxWidth: "600px", marginTop: "8px" }}>
            <p style={{ fontFamily: "Inter", margin: "0 0 12px 0", color: "#374151", fontSize: "18px", fontWeight: 500 }}>
              {t("hello")}, {selection.clientName} 👋
            </p>
            <p style={{ fontFamily: "Inter", margin: 0, color: "#6B7280", fontSize: "15px", lineHeight: "1.6" }}>
              {t("galleryInstructions")}
              <br/><br/>
              {t("galleryInstructionsPart2")}
              {selection.maxSelections ? (
                <span style={{ display: "block", marginTop: "12px", fontWeight: 600, color: "#10B981" }}>
                  {t("maxSelectionsAlert").replace("{{max}}", selection.maxSelections)}
                </span>
              ) : null}
            </p>
          </div>
        </div>
      </header>

      {/* Grid */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        
        {isCompleted && (
          <div style={{ backgroundColor: "#DCFCE7", color: "#166534", padding: "16px", borderRadius: "8px", marginBottom: "20px", fontFamily: "Inter", textAlign: "center" }}>
            {t("selectionAlreadyCompleted")}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px" }}>
          {(selection.photos || []).map((photo, index) => {
            const isSelected = selectedIds.includes(photo.id);
            return (
              <div 
                key={photo.id}
                className="photo-card"
                style={{
                  position: "relative",
                  aspectRatio: "2/3",
                  borderRadius: "12px",
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: isSelected ? "0 0 0 4px #3B82F6" : "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease"
                }}
                onClick={() => setActivePhotoIndex(index)}
              >
                <img 
                  src={photo.url} 
                  alt={photo.filename} 
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", opacity: isSelected ? 0.8 : 1 }}
                />
                
                {/* Selection indicator / button */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelection(photo.id);
                  }}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "2px solid white",
                    backgroundColor: isSelected ? "#3B82F6" : "rgba(0,0,0,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "20px",
                    fontWeight: "bold",
                    cursor: isCompleted ? "default" : "pointer",
                    transition: "all 0.2s",
                    zIndex: 2
                  }}>
                  {isSelected && "✓"}
                </div>
              </div>
            );
          })}
        </div>
        
        {(!selection.photos || selection.photos.length === 0) && (
          <div style={{ textAlign: "center", color: "#6B7280", marginTop: "40px", fontFamily: "Inter" }}>
            {t("noPhotosYet")}
          </div>
        )}

        {/* Client Note Section */}
        <div style={{ marginTop: "40px", backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <label style={{ display: "block", fontFamily: "Inter", fontSize: "16px", fontWeight: 600, color: "#111827", marginBottom: "4px" }}>
            {t("clientNoteLabel")}
          </label>
          <p style={{ fontFamily: "Inter", margin: "0 0 12px 0", fontSize: "12px", color: "#6B7280" }}>
            {t("clientNoteDesc")}
          </p>
          <textarea 
            value={clientNote}
            onChange={(e) => setClientNote(e.target.value)}
            onBlur={handleNoteBlur}
            disabled={isCompleted}
            placeholder={t("clientNotePlaceholder")}
            style={{
              width: "100%",
              minHeight: "100px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              fontFamily: "Inter",
              resize: "vertical",
              backgroundColor: isCompleted ? "#F9FAFB" : "white",
              color: "#111827"
            }}
          />
        </div>

      </main>

      {/* Floating Action Bar */}
      {!isCompleted && (
        <div style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "white",
          boxShadow: "0 -4px 12px rgba(0,0,0,0.1)",
          padding: "16px 20px",
          display: "flex",
          justifyContent: "center",
          zIndex: 20
        }}>
          <div style={{ maxWidth: "600px", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ fontFamily: "Inter", color: "#374151" }}>
              <strong style={{ fontSize: "18px" }}>{selectedIds.length}</strong> 
              {selection.maxSelections ? ` / ${selection.maxSelections}` : ""} {t("selectedPhotos")}
              <br />
              <span style={{ fontSize: "12px", color: "#10B981" }}>{t("autoSaved")}</span>
            </div>
            
            <Button 
              variant="primary" 
              onClick={handleFinish}
              disabled={saving || selectedIds.length === 0}
              style={{ padding: "12px 24px", fontSize: "16px" }}
            >
              {saving ? t("saving") : t("finishSelection")}
            </Button>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {activePhotoIndex !== null && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.95)",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}>
          
          {/* Top actions */}
          <div style={{ position: "absolute", top: "20px", right: "20px", display: "flex", gap: "16px", zIndex: 101 }}>
            {!isCompleted && (
              <button
                onClick={() => toggleSelection(selection.photos[activePhotoIndex].id)}
                style={{
                  padding: "8px 24px",
                  backgroundColor: selectedIds.includes(selection.photos[activePhotoIndex].id) ? "#3B82F6" : "transparent",
                  color: "white",
                  border: "2px solid #3B82F6",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontFamily: "Inter",
                  fontSize: "16px",
                  fontWeight: "bold",
                  transition: "all 0.2s"
                }}
              >
                {selectedIds.includes(selection.photos[activePhotoIndex].id) ? "✓ " + t("selected") : t("selectPhoto")}
              </button>
            )}
            <button 
              onClick={() => setActivePhotoIndex(null)}
              style={{ background: "transparent", border: "none", color: "white", fontSize: "32px", cursor: "pointer", lineHeight: "1" }}
            >
              ×
            </button>
          </div>

          {/* Navigation Prev */}
          {activePhotoIndex > 0 && (
            <button
              onClick={() => setActivePhotoIndex(activePhotoIndex - 1)}
              style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "none", color: "white", fontSize: "24px", cursor: "pointer", width: "50px", height: "50px", borderRadius: "50%", zIndex: 101 }}
            >
              ←
            </button>
          )}

          {/* Main Image */}
          <img 
            src={selection.photos[activePhotoIndex].url} 
            alt={selection.photos[activePhotoIndex].filename} 
            style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain" }}
          />

          {/* Navigation Next */}
          {activePhotoIndex < selection.photos.length - 1 && (
            <button
              onClick={() => setActivePhotoIndex(activePhotoIndex + 1)}
              style={{ position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "none", color: "white", fontSize: "24px", cursor: "pointer", width: "50px", height: "50px", borderRadius: "50%", zIndex: 101 }}
            >
              →
            </button>
          )}

          <div style={{ position: "absolute", bottom: "20px", color: "#9CA3AF", fontFamily: "Inter" }}>
            {activePhotoIndex + 1} / {selection.photos.length}
          </div>

        </div>
      )}

      {/* Footer Branding */}
      <div style={{ textAlign: "center", padding: "40px 20px 100px", marginTop: "auto", color: "#9CA3AF", fontFamily: "Inter", fontSize: "13px" }}>
        {t("poweredBy")} <a href="#" style={{ color: "#6B7280", textDecoration: "none", fontWeight: 600 }}>GBALumina</a>
      </div>

    </div>
  );
}
