import React, { useEffect, useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import imageCompression from "browser-image-compression";
import SectionHeader from "../../components/SectionHeader";
import Button from "../../components/ui/Button";

export default function SelectionView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selection, setSelection] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, "selections", id));
      if (snap.exists()) {
        setSelection(snap.data());
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(t("confirmDeleteSelection"))) return;
    await deleteDoc(doc(db, "selections", id));
    navigate("/selection");
  };

  const handleStatusChange = async (newStatus) => {
    await updateDoc(doc(db, "selections", id), { status: newStatus });
    setSelection({ ...selection, status: newStatus });
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    const storage = getStorage();
    const newPhotos = [...(selection.photos || [])];

    let uploadedCount = 0;

    const options = {
      maxSizeMB: 1.5,
      maxWidthOrHeight: 2500,
      useWebWorker: true,
    };

    for (const file of files) {
      try {
        let fileToUpload = file;
        
        // Compress only if it's larger than 1.5MB
        if (file.size > 1.5 * 1024 * 1024) {
          fileToUpload = await imageCompression(file, options);
        }

        const fileRef = ref(storage, `selections/${id}/${Date.now()}_${fileToUpload.name}`);
        await uploadBytes(fileRef, fileToUpload);
        const url = await getDownloadURL(fileRef);

        newPhotos.push({
          id: `${Date.now()}_${Math.random().toString(36).substring(7)}`,
          url,
          filename: fileToUpload.name
        });

        uploadedCount++;
        setUploadProgress(Math.round((uploadedCount / files.length) * 100));
      } catch (err) {
        console.error("Error uploading file:", err);
      }
    }

    await updateDoc(doc(db, "selections", id), { photos: newPhotos });
    setSelection({ ...selection, photos: newPhotos });
    setUploading(false);
  };

  const removePhoto = async (photoId) => {
    if (!window.confirm(t("confirmDeletePhoto"))) return;
    
    const newPhotos = selection.photos.filter((p) => p.id !== photoId);
    // Remove from selectedIds if it was selected
    const newSelectedIds = (selection.selectedIds || []).filter((sid) => sid !== photoId);

    await updateDoc(doc(db, "selections", id), { 
      photos: newPhotos,
      selectedIds: newSelectedIds 
    });
    setSelection({ ...selection, photos: newPhotos, selectedIds: newSelectedIds });
  };

  if (!selection) return null;

  const publicLink = `${window.location.origin}/s/${id}`;

  return (
    <AppLayout>
      <SectionHeader
        title={selection.title}
        subtitle={`${t("client")}: ${selection.clientName}`}
      />

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <Button variant="secondary" onClick={() => navigate("/selection")}>
          ← {t("back")}
        </Button>
        <Button 
          variant="primary" 
          onClick={() => {
            navigator.clipboard.writeText(publicLink);
            alert(t("linkCopied"));
          }}
          style={{ backgroundColor: "#10B981", borderColor: "#10B981" }}
        >
          {t("copyLink")}
        </Button>
        <Button variant="primary" onClick={handleDelete} style={{ backgroundColor: "#DC2626", borderColor: "#DC2626" }}>
          {t("delete")}
        </Button>
      </div>

      <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
        
        {/* Info Card */}
        <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p style={{ fontFamily: "Inter", margin: "0 0 8px 0", color: "#6B7280" }}>
                {t("status")}: 
                <select 
                  value={selection.status} 
                  onChange={(e) => handleStatusChange(e.target.value)}
                  style={{ marginLeft: "8px", padding: "4px 8px", borderRadius: "6px", fontFamily: "Inter" }}
                >
                  <option value="draft">{t("draft")}</option>
                  <option value="sent">{t("sent")}</option>
                  <option value="completed">{t("completed")}</option>
                </select>
              </p>
              <p style={{ fontFamily: "Inter", margin: 0, color: "#6B7280" }}>
                {t("maxSelections")}: <strong>{selection.maxSelections || t("noLimit")}</strong>
              </p>
              <p style={{ fontFamily: "Inter", margin: "8px 0 0 0", color: "#6B7280" }}>
                {t("selectedByClient")}: <strong>{(selection.selectedIds || []).length}</strong>
              </p>
            </div>

            {selection.clientNote && (
              <div style={{ flex: 1, minWidth: "250px", backgroundColor: "#F9FAFB", padding: "12px", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                <strong style={{ fontFamily: "Inter", fontSize: "12px", color: "#6B7280", textTransform: "uppercase" }}>
                  {t("clientNoteLabel")}
                </strong>
                <p style={{ fontFamily: "Inter", margin: "4px 0 0 0", fontSize: "14px", color: "#111827", whiteSpace: "pre-wrap" }}>
                  {selection.clientNote}
                </p>
              </div>
            )}

            <div>
              <label style={{
                display: "inline-block",
                padding: "10px 16px",
                backgroundColor: "#3B82F6",
                color: "white",
                borderRadius: "8px",
                cursor: "pointer",
                fontFamily: "Inter",
                fontSize: "14px",
                fontWeight: 500,
                marginBottom: "4px"
              }}>
                {uploading ? `${t("uploading")} ${uploadProgress}%` : t("uploadPhotos")}
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  style={{ display: "none" }} 
                  disabled={uploading}
                />
              </label>
              <p style={{ margin: 0, fontSize: "12px", color: "#6B7280", fontFamily: "Inter" }}>
                {t("uploadSizeWarning")}
              </p>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "16px" }}>
          {(selection.photos || []).map((photo) => {
            const isSelected = (selection.selectedIds || []).includes(photo.id);
            return (
              <div key={photo.id} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", aspectRatio: "1/1" }}>
                <img 
                  src={photo.url} 
                  alt={photo.filename} 
                  style={{ width: "100%", height: "100%", objectFit: "cover", opacity: isSelected ? 0.7 : 1 }}
                />
                {isSelected && (
                  <div style={{ position: "absolute", top: "8px", right: "8px", backgroundColor: "#10B981", color: "white", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                    ✓
                  </div>
                )}
                <button 
                  onClick={() => removePhoto(photo.id)}
                  style={{ position: "absolute", bottom: "8px", right: "8px", backgroundColor: "rgba(220, 38, 38, 0.9)", color: "white", border: "none", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", fontSize: "12px" }}
                >
                  {t("delete")}
                </button>
              </div>
            );
          })}
        </div>

        {(!selection.photos || selection.photos.length === 0) && (
          <div style={{ textAlign: "center", color: "#6B7280", marginTop: "40px", fontFamily: "Inter" }}>
            {t("noPhotosYet")}
          </div>
        )}

      </div>
    </AppLayout>
  );
}
