import React, { useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import { useTranslation } from "react-i18next";
import { db } from "../../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";


const ClientNew = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveClient = async () => {
    try {
      await addDoc(collection(db, "clients"), {
        ...form,
        createdAt: Timestamp.now()
      });

      navigate("/clients");
    } catch (error) {
      console.error("Error guardando cliente:", error);
      alert("Error guardando cliente: " + error.message);
    }
  };

  return (
    <AppLayout>
    <Button variant="secondary" onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
      ← {t("back")}
    </Button>


      <h2 style={{ fontFamily: "Inter", fontSize: "24px", marginBottom: "20px" }}>
        {t("createClient")}
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

      <Button variant="primary" type="button" onClick={saveClient}>
        {t("saveClient")}
      </Button>


      </div>
    </AppLayout>
  );
};

export default ClientNew;
