import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import firebase from "../db/firebase";
import { adminCredentials } from "../db/firebase";

const Login = () => {
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (adminUsername === adminCredentials.email && adminPassword === adminCredentials.password) {
    try {
      // Firebase Auth ile admin girişi yap
      await firebase.auth().signInWithEmailAndPassword(adminUsername, adminPassword);
      const user = firebase.auth().currentUser;
      if (user) {
        if (user.email === "sam@gmail.com") {
          // Admin girişi yapıldıysa AdminDashboard'a yönlendir
          navigate("/admin-dashboard");
        } else {
          // Doktor girişi yapıldıysa DoctorDashboard'a yönlendir
          navigate("/doctor-dashboard");
        }
      }

      setMessage("Admin girişi başarılı!");
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage("Giriş yapılırken bir hata oluştu.");
    }} else {
      setMessage("Geçersiz giriş bilgileri. Lütfen e-postanızı ve şifrenizi kontrol edin.");
    }
  };

 
  

  return (
    <div className="login-container">
      <h2>Admin Girişi</h2>
      <div className="form-group">
        <label>Kullanıcı Adı:</label>
        <input type="text" value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Şifre:</label>
        <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />
      </div>
      <div className="form-buttons">
        <button onClick={handleLogin}>Giriş Yap</button>
      </div>
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default Login;
