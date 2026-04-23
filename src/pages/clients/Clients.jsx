import React, { useEffect, useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import SectionHeader from "../../components/SectionHeader";

import Button from "../../components/ui/Button";

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
      {/* Encabezado de sección */}
      <SectionHeader
        title={t("clients")}
        subtitle={t("manageClients")}
        right={
          <Button variant="primary" onClick={() => navigate("/clients/new")}>
            {t("createClient")}
          </Button>
        }
      />

      {/* Contenedor de lista */}
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
