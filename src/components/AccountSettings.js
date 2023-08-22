import React, { useState } from "react";
import firebase, { auth } from "../db/firebase";
import "./AccountSettings.css";


const AccountSettings = ({ currentUser, setCurrentUser }) => {
  const [changeType, setChangeType] = useState("email"); // "email" veya "password"
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newEmailRepeat, setNewEmailRepeat] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChangeType = (type) => {
    setChangeType(type);
    setCurrentPassword("");
    setNewEmail("");
    setNewEmailRepeat("");
    setNewPassword("");
    setNewPasswordRepeat("");
    setErrorMessage("");
  };

  const handleUpdateEmail = async () => {
    if (newEmail !== newEmailRepeat) {
      setErrorMessage("New emails do not match.");
      return;
    }

    try {
      const user = auth.currentUser;
    const emailAuthProvider = firebase.auth.EmailAuthProvider;
    const credentials = emailAuthProvider.credential(user.email, currentPassword);
    await user.reauthenticateWithCredential(credentials);
    await user.updateEmail(newEmail);

    // E-postayı güncelledikten sonra currentUser'ı güncelle
    currentUser.email = newEmail;

    setErrorMessage("");

     // Kullanıcının e-posta adresini güncelle
     setCurrentUser({ ...currentUser, email: newEmail });
     
    // Veritabanında güncelleme işlemi yapabilirsiniz
  } catch (error) {
      setErrorMessage(error.message);
    }
    setNewEmail("")
    setNewEmailRepeat("");
    setCurrentPassword("");
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== newPasswordRepeat) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const user = auth.currentUser;
    const emailAuthProvider = firebase.auth.EmailAuthProvider;
    const credentials = emailAuthProvider.credential(user.email, currentPassword);
    await user.reauthenticateWithCredential(credentials);
    await user.updatePassword(newPassword);
    setErrorMessage("");
    
    // Veritabanında güncelleme işlemi yapabilirsiniz
  } catch (error) {
      setErrorMessage(error.message);
    }
    setNewPassword("");
    setNewPasswordRepeat("");
    setCurrentPassword("");
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Hesap Ayarları Sayfası</h1>
      <div className="change-type-buttons">
        <button
          onClick={() => handleChangeType("email")}
          className={changeType === "email" ? "change-type-button active" : "change-type-button"}
        >
          E-posta Değiştirme
        </button>
        <button
          onClick={() => handleChangeType("password")}
          className={changeType === "password" ? "change-type-button active" : "change-type-button"}
        >
          Şifre Değiştirme
        </button>
      </div>
      {changeType === "email" && (
        <div className={`change-email-form ${changeType === "email" ? "active" : ""}`}>
          <input
            type="email"
            placeholder="Yeni E-posta"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <input
            type="email"
            placeholder="Yeni E-posta Tekrar"
            value={newEmailRepeat}
            onChange={(e) => setNewEmailRepeat(e.target.value)}
          />
          <input
            type="password"
            placeholder="Şu Anki Şifre"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <button onClick={handleUpdateEmail}>E-postayı Değiştir</button>
        </div>
      )}
      {changeType === "password" && (
        <div className={`change-password-form ${changeType === "password" ? "active" : ""}`}>
          <input
            type="password"
            placeholder="Şu Anki Şifre"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Yeni Şifre"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Yeni Şifre Tekrar"
            value={newPasswordRepeat}
            onChange={(e) => setNewPasswordRepeat(e.target.value)}
          />
          <button onClick={handleUpdatePassword}>Şifreyi Değiştir</button>
        </div>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default AccountSettings;
