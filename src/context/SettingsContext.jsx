import { createContext, useContext, useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);

  // 🔥 1) Esperamos a que Firebase cargue el usuario
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  // 🔥 2) Cargamos settings SOLO cuando user existe
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const ref = doc(db, "settings", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

        // Normalizamos TODOS los campos
        const completeSettings = {
          language: data.language ?? "es",

          photographerName: data.photographerName ?? "",
          photographerEmail: data.photographerEmail ?? "",
          photographerPhone: data.photographerPhone ?? "",

          studioName: data.studioName ?? "",
          studioAddress: data.studioAddress ?? "",
          studioWebsite: data.studioWebsite ?? "",
          studioInstagram: data.studioInstagram ?? "",

          logoUrl: data.logoUrl ?? "",

          favoriteCurrencies: data.favoriteCurrencies ?? ["ARS", "USD", "EUR"]
        };

        setSettings(completeSettings);
      } else {
        const defaultSettings = {
          language: "es",

          photographerName: "",
          photographerEmail: "",
          photographerPhone: "",

          studioName: "",
          studioAddress: "",
          studioWebsite: "",
          studioInstagram: "",

          logoUrl: "",

          favoriteCurrencies: ["ARS", "USD", "EUR"]
        };

        await setDoc(ref, defaultSettings);
        setSettings(defaultSettings);
      }
    };

    load();
  }, [user]);

  // 🔥 3) updateSettings seguro
  const updateSettings = async (newValues) => {
    if (!user) return;

    const ref = doc(db, "settings", user.uid);
    await setDoc(ref, { ...settings, ...newValues }, { merge: true });
    setSettings((prev) => ({ ...prev, ...newValues }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  return useContext(SettingsContext);
}
