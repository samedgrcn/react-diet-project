import React, { useState, useEffect } from "react";
import { firestore } from "../db/firebase";
import PatientFormPopup from "./PatientFormPopup";
import PDFButton from "./PDFButton";
import "./PatientList.css";

const PatientList = ({currentUser}) => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedPatientData, setUpdatedPatientData] = useState({
    name: "",
    tcNumber: "",
    phoneNumber: "",
    email: "",
    birthDate: "",
    height: "",
    weight: "",
    bodyFatPercentage: "",
    bmi: "",
    gender: "",
    targetWeight: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const docRef = firestore.collection("doctors").doc(currentUser.uid);
        const snapshot = await docRef.get();
        
        if (snapshot.exists) {
          const fetchedPatients = snapshot.data().patients || [];
          setPatients(fetchedPatients);
        } else {
          console.log("No patients found for the current user.");
        }

      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
  
    fetchPatients();
  }, [currentUser]);
  

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.tcNumber.includes(searchQuery)
  );

  const handlePatientClick = (patient) => {
    if (selectedPatient && selectedPatient.id === patient.id) {
      setSelectedPatient(null);
      setIsUpdating(false); // Hasta bilgilerini sadece görüntüleme moduna geçir
    } else {
      setSelectedPatient(patient);
       // Yeni bir hastaya tıkladığınızda, önce sadece görüntüleme moduna geçirin
      setUpdatedPatientData(patient);
    }
  };

  const handleUpdatePatient = async (event) => {
    event.stopPropagation();
    try {
      if (!selectedPatient) {
        return;
      }

      // Firestore doküman referansını alın
      const doctorRef = firestore.collection("doctors").doc(currentUser.uid);
  
      // Firestore dokümanını alın
      const doctorSnapshot = await doctorRef.get();
      const doctorData = doctorSnapshot.data();
  
      // Seçili hastanın dizideki indexini bulun
      const selectedIndex = doctorData.patients.findIndex(
        (patient) => patient.id === selectedPatient.id);
  
      if (selectedIndex === -1) {

        throw new Error("Seçili hasta bulunamadı.");
      }
        // Eğer seçili hasta dizide bulunuyorsa, sadece onun bilgilerini güncelleyin
        const updatedPatients = [...doctorData.patients];
        updatedPatients[selectedIndex] = { ...updatedPatients[selectedIndex], 
          name: updatedPatientData.name,
          tcNumber: updatedPatientData.tcNumber,
          phoneNumber: updatedPatientData.phoneNumber,
          email: updatedPatientData.email,
          birthDate: updatedPatientData.birthDate,
          height: updatedPatientData.height,
          weight: updatedPatientData.weight,
          bodyFatPercentage: updatedPatientData.bodyFatPercentage,
          bmi: updatedPatientData.bmi,
          gender: updatedPatientData.gender,
          targetWeight: updatedPatientData.targetWeight };
          
          // Firestore'daki verileri güncelleyin
          await doctorRef.update({ patients: updatedPatients });
          
          // React state'i güncelleyin
          setPatients(updatedPatients);
          setIsUpdating(false);
          setSelectedPatient(null);
        setUpdatedPatientData({
          name: "",
          tcNumber: "",
          phoneNumber: "",
          email: "",
          birthDate: "",
          height: "",
          weight: "",
          bodyFatPercentage: "",
          bmi: "",
          gender: "",
          targetWeight: "",
        });
      
    } catch (error) {
      console.error("Hasta güncelleme hatası:", error);
    }
  };
  
  const handleDeletePatient = async (event, patient, patientId) => {
    event.stopPropagation();
    try {
      const doctorRef = firestore.collection("doctors").doc(currentUser.uid);
      const doctorSnapshot = await doctorRef.get();
      const doctorData = doctorSnapshot.data();
  
      const updatedPatients = doctorData.patients.filter((patient) => patient.id !== patientId);
  
      await doctorRef.update({ patients: updatedPatients });
  
      setPatients(updatedPatients);
      setSelectedPatient(null);
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };
  

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setIsUpdating(false);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setSelectedPatient(null);
    setShowPopup(false);
  };

  function generateRandomId() {
  // Benzersiz bir kimlik oluşturmak için zaman damgasını kullanabilirsiniz.
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}


const handleAddPatientSubmit = async (newPatientData) => {
  try {
    // Ekleme işlemi yapmadan önce mevcut hastaları al
    const doctorRef = firestore.collection("doctors").doc(currentUser.uid);
    const doctorSnapshot = await doctorRef.get();
    const doctorData = doctorSnapshot.data();
    const existingPatients = doctorData.patients || [];

    const patientId = generateRandomId();
    // Yeni hastayı ekleyerek güncellenmiş hastalar dizisini oluştur
    const updatedPatients = [...existingPatients, { id: patientId, ...newPatientData }];
    await doctorRef.update({ patients: updatedPatients });

    const newPatient = { id: patientId, ...newPatientData };
    setPatients((prevPatients) => [...prevPatients, newPatient]);

    setSelectedPatient(null);
    setShowPopup(false);
  } catch (error) {
    console.error("Error adding patient:", error);
  }
};
  

  return (
    <div className="patient-list-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Hasta Adı veya TC Numarası ile Ara"
          value={searchQuery}
          onChange={handleSearch}
        />
        <button onClick={handleAddPatient}>Ekle</button>
      </div>
        <div className="patient-title">
        <p>Danışanın</p>
        <p className="patient-titles">Adı </p>
        <p className="patient-titles">T.C. Nosu </p>
        </div>
      
      <div className="patient-list">
      {filteredPatients.map((patient) => (
  <div
    key={patient.id}
    className={`patient-list-item ${selectedPatient?.id === patient.id ? "selected" : ""}`}
    onClick={() => handlePatientClick(patient)}
  >
    <div className={`patient-avatar ${patient.gender === "male" ? "male" : "female"}`}>
      {patient.gender === "male" ? "Bay" : "Bayan"}
    </div>
    <div className="patient-info">
      <span className="patient-infos">{patient.name}</span>
      <span className="patient-infoss">{patient.tcNumber}</span>
    </div>
    
      <div className="patient-actions">
        <button onClick={() => setIsUpdating(true)}>Düzenle</button>
        <button onClick={(event) => handleDeletePatient(event, patient, patient.id)}>Sil</button>

        <PDFButton patient={patient} />
      </div>
      
    
  </div>
))}

      </div>
      {selectedPatient && (
        <div className="patient-details">
          {isUpdating ? (
            <div className="update-forms">
              <input
                type="text"
                value={updatedPatientData.name}
                onChange={(e) => setUpdatedPatientData({ ...updatedPatientData, name: e.target.value })}
              />
              <input
                type="text"
                value={updatedPatientData.tcNumber}
                onChange={(e) => setUpdatedPatientData({ ...updatedPatientData, tcNumber: e.target.value })}
              />
              <input
                type="text"
                value={updatedPatientData.phoneNumber}
                onChange={(e) => setUpdatedPatientData({ ...updatedPatientData, phoneNumber: e.target.value })}
              />
              <input
                type="text"
                value={updatedPatientData.email}
                onChange={(e) => setUpdatedPatientData({ ...updatedPatientData, email: e.target.value })}
              />
              <input
                type="text"
                value={updatedPatientData.birthDate}
                onChange={(e) => setUpdatedPatientData({ ...updatedPatientData, birthDate: e.target.value })}
              />
              <input
                type="text"
                value={updatedPatientData.height}
                onChange={(e) => setUpdatedPatientData({ ...updatedPatientData, height: e.target.value })}
              />
              <input
                type="text"
                value={updatedPatientData.weight}
                onChange={(e) => setUpdatedPatientData({ ...updatedPatientData, weight: e.target.value })}
              />
              <input
                type="text"
                value={updatedPatientData.bodyFatPercentage}
                onChange={(e) => setUpdatedPatientData({ ...updatedPatientData, bodyFatPercentage: e.target.value })}
              />
              <input
                type="text"
                value={updatedPatientData.bmi}
                onChange={(e) => setUpdatedPatientData({ ...updatedPatientData, bmi: e.target.value })}
              />
              <select name="gender" value={updatedPatientData.gender} onChange={(e) => 
                setUpdatedPatientData({ ...updatedPatientData, gender: e.target.value })}>
                <option value="male">Erkek</option>
                <option value="female">Kadın</option>
              </select>

              <button onClick={handleUpdatePatient}>Güncelle</button>
            </div>
          ) : (
            <div className="patient-info">
              <h2>{selectedPatient.name}</h2>
              <p>TC Numarası: {selectedPatient.tcNumber}</p>
              <p>Telefon: {selectedPatient.phoneNumber}</p>
              <p>Eposta: {selectedPatient.email}</p>
              <p>Doğum Günü: {selectedPatient.birthDate}</p>
              <p>Boy: {selectedPatient.height}</p>
              <p>Kilo: {selectedPatient.weight}</p>
              <p>Vücut Yağ Oranı: {selectedPatient.bodyFatPercentage}</p>
              <p>BMI: {selectedPatient.bmi}</p>
              <p>Cinsiyet: {selectedPatient.gender === "male" ? "Erkek" : "Kadın"}</p>
              <p>Hedef Kilo: {selectedPatient.targetWeight}</p>
            </div>
          )}
        </div>
      )}
      {showPopup && (
        <PatientFormPopup
          patientData={updatedPatientData}
          setPatientData={setUpdatedPatientData}
          onClose={handlePopupClose}
          onSubmit={handleAddPatientSubmit}
          onFileChange={(e) => setUpdatedPatientData({ ...updatedPatientData, file: e.target.files[0] })}
        />
      )}
    </div>
  );
};

export default PatientList;
