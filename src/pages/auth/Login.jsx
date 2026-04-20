import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../../firebase";
import Branding from "../../components/Branding";
import Header from "../../components/Header";
import { useTranslation } from "react-i18next";
import AuthLayout from "../../layouts/AuthLayout";


const Login = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

 return (
  <AuthLayout>
    <form
      onSubmit={handleSubmit}
      style={{
        width: "100%",
        padding: "30px",
        borderRadius: "12px",
        backgroundColor: "white",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
      }}
    >
      <Branding />

      {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

      <label style={{ fontFamily: "Inter", fontSize: "14px" }}>{t("email")}</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "5px",
          marginBottom: "15px",
          borderRadius: "6px",
          border: "1px solid #D1D5DB"
        }}
      />

      <label style={{ fontFamily: "Inter", fontSize: "14px" }}>{t("password")}</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "5px",
          marginBottom: "20px",
          borderRadius: "6px",
          border: "1px solid #D1D5DB"
        }}
      />

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#3B82F6",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontFamily: "Inter",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        {t("login")}
      </button>

      <p
        style={{
          marginTop: "15px",
          textAlign: "center",
          fontFamily: "Inter",
          fontSize: "14px"
        }}
      >
        {t("noAccount")}{" "}
        <span
          onClick={() => navigate("/register")}
          style={{ color: "#3B82F6", cursor: "pointer" }}
        >
          {t("createAccount")}
        </span>
      </p>
    </form>
  </AuthLayout>
);

};

export default Login;
