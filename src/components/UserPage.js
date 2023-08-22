import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'

import "./UserPage.css";
import firebase from "../db/firebase";


const UserPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
   
      try {
        // Firebase Auth ile admin girişi yap
        await firebase.auth().signInWithEmailAndPassword(email, password);
        const user = firebase.auth().currentUser;
        if (user) {
          if (user.email === "sam@gmail.com") {
            // Admin girişi yapıldıysa AdminDashboard'a yönlendir
            navigate("/admin-dashboard");
            console.log("/admin-dashboard´a yönlendiriliyor")
          } else {
            // Doktor girişi yapıldıysa DoctorDashboard'a yönlendir
            navigate("/doctor-dashboard");
            console.log("/doctor-dashboard´a yönlendiriliyor")
          }
        }
  
        setMessage("Admin girişi başarılı!");
      } catch (error) {
        console.error("Error logging in:", error);
        setMessage("Giriş yapılırken bir hata oluştu.");
      }
    };

  const handleForgotPassword = async () => {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      alert("Şifre sıfırlama talimatları e-posta adresinize gönderildi.");
    } catch (error) {
      console.error("Şifre sıfırlama talebi gönderilirken hata oluştu:", error);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="user-page-container">
      <div className="user-page-form">
        <h1 className="user-page-title">Kullanıcı Girişi</h1>
        <input
          type="email"
          placeholder="E-posta adresi"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="password-toggle" onClick={handleTogglePasswordVisibility}>
            {showPassword ? "Gizle" : "Göster"}
          </span>
        </div>
        <Link to='/admin-dashboard'>
        <button onClick={handleLogin}>Giriş Yap</button>
        </Link>
        <span className="forgot-password" onClick={handleForgotPassword}>
          Şifremi Unuttum
        </span>
        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
};

export default UserPage;
