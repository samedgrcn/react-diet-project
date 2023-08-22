import React, { useState, useEffect } from "react";
import { auth, firestore } from "../db/firebase"; // Firebase bağlantınızı burada içe aktarın
import "./ProfileSettings.css";

const ProfileEditPage = () => {
  const [doctorInfo, setDoctorInfo] = useState({
    name: "",
    age: "",
    gender: "",
    school: "",
    // Diğer alanlar buraya ekleyebilirsiniz
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Kullanıcının mevcut bilgilerini Firestore'dan getirin ve state'e yerleştirin
    const user = auth.currentUser;
    const userRef = firestore.collection("doctors").doc(user.uid);

    userRef.get().then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        setDoctorInfo(data);
      }
    });
  }, []);

  const handleInputChange = (field, value) => {
    setDoctorInfo((prevDoctorInfo) => ({
      ...prevDoctorInfo,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const user = auth.currentUser;
      const userRef = firestore.collection("doctors").doc(user.uid);

      await userRef.update(doctorInfo);

      setErrorMessage("");
      // Başarılı bir şekilde güncelleme mesajı verilebilir
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="profile-edit-container">
      <h1 className="profile-edit-title">Profil Düzenleme Sayfası</h1>
      <div className="profile-edit-form">
        <div className="form-group">
          <label>Ad:</label>
          <input
            type="text"
            className="form-input"
            value={doctorInfo.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Yaş:</label>
          <input
            type="text"
            className="form-input"
            value={doctorInfo.age}
            onChange={(e) => handleInputChange("age", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Cinsiyet:</label>
          <select
            className="form-input"
            value={doctorInfo.gender}
            onChange={(e) => handleInputChange("gender", e.target.value)}
            >
            <option value="erkek">Erkek</option>
            <option value="kadın">Kadın</option>
        </select>
        </div>
        <div className="form-group">
          <label>Okul:</label>
          <input
            type="text"
            className="form-input"
            value={doctorInfo.school}
            onChange={(e) => handleInputChange("school", e.target.value)}
          />
        </div>
        {/* Diğer alanlar için aynı yapıyı kullanabilirsiniz */}
        <button className="submit-button" onClick={handleSaveChanges}>
          Değişiklikleri Kaydet
        </button>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default ProfileEditPage;
