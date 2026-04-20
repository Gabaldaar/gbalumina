import React, { useEffect, useState, useContext } from "react";
import AppLayout from "../../layouts/AppLayout";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs
} from "firebase/firestore";
import Button from "../../components/ui/Button";
import { useTranslation } from "react-i18next";
import { CurrencyContext } from "../../context/CurrencyContext";
import { formatCurrency } from "../../utils/formatCurrency";

export default function BudgetView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currency } = useContext(CurrencyContext);

  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    id: "",
    clientId: "",
    clientName: "",
    title: "",
    date: "",
    items: [],
    notes: "",
    status: "draft",
    currency: "ARS",
    total: 0
  });

  const [newItem, setNewItem] = useState({
    service: "",
    quantity: 1,
    unitPrice: 0
  });

  useEffect(() => {
    const loadData = async () => {
      const snap = await getDoc(doc(db, "budgets", id));
      if (!snap.exists()) {
        navigate("/budgets");
        return;
      }

      const data = snap.data();

      const items = data.items || [];
      const total = items.reduce(
        (acc, item) => acc + item.quantity * item.unitPrice,
        0
      );

      setForm({
        id: snap.id,
        clientId: data.clientId || "",
        clientName: data.clientName || "",
        title: data.title || `Presupuesto ${new Date().toLocaleDateString()}`,
        date: data.date || new Date().toISOString().split("T")[0],
        items,
        notes: data.notes || "",
        status: data.status || "draft",
        currency: data.currency || currency,
        total
      });

      const clientsSnap = await getDocs(collection(db, "clients"));
      const list = clientsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setClients(list);

      setLoading(false);
    };

    loadData();
  }, [id, navigate, currency]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "clientId") {
      const selected = clients.find((c) => c.id === value);
      setForm({
        ...form,
        clientId: value,
        clientName: selected ? selected.name : ""
      });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
      [name]: name === "quantity" || name === "unitPrice" ? Number(value) : value
    });
  };

  const recalcTotal = (items) =>
    items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);

  const addItem = () => {
    if (!newItem.service) {
      setError(t("errorServiceRequired"));
      return;
    }
    if (newItem.unitPrice <= 0) {
      setError(t("errorPricePositive"));
      return;
    }

    const updated = [...form.items, newItem];
    const total = recalcTotal(updated);

    setForm({ ...form, items: updated, total });
    setNewItem({ service: "", quantity: 1, unitPrice: 0 });
    setError("");
  };

  const removeItem = (index) => {
    const updated = form.items.filter((_, i) => i !== index);
    const total = recalcTotal(updated);
    setForm({ ...form, items: updated, total });
  };

  const saveChanges = async () => {
    if (!form.clientId) {
      setError(t("errorClientRequired"));
      return;
    }

    if (!form.date) {
      setError(t("errorDateRequired"));
      return;
    }

    if (form.items.length === 0) {
      setError(t("errorItemsRequired"));
      return;
    }

    const payload = {
      ...form,
      total: recalcTotal(form.items)
    };

    await updateDoc(doc(db, "budgets", form.id), payload);
    navigate("/budgets");
  };

  const deleteBudget = async () => {
    if (!window.confirm(t("confirmDelete"))) return;
    await deleteDoc(doc(db, "budgets", form.id));
    navigate("/budgets");
  };

  if (loading) {
    return (
      <AppLayout>
        <p>{t("loading")}...</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Button
        variant="secondary"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "20px" }}
      >
        ← {t("back")}
      </Button>

      <h2
        style={{
          fontFamily: "Inter",
          fontSize: "24px",
          marginBottom: "20px"
        }}
      >
        {t("editBudget")}
      </h2>

      {error && (
        <div
          style={{
            backgroundColor: "#FEE2E2",
            color: "#B91C1C",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontFamily: "Inter"
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          maxWidth: "700px",
          width: "100%"
        }}
      >
        <label>{t("selectClient")}</label>
        <select
          name="clientId"
          value={form.clientId}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
        >
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} — {c.email}
            </option>
          ))}
        </select>

        <label>{t("budgetDate")}</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          style={{
            width: "200px",
            padding: "8px",
            marginBottom: "12px"
          }}
        />

        <h3 style={{ marginTop: "20px" }}>{t("items")}</h3>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "12px"
          }}
        >
          <input
            placeholder={t("service")}
            name="service"
            value={newItem.service}
            onChange={handleItemChange}
            style={{
              flex: "1 1 200px",
              padding: "8px"
            }}
          />

          <input
            type="number"
            placeholder={t("quantity")}
            name="quantity"
            value={newItem.quantity}
            onChange={handleItemChange}
            style={{
              width: "90px",
              padding: "8px"
            }}
          />

          <input
            type="number"
            placeholder={t("unitPrice")}
            name="unitPrice"
            value={newItem.unitPrice}
            onChange={handleItemChange}
            style={{
              width: "120px",
              padding: "8px"
            }}
          />

          <Button variant="primary" type="button" onClick={addItem}>
            {t("addItem")}
          </Button>
        </div>

        {form.items.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#F9FAFB",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "8px",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <span>
              {item.service} — {item.quantity} ×{" "}
              {formatCurrency(item.unitPrice, form.currency)} ={" "}
              {formatCurrency(item.quantity * item.unitPrice, form.currency)}
            </span>

            <Button
              variant="ghost"
              type="button"
              onClick={() => removeItem(index)}
              style={{ color: "#DC2626" }}
            >
              {t("delete")}
            </Button>
          </div>
        ))}

        <label>{t("notes")}</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
        />

        <label>{t("status")}</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
        >
          <option value="draft">{t("draft")}</option>
          <option value="sent">{t("sent")}</option>
          <option value="accepted">{t("accepted")}</option>
        </select>

        <h3 style={{ marginTop: "20px" }}>
          {t("total")}: {formatCurrency(form.total, form.currency)}
        </h3>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <Button variant="primary" type="button" onClick={saveChanges}>
            {t("saveChanges")}
          </Button>

          <Button
            variant="secondary"
            type="button"
            onClick={deleteBudget}
            style={{ color: "#DC2626" }}
          >
            {t("deleteBudget")}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
