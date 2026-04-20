import React, { useEffect, useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";

const Clients = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "clients"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setClients(data);
    });

    return () => unsub();
  }, []);

  return (
    <AppLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}
      >
        <h2 style={{ fontFamily: "Inter", fontSize: "24px" }}>
          {t("clients")}
        </h2>

        <button
          onClick={() => navigate("/clients/new")}
          style={{
            padding: "10px 16px",
            backgroundColor: "#3B82F6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "Inter",
            fontSize: "14px"
          }}
        >
          {t("createClient")}
        </button>
      </div>

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          fontFamily: "Inter"
        }}
      >
        {clients.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "#6B7280"
            }}
          >
            {t("noClientsYet")}
          </div>
        ) : (
          clients.map((client) => (
            <div
              key={client.id}
              onClick={() => navigate(`/clients/${client.id}`)}
              style={{
                padding: "12px",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <div>
                <strong>{client.name}</strong>
                <div style={{ color: "#6B7280", fontSize: "14px" }}>
                  {client.email}
                </div>
              </div>

              <div style={{ color: "#3B82F6" }}>→</div>
            </div>
          ))
        )}
      </div>
    </AppLayout>
  );
};

export default Clients;
