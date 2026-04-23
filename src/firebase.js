// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD_cugqDcQT5UXD4Gh3YYotnw8y6HqcOco",
  authDomain: "photoflow-9eb46.firebaseapp.com",
  projectId: "photoflow-9eb46",
  storageBucket: "photoflow-9eb46",
  messagingSenderId: "776149837228",
  appId: "1:776149837228:web:26e66e11c062b78b2e0609"
};

const app = initializeApp(firebaseConfig);
console.log("Firebase initialized:", app.name);
console.log("Project ID:", app.options.projectId);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app, "gs://photoflow-9eb46");

