import React, { useEffect, useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import { useTranslation } from "react-i18next";
import { db } from "../../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";



const ClientView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    type: "individual",
    taxId: "",
    notes: ""
  });

  // Cargar cliente
  useEffect(() => {
    const loadClient = async () => {
      const ref = doc(db, "clients", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setForm(snap.data());
      }

      setLoading(false);
    };

    loadClient();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateClient = async () => {
    const ref = doc(db, "clients", id);
    await updateDoc(ref, form);
    alert(t("clientSaved"));
  };

  const deleteClient = async () => {
    if (!window.confirm("¿Eliminar cliente?")) return;

    const ref = doc(db, "clients", id);
    await deleteDoc(ref);

    alert(t("clientDeleted"));
    navigate("/clients");
  };

  if (loading) return <AppLayout>Cargando...</AppLayout>;

  return (
    <AppLayout>
    <Button variant="secondary" onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
      ← {t("back")}
    </Button>


      <h2 style={{ fontFamily: "Inter", fontSize: "24px", marginBottom: "20px" }}>
        {t("editClient")}
      </h2>

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          maxWidth: "600px"
        }}
      >
        <label>{t("clientName")}</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
        />

        <label>{t("clientEmail")}</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
        />

        <label>{t("clientPhone")}</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
        />

        <label>{t("clientAddress")}</label>
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
        />

        <label>{t("clientCity")}</label>
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
        />

        <label>{t("clientCountry")}</label>
        <input
          name="country"
          value={form.country}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
        />

        <label>{t("clientType")}</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
        >
          <option value="individual">{t("clientTypeIndividual")}</option>
          <option value="company">{t("clientTypeCompany")}</option>
        </select>

        <label>{t("clientTaxId")}</label>
        <input
          name="taxId"
          value={form.taxId}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
        />

        <label>{t("clientNotes")}</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
        />

        <button
          onClick={updateClient}
          style={{
            padding: "10px 16px",
            backgroundColor: "#3B82F6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "Inter",
            fontSize: "14px",
            marginRight: "10px"
          }}
        >
          {t("updateClient")}
        </button>

        <button
          onClick={deleteClient}
          style={{
            padding: "10px 16px",
            backgroundColor: "#EF4444",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "Inter",
            fontSize: "14px"
          }}
        >
          {t("deleteClient")}
        </button>
      </div>
    </AppLayout>
  );
};

export default ClientView;
