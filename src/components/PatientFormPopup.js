// PatientFormPopup.js
import React from "react";
import "./PatientFormPopup.css";

const PatientFormPopup = ({ patientData, setPatientData, onClose, onSubmit }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    onSubmit(patientData);
    onClose();
  };



  return (
    <div className={`patient-form-popup ${patientData.id ? "update" : "add"}`}>
      <div className="patient-form-popup-header">
        <h3>{patientData.id ? "Hasta Bilgilerini Güncelle" : "Yeni Hasta Ekle"}</h3>
        <button className="close-button" onClick={onClose}>
          X
        </button>
      </div>
      <div className="patient-form-popup-content">
        <div className="input-group">
          <label>Ad Soyad</label>
          <input type="text" name="name" value={patientData.name} onChange={handleInputChange} />
        </div>
        <div className="input-group">
          <label>TC Numarası</label>
          <input type="text" name="tcNumber" value={patientData.tcNumber} onChange={handleInputChange} />
        </div>
        <div className="input-group">
          <label>Telefon</label>
          <input type="text" name="phoneNumber" value={patientData.phoneNumber} onChange={handleInputChange} />
        </div>
        <div className="input-group">
          <label>Eposta</label>
          <input type="text" name="email" value={patientData.email} onChange={handleInputChange} />
        </div>
        <div className="input-group">
          <label>Doğum Günü</label>
          <input type="text" name="birthDate" value={patientData.birthDate} onChange={handleInputChange} />
        </div>
        <div className="input-group">
          <label>Boy</label>
          <input type="text" name="height" value={patientData.height} onChange={handleInputChange} />
        </div>
        <div className="input-group">
          <label>Kilo</label>
          <input type="text" name="weight" value={patientData.weight} onChange={handleInputChange} />
        </div>
        <div className="input-group">
          <label>Vücut Yağ Oranı</label>
          <input type="text" name="bodyFatPercentage" value={patientData.bodyFatPercentage} onChange={handleInputChange} />
        </div>
        <div className="input-group">
          <label>BMI</label>
          <input type="text" name="bmi" value={patientData.bmi} onChange={handleInputChange} />
        </div>
        <div className="input-group">
          <label>Cinsiyet</label>
          <select name="gender" value={patientData.gender} onChange={handleInputChange}>
            <option value="male">Erkek</option>
            <option value="female">Kadın</option>
          </select>
        </div>
        <div className="input-group">
          <label>Hedef Kilo</label>
          <input type="text" name="targetWeight" value={patientData.targetWeight} onChange={handleInputChange} />
        </div>
        
      </div>
      <div className="patient-form-popup-footer">
        <button className="save-button" onClick={handleSave}>
          Kaydet
        </button>
      </div>
    </div>
  );
};

export default PatientFormPopup;
